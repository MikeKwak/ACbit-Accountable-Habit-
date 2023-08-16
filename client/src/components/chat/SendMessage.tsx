import React, { useEffect, useRef, useState } from 'react';
import Button from '../common/Button';
import '../../styles/chat/Chat.css';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PostFormData } from '../../containers/posts/PostListContainer';

type SendMessageProps = {
    sendMessage: (message: string) => void;
};

const SendMessage: React.FC<SendMessageProps> = ({ sendMessage }) => {
    const [message, setMessage] = useState('');

    const [todo, setTodo] = useState(false);
    const [title, setTitle] = useState<string | null>(null);
    const [body, setBody] = useState<string | null>(null);
    const [deadline, setDeadline] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const titleRef = useRef<HTMLInputElement | null>(null);
    const bodyRef = useRef<HTMLInputElement | null>(null);
    const deadlineRef = useRef<HTMLInputElement | null>(null);

    const handleInputChange = (event: React.FormEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        if (target.innerText === '/todo') {
            setTodo(true);
            setTimeout(() => {
                const range = document.createRange();
                range.selectNodeContents(titleRef.current!);
                const selection = window.getSelection();
                if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
                titleRef.current!.focus();
            }, 0.1);
        } else {
            setTodo(false);
        }
        setMessage(target.textContent!);
    };

    const selectRefContent = (
        elementRef: React.RefObject<HTMLDivElement | null>,
        backslash?: boolean,
    ) => {
        const range = document.createRange();
        range.selectNodeContents(elementRef.current!);
        if (backslash) range.collapse(false);
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    const isContentEmpty = (element: HTMLDivElement) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        if (range.toString() === '') {
            return true;
        }
        return false;
    };

    const handlePrevNext = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;

        if ((event.key === 'Tab' || event.key === 'Enter') && !event.shiftKey) {
            event.preventDefault();
            if (target === titleRef.current) {
                //move focus to body and select
                bodyRef.current!.focus();
                selectRefContent(bodyRef);
            } else if (target === bodyRef.current) {
                //mvoe focus to deadline and select
                deadlineRef.current!.focus();
                selectRefContent(deadlineRef);
            } else if (target === deadlineRef.current) {
                //API call for creating Todo
                createPost({
                    title: titleRef.current!.innerText,
                    tags: '', // You need to set the tags value here
                    body: bodyRef.current!.innerText,
                    deadline: deadlineRef.current!.innerText,
                });
                setMessage('');
                inputRef.current!.innerText = '';
                setTodo(false);
                setTimeout(() => {
                    inputRef.current!.focus();
                }, 0.1);
            }
        } else if (
            isContentEmpty(target) &&
            event.key === 'Backspace' &&
            !event.shiftKey
        ) {
            event.preventDefault();
            if (target.className === 'title') {
                //move focus to input
                setTodo(false);
                setTimeout(() => {
                    selectRefContent(inputRef, true);
                    inputRef.current!.focus();
                }, 0.1);
            } else if (target.className === 'body') {
                //move focus to title
                selectRefContent(titleRef, true);
                titleRef.current!.focus();
            } else if (target.className === 'deadline') {
                //mvoe focus to body
                selectRefContent(bodyRef, true);
                bodyRef.current!.focus();
            }
        }
    };

    const handleSend = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent line break
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (message === '') {
            return;
        }
        sendMessage(message);
        setMessage('');
        inputRef.current!.innerText = '';
    };

    const createPost = (formData: PostFormData) => {
        postAPI
            .create(groupID!, formData)
            .then((res: AxiosResponse<Post>) => {
                setPosts((prevPosts) => [...prevPosts, res.data]);
            })
            .catch((error) => {
                console.error('Error fetching groups:', error);
            });
    };

    return (
        <div className="textarea-block">
            <div className="textarea-section">
                <div
                    className="textarea-container"
                    style={{ backgroundColor: todo ? 'lightblue' : '' }}
                    onClick={todo ? undefined : () => inputRef.current!.focus()}
                >
                    <div
                        className="textarea"
                        ref={inputRef}
                        contentEditable={todo ? false : true}
                        onInput={handleInputChange}
                        onKeyDown={handleSend}
                    ></div>
                    <div
                        className="title"
                        ref={titleRef}
                        contentEditable="true"
                        style={{ display: todo ? 'inline' : 'none' }}
                        onKeyDown={handlePrevNext}
                    >
                        title
                    </div>
                    <div
                        className="body"
                        ref={bodyRef}
                        contentEditable="true"
                        style={{ display: todo ? 'inline' : 'none' }}
                        onKeyDown={handlePrevNext}
                    >
                        description
                    </div>
                    <div
                        className="deadline"
                        ref={deadlineRef}
                        contentEditable="true"
                        style={{ display: todo ? 'inline' : 'none' }}
                        onKeyDown={handlePrevNext}
                    >
                        deadline
                    </div>
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
