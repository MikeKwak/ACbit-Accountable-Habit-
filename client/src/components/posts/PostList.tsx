import React, { useState, useContext, useEffect } from 'react';
import { Post, PostFormData } from '../../containers/posts/PostListContainer';
import CreatePostModal from './CreatePostModal';
import { UserContext } from '../../contexts/UserContext';
import '../../styles/posts/PostList.scss';
import Upcoming from '../../img/upcoming.png';
import Completed from '../../img/completed.png';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PostItem from './PostItem';

interface PostListProps {
    posts: Post[];
    loading: boolean;
    error: boolean;
    createPost: (formData: PostFormData) => void;
    completePost: (_id: string) => void;
    deletePost: (_id: string) => void;
}

const PostList: React.FC<PostListProps> = ({
    posts,
    loading,
    error,
    createPost,
    completePost,
    deletePost,
}) => {
    const [createModalIsOpen, setCreateModalIsOpen] = useState<boolean>(false);
    const { user } = useContext(UserContext);
    //'createAt', 'deadline', 'user'
    const [sortOption, setSortOption] = useState<string>('createdAt');
    const [status, setStatus] = useState<string>('upcoming');

    const sortedPosts: Post[] = [...posts];

    if (sortOption === 'createdAt') {

        sortedPosts.sort((a, b) => new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime());
        
      } else if (sortOption === 'deadline') {
        sortedPosts.sort((a, b) => new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime());
        console.log(sortedPosts);
      } else if (sortOption === 'user') {
        sortedPosts.sort((a, b) => { if (a.user.username === user!.username) {
            return -1; // a comes before b
        } else if (b.user.username === user!.username) {
            return 1; // b comes before a
        } else {
            return a.user.username.localeCompare(b.user.username);
        }});
      }

    // useEffect(() => {
        
    // }, [sortOption]);

    if (!user || error) {
        return (
            <div className="post-block">Error : User / Group not selected</div>
        );
    }

    return (
        <div className="postlist-block">
            <div className="postlist-header">
                <div style={{ display: 'flex', backgroundColor: '#ededed' }}>
                    <a
                        className={status === 'upcoming' ? 'active' : ''}
                        onClick={() => setStatus('upcoming')}
                    >
                        <img src={Upcoming} alt="" />
                        Upcoming
                    </a>
                    <a
                        className={status === 'completed' ? 'active' : ''}
                        onClick={() => setStatus('completed')}
                    >
                        <img src={Completed} alt="" />
                        Completed
                    </a>
                </div>

                <div
                    style={{
                        display: 'flex',
                        margin: 'auto 0px',
                        justifyContent: 'space-between',
                        position: 'relative',
                    }}
                >
                    <div className="sort-by">
                        <select value={sortOption} onChange={(e) => {setSortOption(e.target.value);}}>
                            <option value="createdAt">Sort by Create Date</option>
                            <option value="deadline">Sort by Deadline</option>
                            <option value="user">Categorized by User</option>
                        </select>
                        {/* <p>sort by:</p>
                        <p className="sort-state">{sort}</p>
                        <a href="">
                            <FontAwesomeIcon icon={faCaretDown} />
                        </a> */}
                    </div>
                    <a
                        className="create-button"
                        onClick={() => setCreateModalIsOpen(true)}
                    >
                        Create Todo
                    </a>
                </div>
            </div>

            <CreatePostModal
                isOpen={createModalIsOpen}
                onRequestClose={() => setCreateModalIsOpen(false)}
                createPost={createPost}
            />

            {!loading && posts && status === 'upcoming' && (
                <div>
                    {sortedPosts
                        .filter((post) => post.status === 'upcoming')
                        .map((post) => (
                            <PostItem
                                post={post}
                                completePost={completePost}
                                deletePost={deletePost}
                                status={status}
                                key={post._id}
                            />
                        ))}
                </div>
            )}

            {!loading && posts && status === 'completed' && (
                <div>
                    {sortedPosts
                        .filter((post) => post.status === 'completed')
                        .map((post) => (
                            <PostItem
                                post={post}
                                completePost={completePost}
                                deletePost={deletePost}
                                status={status}
                                key={post._id}
                            />
                        ))}
                </div>
            )}
        </div>
    );
};

export default PostList;
