import { useEffect, useRef, useState } from 'react';
import { PostFormData } from '../posts/PostListContainer';
import SendMessage from '../../components/chat/SendMessage';

type SendMessageContainerProps = {
    sendMessage: (message: string) => void;
    createPost: (formData: PostFormData) => void;
};

const SendMessageContainer: React.FC<SendMessageContainerProps> = ({
    sendMessage,
    createPost,
}) => {
    const [message, setMessage] = useState('');
    const [todo, setTodo] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const titleRef = useRef<HTMLInputElement | null>(null);
    const bodyRef = useRef<HTMLInputElement | null>(null);
    const deadlineRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (todo && titleRef.current) {
            const range = document.createRange();
            range.selectNodeContents(titleRef.current);
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
            }
            titleRef.current.focus();
        }
    }, [todo]);

    const handleInputChange = (event: React.FormEvent<HTMLSpanElement>) => {
        const target = event.target as HTMLSpanElement;
        if (target.innerText === '/todo') {
            setTodo(true);
            // const range = document.createRange();
            // range.selectNodeContents(titleRef.current);
            // const selection = window.getSelection();
            // if (selection) {
            //     selection.removeAllRanges();
            //     selection.addRange(range);
            // }
            // titleRef.current.focus();
            //바로 뒤라고 이녀석아
        } else {
            setTodo(false);
        }
        setMessage(target.textContent!);
    };

    const selectRefContent = (
        elementRef: React.RefObject<HTMLSpanElement | null>,
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

    const isContentEmpty = (element: HTMLSpanElement) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        if (range.toString() === '') {
            return true;
        }
        return false;
    };

    const handlePrevNext = (event: React.KeyboardEvent<HTMLSpanElement>) => {
        const target = event.target as HTMLSpanElement;

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
                    body: bodyRef.current!.innerText,
                    deadline: deadlineRef.current!.innerText,
                });
                setMessage('');
                inputRef.current!.innerText = '';
                setTodo(false);
                inputRef.current!.focus();
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
                selectRefContent(inputRef, true);
                inputRef.current!.focus();
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

    const handleEnter = (event: React.KeyboardEvent<HTMLSpanElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent line break
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (message === '') {
            return;
        }
        console.log(message);
        sendMessage(message);
        setMessage('');
        inputRef.current!.innerText = '';
    };

    return (
        <SendMessage
            todo={todo}
            inputRef={inputRef}
            titleRef={titleRef}
            bodyRef={bodyRef}
            deadlineRef={deadlineRef}
            handleInputChange={handleInputChange}
            handlePrevNext={handlePrevNext}
            handleEnter={handleEnter}
            handleSubmit={handleSubmit}
        />
    );
};

export default SendMessageContainer;
