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
}

const Chat: React.FC<ChatProps> = ({ socket, messages, sendMessage, createPost }) => {

    return (
        <div className='chat-block'>
            <Messages messages={messages}/>
            <SendMessage
                sendMessage={sendMessage}
                createPost={createPost}
            ></SendMessage>
        </div>
    );
};

export default Chat;
