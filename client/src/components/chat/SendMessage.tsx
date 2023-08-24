import React from 'react';
import Button from '../common/Button';
import '../../styles/chat/Chat.css';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type SendMessageProps = {
    todo: boolean;
    inputRef: React.RefObject<HTMLInputElement>;
    titleRef: React.RefObject<HTMLInputElement>;
    bodyRef: React.RefObject<HTMLInputElement>;
    deadlineRef: React.RefObject<HTMLInputElement>;
    handleInputChange: (event: React.FormEvent<HTMLSpanElement>) => void;
    handlePrevNext: (event: React.KeyboardEvent<HTMLSpanElement>) => void;
    handleEnter: (event: React.KeyboardEvent<HTMLSpanElement>) => void;
    handleSubmit: () => void;
};

const SendMessage: React.FC<SendMessageProps> = ({
    todo,
    inputRef,
    titleRef,
    bodyRef,
    deadlineRef,
    handleInputChange,
    handlePrevNext,
    handleEnter,
    handleSubmit,
}) => {

    return (
        <div className="textarea-block">
            <div className="textarea-section">
                <div
                    className="textarea-container"
                    style={{ backgroundColor: todo ? 'lightblue' : '' }}
                    onClick={todo ? undefined : () => inputRef.current!.focus()}
                >
                    <span
                        className="textarea"
                        ref={inputRef}
                        contentEditable='true'
                        onInput={handleInputChange}
                        onKeyDown={handleEnter}
                    ></span>

                    {todo && (
                        <>
                            <span
                                className="title"
                                ref={titleRef}
                                contentEditable="true"
                                onKeyDown={handlePrevNext}
                            >
                                title
                            </span>
                            <span
                                className="body"
                                ref={bodyRef}
                                contentEditable="true"
                                onKeyDown={handlePrevNext}
                            >
                                body
                            </span>
                            <span
                                className="deadline"
                                ref={deadlineRef}
                                contentEditable="true"
                                onKeyDown={handlePrevNext}
                            >
                                deadline
                            </span>
                        </>
                    )}
                </div>
            </div>
            <div className="send-container">
                <Button className="send-button" onClick={handleSubmit}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
            </div>
        </div>
    );
};

export default SendMessage;
