import Messages from './Messages';
import SendMessage from './SendMessage';
import { Socket } from 'socket.io-client';
import '../../styles/chat/Chat.scss'
import { Message } from '../../containers/chat/ChatContainer';
import { PostFormData } from '../../containers/posts/PostListContainer';

type ChatProps = {
    socket: Socket;
    messages: Message[];
    sendMessage: (message: string) => void;
    createPost: (formData: PostFormData) => void;
    users: {
        username: string;
        imgURL: string;
    }[];

}

const Chat: React.FC<ChatProps> = ({ socket, messages, users, sendMessage, createPost }) => {

    return (
        <div className='chat-block'>
            <Messages messages={messages} users={users} />
            <SendMessage
                sendMessage={sendMessage}
                createPost={createPost}
            ></SendMessage>
        </div>
    );
};

export default Chat;
