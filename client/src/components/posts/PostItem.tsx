import { faCircleCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';
import { Post } from '../../containers/posts/PostListContainer';
import { AxiosResponse } from 'axios';
import * as profileAPI from '../../lib/api/profile';
import { UserContext } from '../../contexts/UserContext';

type PostItemProps = {
    post: Post;
    imgURL: string;
    completePost: (_id: string) => void;
    deletePost: (_id: string) => void;
    status: string;
};

const PostItem: React.FC<PostItemProps> = ({
    post,
    imgURL,
    completePost,
    deletePost,
    status,
}) => {
    const { user } = useContext(UserContext);
    const { publishedDate, deadlineDate, tags, title, body, _id } = post;
    const [deadlineString, setDeadlineString] = useState('');
    const username = post.user.username;
    const [owner, setOwner] = useState<boolean>(false);

    const [init, setInit] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setInit(true);
        }, 250);

        if (user!.username === username) {
            setOwner(true);
        }
        setDeadlineString(displayDate(new Date(deadlineDate)));
    }, []);

    const displayDate = (date: Date) => {
        const now = new Date();
        const daysOfWeekShort = [
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
        ];

        const dayDifference = Math.floor(
            (date.getTime() - now.getTime()) / (1000 * 3600 * 24),
        );
        if (dayDifference < 0) {
            return 'Past';
        } else if (dayDifference === 0) {
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            });
        } else if (dayDifference < 7) {
            const dayOfWeek = daysOfWeekShort[date.getDay()];
            return `${dayOfWeek}`;
        } else {
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
                <div className='post-body'>{body}</div>
            </div>

            <div className="post-owner">
                {owner &&
                    (status === 'upcoming' ? (
                        <FontAwesomeIcon
                            onClick={() => completePost(post._id)}
                            icon={faCircleCheck}
                        />
                    ) : (
                        <FontAwesomeIcon
                            onClick={() => deletePost(post._id)}
                            icon={faTrash}
                        />
                    ))}

                <img src={imgURL} alt="" />
            </div>
        </div>
    );
};

export default PostItem;
