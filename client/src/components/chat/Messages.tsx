import MessageItem from './MessageItem';
import '../../styles/chat/Chat.scss';
import { Message } from '../../containers/chat/ChatContainer';
import { UserContext } from '../../contexts/UserContext';
import { useContext } from 'react';
import defaultPicture from '../../img/default.png'
import deletedPicture from '../../img/default.png'


type MessagesProps = {
    messages: Message[];
    users: {
        username: string;
        imgURL: string;
    }[];
};

const Messages: React.FC<MessagesProps> = ({ messages, users }) => {
    const { user } = useContext(UserContext);
    
    const getUserImgURL = (username: string) => {
        if (username === user!.username && user!.imgURL) {
            return user!.imgURL;            
        }

        const groupUser = users.find((user) => user.username === username);
        if (!groupUser){
            return deletedPicture;
        } else {
            if (groupUser.imgURL) {
                return groupUser.imgURL;
            } 
        }
        return defaultPicture;
    };

    return (
        <div className="messages-block">
            {messages.map((msg, i) => (
                <MessageItem message={msg}  imgURL={msg.username === user!.username ? (user!.imgURL ? user!.imgURL : defaultPicture): getUserImgURL(msg.username)} key={i} />
            ))}
        </div>
    );
};

export default Messages;
