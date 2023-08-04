import React, { useEffect, useState } from 'react';
import PostList from '../../components/posts/PostList';
import axios, { AxiosResponse } from 'axios';
import { useParams } from 'react-router-dom';
import * as postAPI from '../../lib/api/posts';

export type Post = {
    _id: string;
    title: string;
    body: string;
    tags: string[];
    publishedDate: Date;
    user: {
        _id: string;
        username: string;
    };
};

export type PostFormData = {
    title: string;
    body: string;
};

const PostListContainer: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<boolean>(false);
    const { groupID } = useParams();

    const createPost = (formData: PostFormData) => {
        postAPI
            .create(groupID!, formData)
            .then((res: AxiosResponse<Post>) => {
                setPosts((prevPosts) => [...prevPosts, res.data]);
            })
            .catch((error) => {
                console.error('Error fetching groups:', error);
            });
    };

    const completePost = (_id: string) => {
        postAPI
            .complete(groupID!, _id)
            .then(() => {
                setPosts(posts.filter((post) => post._id !== _id));
            })
            .catch((e) => {
                console.log(e);
            });
    };

    useEffect(() => {
        setLoading(true);
        axios
            .get<Post[]>(`/api/posts/${groupID}`)
            .then((response) => {
                setPosts(response.data); // Update the state with the fetched posts
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching posts:', error);
                setError(true);
                setLoading(false);
            });
    }, []);

    return (
        <PostList
            loading={loading}
            error={error}
            posts={posts}
            createPost={createPost}
            completePost={completePost}
        />
    );
};

export default PostListContainer;
