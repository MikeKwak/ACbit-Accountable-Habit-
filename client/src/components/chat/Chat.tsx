import Messages from './Messages';
import SendMessage from './SendMessage';
import { Socket } from 'socket.io-client';
import '../../styles/chat/Chat.scss'
import { Message } from '../../containers/chat/ChatContainer';

type ChatProps = {
    socket: Socket;
    messages: Message[];
    sendMessage: (message: string) => void;
}

const Chat: React.FC<ChatProps> = ({ socket, messages, sendMessage }) => {

    return (
        <div className='chat-block'>
            <Messages messages={messages}/>
            <SendMessage
                sendMessage={sendMessage}
            ></SendMessage>
        </div>
    );
};

export default Chat;
