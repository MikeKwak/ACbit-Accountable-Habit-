import MessagesReceived from './MessagesReceived';
import { styled } from 'styled-components';
import SendMessage from './SendMessage';
import io, { Socket } from 'socket.io-client';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { GroupContext } from '../../contexts/GroupContext';

const ChatBlock = styled.div`
    width: 700px;
    height: 600px;
    display: grid;
    
    grid-template-rows: 8fr 1fr;
    gap: 20px;

    border: 1px solid black;
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
    const { group } = useContext(GroupContext);
  

    if (!user || !group) {
        // Render a loading state or handle the case when user or group is null
        return <div>Loading...</div>;
    }

    socket.emit('join_room', group);

    return (
        <ChatBlock>
            <MessagesReceived socket={socket} />
            <SendMessage
                socket={socket}
                username={user!.username}
                groupID={group!.groupID}
            ></SendMessage>
        </ChatBlock>
    );
};

export default Chat;
