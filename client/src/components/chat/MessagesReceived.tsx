import { useState, useEffect, useContext } from 'react';
import { Socket } from 'socket.io-client';
import { styled, css } from 'styled-components';
import { UserContext } from '../../contexts/UserContext';

type Message = {
    message: String;
    groupID: String;
    username: String;
    createdTime: Date;
};

const MessagesBlock = styled.div`
    border: 1px solid black;
    overflow-y: scroll;
    width: 100%;
    display: flex;
  flex-direction: column;
`;

type ChatMessageProps = {
    isCurrentUser: boolean;
};

const ChatMessage = styled.div<ChatMessageProps>`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    max-width: 80%;
    background-color: #f0f0f0;
    border-radius: 8px;
    padding: 10px;

    ${(props) =>
        props.isCurrentUser &&
        css`
            align-self: flex-end;
            background-color: #ffc0cb;
        `}
`;

const ChatUsername = styled.div`
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
`;

const ChatContent = styled.div`
    color: #000;
`;

const ChatTimeStamp = styled.div`
    font-size: 12px;
    color: #888;
    margin-top: 5px;
`;

type MessagesReceivedProps = {
    socket: Socket;
};

const MessagesReceived: React.FC<MessagesReceivedProps> = ({ socket }) => {
    const [messagesRecieved, setMessagesReceived] = useState<Message[]>([]);
    const { user } = useContext(UserContext);

    // Runs whenever a socket event is recieved from the server
    useEffect(() => {
        const receiveMessageHandler = (data: Message) => {
            // console.log(data.message);
            setMessagesReceived((prevState: Message[]) => [
                ...prevState,
                {
                    message: data.message,
                    groupID: data.groupID,
                    username: data.username,
                    createdTime: data.createdTime,
                },
            ]);
        };

        const prevMessagesHandler = (datas: Message[]) => {
            datas.forEach((data) => receiveMessageHandler(data))
        }

        // Attach the 'receive_message' event listener
        socket.on('receive_message', receiveMessageHandler);
        socket.on('last100_messages', prevMessagesHandler);
        // Remove event listener on component unmount
        return () => {
            socket.off('receive_message', receiveMessageHandler);
        };
    }, [socket]);

    function formatDateFromTimestamp(timestamp: Date) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    return (
        <MessagesBlock>
            {messagesRecieved.map((msg, i) => (
                <ChatMessage isCurrentUser={user!.username === msg.username}>
                    <ChatUsername>{msg.username}</ChatUsername>
                    <ChatContent>{msg.message}</ChatContent>
                    <ChatTimeStamp>
                        {formatDateFromTimestamp(msg.createdTime)}
                    </ChatTimeStamp>
                </ChatMessage>
            ))}
        </MessagesBlock>
    );
};

export default MessagesReceived;
