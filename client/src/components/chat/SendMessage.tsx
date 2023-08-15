import React, { useState } from 'react'
import { styled } from "styled-components";
import Button from "../common/Button";
import '../../styles/chat/Chat.css'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


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
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        if (message === '') {
            return;
        }
        sendMessage(message);
        setMessage('');
    }

    const handleInputChange = (event: React.FormEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        setMessage(target.innerText);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent line break
            handleSubmit();
            const target = event.target as HTMLDivElement;
            target.innerText = '';
        }
    };

    return (
        <div className='textarea-block'>
            <div className="textarea-container">
                <div className='textarea' contentEditable="true" onInput={handleInputChange} onKeyDown={handleKeyDown}></div>
            </div>
            <div className="send-container">
                <Button className='send-button' onClick={handleSubmit}><FontAwesomeIcon icon={faPaperPlane} /></Button>
            </div>
        </div>
    )
}

export default SendMessage