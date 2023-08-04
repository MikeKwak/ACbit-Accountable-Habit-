import { styled } from "styled-components";
import React, { useState } from 'react'
import Button from "../common/Button";
import { Socket } from "socket.io-client";
import axios from "axios";

const SendMessageBlock = styled.div`

    display: grid;
    grid-template-columns: 7fr 1fr;
`

const MessageInput = styled.input`
    margin: 10px;
`

type SendMessageProps = {
    socket: Socket;
    username: string;
    groupID: string;
}

const SendMessage: React.FC<SendMessageProps> = ({ socket, username, groupID }) => {
    const [ message, setMessage ] = useState('');

    const sendMessage = () => {
        if (message !== ''){
            // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
            // axios.post
            const createdTime = Date.now();
            socket.emit('send_message', { message, username, groupID, createdTime });
            setMessage('');
        }
    }

    return(
        <SendMessageBlock>
            <MessageInput
            placeholder='...'
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            />
            <Button onClick={sendMessage}>Send</Button>
        </SendMessageBlock>
    )
}

export default SendMessage