import Messages from './Messages';
import { styled } from 'styled-components';
import SendMessage from './SendMessage';
import io, { Socket } from 'socket.io-client';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { GroupContext } from '../../contexts/GroupContext';
import { useParams } from 'react-router-dom';

const ChatBlock = styled.div`
    width: 65%;
    height: 80%;
    display: grid;
    
    grid-template-rows: 8fr 1fr;
    gap: 20px;

    border: 1px solid white;
    border-radius: 10px;
    padding: 15px;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const Chat: React.FC = () => {
    const socket: Socket = io('http://localhost:4000');

    const { user } = useContext(UserContext);
    const { groupID } = useParams()

    if (!user || !groupID) {
        // Render a loading state or handle the case when user or group is null
        console.log(user)
        console.log(groupID)
        
        return <div>Loading...</div>;
    }

    socket.emit('join_room', groupID);

    return (
        <ChatBlock>
            <Messages socket={socket} />
            <SendMessage
                socket={socket}
                username={user!.username}
                groupID={groupID}
            ></SendMessage>
        </ChatBlock>
    );
};

export default Chat;
