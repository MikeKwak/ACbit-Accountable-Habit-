import React, { useState, useEffect } from 'react';
import { Post, PostFormData } from '../../containers/posts/PostListContainer';
import CreatePostModal from './CreatePostModal';

import '../../styles/posts/PostList.scss';
import Upcoming from '../../img/upcoming.png';
import Completed from '../../img/completed.png';

import PostItem from './PostItem';


interface PostListProps {
    sortedPosts: Post[];
    loading: boolean;
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    createPost: (formData: PostFormData) => void;
    completePost: (_id: string) => void;
    deletePost: (_id: string) => void;
    sortOption: string;
    setSortOption: React.Dispatch<React.SetStateAction<string>>;
    getUserImgURL: (username: string) => string;
    status: string;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
}

const PostList: React.FC<PostListProps> = ({
    sortedPosts,
    loading,
    error,
    setError,
    createPost,
    completePost,
    deletePost,
    sortOption,
    setSortOption,
    getUserImgURL,
    status,
    setStatus,
}) => {
    const [createModalIsOpen, setCreateModalIsOpen] = useState<boolean>(false);
    const [currentActivePost, setCurrentActivePost] = useState<number | null>(null);

    useEffect(()=>{
        setCurrentActivePost(null);
    },[sortedPosts])

    if (error) {
        console.log(error)
        return (
            <div className="post-block">{error}</div>
        );
    }

    return (
        <div className="postlist-block">
            <div className="postlist-header">
                <div className='postlist-status'>
                    <a className={status === 'upcoming' ? 'active' : ''} onClick={() => setStatus('upcoming')}>
                        <img src={Upcoming} alt="" />
                        Upcoming
                    </a>
                    <a className={status === 'completed' ? 'active' : ''} onClick={() => setStatus('completed')}>
                        <img src={Completed} alt="" />
                        Completed
                    </a>
                </div>

                <div className='postlist-options'>
                    <div className="sort-by">
                        <select value={sortOption} onChange={(e) => {setSortOption(e.target.value);}}>
                            <option value="createdAt">Sort by Create Date</option>
                            <option value="deadline">Sort by Deadline</option>
                            <option value="user">Categorized by User</option>
                        </select>
                    </div>
                    <a className="create-button" onClick={() => setCreateModalIsOpen(true)}>
                        Create Todo
                    </a>
                </div>
            </div>

            <CreatePostModal
                isOpen={createModalIsOpen}
                onRequestClose={() => setCreateModalIsOpen(false)}
                createPost={createPost}
                setError={setError}
            />

            {!loading && (
                (status === 'upcoming' ? (
                    <div>
                        {sortedPosts
                            .filter((post) => post.status === 'upcoming')
                            .map((post,index) => (
                                <div
                                    className={`post-list-item ${currentActivePost === index ? 'on' : 'off'}`} 
                                    key={post._id}
                                    onClick={()=>{
                                        if(index === currentActivePost) {
                                            setCurrentActivePost(null);
                                        }
                                        else {
                                            setCurrentActivePost(index);
                                        }
                                    }}
                                >
                                    <PostItem
                                        post={post}
                                        imgURL={getUserImgURL(post.user.username)}
                                        completePost={completePost}
                                        deletePost={deletePost}
                                        status={status}
                                       
                                    />
                                </div>
                            ))}
                    </div>
                ) : (
                    <div>
                        {sortedPosts
                            .filter((post) => post.status === 'completed')
                            .map((post) => (
                                <PostItem
                                    post={post}
                                    imgURL={getUserImgURL(post.user.username)}
                                    completePost={completePost}
                                    deletePost={deletePost}
                                    status={status}
                                    key={post._id}
                                />
                            ))}
                    </div>
                ))
            )}
        </div>
    );
};

export default PostList;
