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
    // const { user } = useContext(UserContext);
    // const { groupID } = useParams();

    // if (!user || !groupID) {
    //     // Render a loading state or handle the case when user or group is null
    //     console.log(user);
    //     console.log(groupID);

    //     return <div>Loading...</div>;
    // }

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
