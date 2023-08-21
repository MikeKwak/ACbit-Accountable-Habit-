import MessageItem from './MessageItem';
import '../../styles/chat/Chat.scss';
import { Message } from '../../containers/chat/ChatContainer';

type MessagesProps = {
    messages: Message[];
    users: {
        username: string;
        imgURL: string;
    }[];
};

const Messages: React.FC<MessagesProps> = ({ messages, users }) => {
    const getUserImgURL = (username: string) => {
        const user = users.find((user) => user.username === username);
        return user ? user.imgURL : null;
    };

    return (
        <div className="messages-block">
            {messages.map((msg, i) => (
                <MessageItem message={msg}  imgURL={getUserImgURL(msg.username)} key={i} />
            ))}
        </div>
    );
};

export default Messages;
