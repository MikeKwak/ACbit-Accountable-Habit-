import Messages from './Messages';
import '../../styles/chat/Chat.scss';
import { Message } from '../../containers/chat/ChatContainer';
import { PostFormData } from '../../containers/posts/PostListContainer';
import { Group } from '../../containers/main/MainContainer';
import SendMessageContainer from '../../containers/chat/SendMessageContainer';

type ChatProps = {
    error: string;
    messages: Message[];
    sendMessage: (message: string) => void;
    createPost: (formData: PostFormData) => void;
    group: Group | null;
};

const Chat: React.FC<ChatProps> = ({
    error,
    messages,
    group,
    sendMessage,
    createPost,
}) => {
    const { name, groupID, users } = group!;

    return (
        <div className="chat-block">
            <div className="chat-header">
                <h2>{name}</h2>
                <p>{groupID}</p>
            </div>
            <Messages messages={messages} users={users} />

            {error ? (
                <p>{error}</p>
            ) : (
                <SendMessageContainer
                    sendMessage={sendMessage}
                    createPost={createPost}
                ></SendMessageContainer>
            )}
        </div>
    );
};

export default Chat;
