import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import palette from '../../lib/styles/palette';
import SubInfo from '../common/SubInfo';
import Tags from '../common/Tags';
import { Link } from 'react-router-dom';
import { Post, PostFormData } from '../../containers/posts/PostListContainer';
import CreatePostModal from './CreatePostModal';
import { UserContext } from '../../contexts/UserContext';
import '../../styles/posts/PostList.scss';
import Upcoming from '../../img/upcoming.png';
import Completed from '../../img/completed.png';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CompletedButton = styled(Button)`
    position: absolute;
    right: 0px;
    &:hover {
        color: darkred;
    }
`;

type PostItemProps = {
    post: Post;
    completePost: (_id: string) => void;
};

const PostItem: React.FC<PostItemProps> = ({ post, completePost }) => {
    const { publishedDate, tags, title, body, _id } = post;
    const username = post.user.username;
    const [init, setInit] = useState(false);
    
    useEffect(() => {
        setTimeout(() => {
            setInit(true);
        }, 250);
    }, []);
    
    return (
        <div className="post-block">
            <div className={`liner ${init ? 'init' : ''}`}></div>

            <div className="post-deadline">
                <b>15 Sep</b>
            </div>

            <div className="post-content">
                <h3>Portfolio Website</h3>
                <div>#webdev #work</div>
                <p>
                    I have to finish my portfolio before getting back to Canada
                    so that I can start applying right away once school term
                    begins
                </p>
            </div>

            <div className="post-owner">img</div>
        </div>

        // <div className="post-block">
        //     <h2>
        //         <Link to={`/@${username}/${_id}`}>{title}</Link>
        //     </h2>
        //     <SubInfo
        //         username={username}
        //         publishedDate={new Date(publishedDate)}
        //     />
        //     <Tags tags={tags} />
        //     <p>{body}</p>
        //     {user && user.username === username ? (
        //         <CompletedButton onClick={() => completePost(_id)}>
        //             Complete
        //         </CompletedButton>
        //     ) : (
        //         <></>
        //     )}
        // </div>
    );
};

interface PostListProps {
    posts: Post[];
    loading: boolean;
    error: boolean;
    createPost: (formData: PostFormData) => void;
    completePost: (_id: string) => void;
}

const PostList: React.FC<PostListProps> = ({
    posts,
    loading,
    error,
    createPost,
    completePost,
}) => {
    const [createModalIsOpen, setCreateModalIsOpen] = useState<boolean>(false);
    const { user } = useContext(UserContext);
    //'createAt', 'deadline', 'user'
    const [sort, setSort] = useState<String>('createdAt');

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
                        className="active"
                        onClick={() => setCreateModalIsOpen(true)}
                    >
                        <img src={Upcoming} alt="" />
                        Upcoming
                    </a>
                    <a onClick={() => setCreateModalIsOpen(true)}>
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
                        <p>sort by:</p>
                        <p className="sort-state">{sort}</p>
                        <a href="">
                            <FontAwesomeIcon icon={faCaretDown} />
                        </a>
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

            {!loading && posts && (
                <div>
                    {posts.map((post) => (
                        <PostItem
                            post={post}
                            completePost={completePost}
                            key={post._id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostList;
