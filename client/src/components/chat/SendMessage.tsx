import React, { useState } from 'react'
import { styled } from "styled-components";
import Button from "../common/Button";

const SendMessageBlock = styled.div`

    display: grid;
    grid-template-columns: 7fr 1fr;
    height:60px;
`

const MessageInput = styled.input`
    margin: 10px;
`

type SendMessageProps = {
    sendMessage: (message: string) => void;
}

const SendMessage: React.FC<SendMessageProps> = ({ sendMessage }) => {
    const [ message, setMessage ] = useState('');

    const handleSubmit = () => {
        if (message === ''){
            return;
        }
        sendMessage(message);
        setMessage('');
    }

    return(
        <SendMessageBlock>
            <MessageInput
            placeholder='...'
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            />
            <Button onClick={handleSubmit}>Send</Button>
        </SendMessageBlock>
    )
}

export default SendMessage