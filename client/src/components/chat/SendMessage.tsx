import React, { useState } from 'react'
import Button from "../common/Button";
import '../../styles/chat/Chat.css'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type SendMessageProps = {
    sendMessage: (message: string) => void;
}

const SendMessage: React.FC<SendMessageProps> = ({ sendMessage }) => {
    const [message, setMessage] = useState('');
    const [todo, setTodo] = useState(false);

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


        if (message.startsWith('/todo')) {
            setTodo(true);
            const next = document.querySelector('title') as HTMLDivElement | null;
            next?.focus();
        } else {
            setTodo(false);
        }
    };

    const commands = ['textarea', 'title', 'body', 'deadline']

    const handlePrevNext = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;


        if (commands.indexOf(target.className) == 0) {
            if (todo && event.key === 'Space') {
                //move focus to div.title
                const children = event.currentTarget.children;
                const titleElement = Array.from(children).find(child =>
                    child.classList.contains('title')
                ) as HTMLElement | undefined;
                console.log(titleElement?.className);
                titleElement?.focus();
            } else if (event.key === 'Enter' && !event.shiftKey) {

            }
        }
    }

    const handleSend = (event: React.KeyboardEvent<HTMLDivElement>) => {
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
                <div className='textarea' style={todo ? { backgroundColor: 'lightblue' } : {}} contentEditable="true" onInput={handleInputChange} onKeyDown={todo ? handlePrevNext : handleSend}>
                    {todo && (
                        <>
                            <div className="title" contentEditable="true"></div>
                            <div className="body" contentEditable="true">body</div>
                            <div className="deadline" contentEditable="true">deadline</div>
                        </>
                    )}

                </div>
            </div>
            <div className="send-container">
                <Button className='send-button' onClick={handleSubmit}><FontAwesomeIcon icon={faPaperPlane} /></Button>
            </div>
        </div>
    )
}

export default SendMessage