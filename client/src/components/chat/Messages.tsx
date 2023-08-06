import { useState, useEffect, useContext } from 'react';
import { Socket } from 'socket.io-client';
import { styled, css } from 'styled-components';
import { UserContext } from '../../contexts/UserContext';
import MessageItem from './MessageItem'

export type Message = {
    message: String;
    groupID: String;
    username: String;
    createdTime: Date;
};

const MessagesBlock = styled.div`
    background-color: #ddddf7;
    padding: 10px;
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

type MessagesProps = {
    socket: Socket;
};

const Messages: React.FC<MessagesProps> = ({ socket }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    // Runs whenever a socket event is recieved from the server
    useEffect(() => {
        const receiveMessageHandler = (data: Message) => {
            setMessages((prevState: Message[]) => [
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
            {messages.map((msg, i) => (
                <MessageItem message={msg} key={i}/>
            ))}
        </MessagesBlock>
    );
};

export default Messages;
