import MessageItem from './MessageItem';
import '../../styles/chat/Chat.scss';
import { Message } from '../../containers/chat/ChatContainer';

type MessagesProps = {
    messages: Message[]
};

const Messages: React.FC<MessagesProps> = ({ messages }) => {
    
    // function formatDateFromTimestamp(timestamp: Date) {
    //     const date = new Date(timestamp);
    //     return date.toLocaleString();
    // }

    return (
        <div className="messages-block">
            {messages.map((msg, i) => (
                <MessageItem message={msg} key={i} />
            ))}
        </div>
    );
};

export default Messages;
