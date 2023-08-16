import React, { useState, useContext, useEffect } from 'react';
import { Post, PostFormData } from '../../containers/posts/PostListContainer';
import CreatePostModal from './CreatePostModal';
import { UserContext } from '../../contexts/UserContext';
import '../../styles/posts/PostList.scss';
import Upcoming from '../../img/upcoming.png';
import Completed from '../../img/completed.png';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type PostItemProps = {
    post: Post;
    completePost: (_id: string) => void;
};

const PostItem: React.FC<PostItemProps> = ({ post, completePost }) => {
    const { publishedDate, deadlineDate, tags, title, body, _id } = post;
    const [deadlineString, setDeadlineString] = useState('')
    const user = post.user;
    const [init, setInit] = useState(false);
    const [timeState, setTimeState] = useState('');
   
    useEffect(() => {
        setTimeout(() => {
            setInit(true);
        }, 250);
        // displayDate(new Date(deadlineDate))
        console.log(title)
        setDeadlineString(displayDate(new Date(deadlineDate)))
    }, []);

    const displayDate = (date: Date) => {
        const now = new Date();
        const daysOfWeekShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
        const dayDifference = Math.floor((date.getTime() - now.getTime()) / (1000 * 3600 * 24));
        if (dayDifference < 0) {
            setTimeState('past');
            return 'Past';
        } else if (dayDifference === 0) {
            setTimeState('today');
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });
        } else if (dayDifference < 7) {
            setTimeState('week')
            const dayOfWeek = daysOfWeekShort[date.getDay()];
            return `${dayOfWeek}`;
        } else {
            setTimeState('later')
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${month}-${day}`;
        }
    };

    
    
    return (
        <div className="post-block">
            <div className={`liner ${init ? 'init' : ''}`}></div>

            <div className="post-deadline">
                <b>{deadlineString}</b>
            </div>

            <div className="post-content">
                <h3>{title}</h3>
                <div>#webdev #work</div>
                <p>{body}</p>
            </div>

            <div className="post-owner">
                <img src={user.imgURL} alt="" />
            </div>
        </div>
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
