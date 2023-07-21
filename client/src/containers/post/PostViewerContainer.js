import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'; // Use the new hooks from React Router v6
import { readPost, unloadPost } from '../../modules/post';
import PostViewer from '../../components/post/PostViewer';
import PostActionButtons from '../../components/post/PostActionButtons';
import { setOriginalPost } from '../../modules/write';
import { removePost } from '../../lib/api/posts';

const PostViewerContainer = () => {
    const { postId } = useParams(); // Use the useParams hook to get the URL parameters
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Use the useNavigate hook to get the navigation function
    const { post, error, loading, user } = useSelector(
        ({ post, loading, user }) => ({
            post: post.post,
            error: post.error,
            loading: loading['post/READ_POST'],
            user: user.user,
        }),
    );

    useEffect(() => {
        dispatch(readPost(postId));
        return () => {
            dispatch(unloadPost());
        };
    }, [dispatch, postId]);

    const onEdit = () => {
        dispatch(setOriginalPost(post));
        navigate('/write'); // Use the navigate function to navigate to '/write'
    };

    const onRemove = async () => {
        try {
            await removePost(postId);
            navigate('/'); // Use the navigate function to navigate to the home page
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <PostViewer
            post={post}
            loading={loading}
            error={error}
            actionButtons={
                <PostActionButtons onEdit={onEdit} onRemove={onRemove} />
            }
            ownPost={user && user.id === post && post.id}
        />
    );
};

export default PostViewerContainer;
