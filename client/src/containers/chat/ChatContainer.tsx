import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import Chat from '../../components/chat/Chat';
import { UserContext } from '../../contexts/UserContext';
import { Post, PostFormData } from '../posts/PostListContainer';
import * as postAPI from '../../lib/api/posts';
import { AxiosResponse } from 'axios';
import { Group } from '../main/MainContainer';

export type Message = {
    message: string;
    groupID: string;
    username: string;
    createdTime: Date;
};

type ChatContainerProps = {
    group: Group | null;
    setGroup: React.Dispatch<React.SetStateAction<Group | null>>;
}

const ChatContainer:React.FC<ChatContainerProps> = ({ group, setGroup }) => {
    const { user } = useContext(UserContext);
    const { groupID } = useParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string>('')
    const socket = useRef<Socket | null>(null);

    //run when a new socket connection is made (?)
    useEffect(() => {
        if (!socket.current) {
            socket.current = io('http://localhost:4000');
            socket.current.emit('join_room', groupID);
        }
        console.log(socket);

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
            datas.forEach((data) => receiveMessageHandler(data));
        };

        // Attach the 'receive_message' event listener
        socket.current!.on('receive_message', receiveMessageHandler);
        socket.current!.on('last100_messages', prevMessagesHandler);
        // Remove event listener on component unmount
        return () => {
            socket.current!.off('receive_message', receiveMessageHandler);
        };
    }, [socket]);

    const sendMessage = (message: string) => {
        if(message === ''){
            return;
        }
        const createdTime = Date.now();
        socket.current!.emit('send_message', { message, username: user!.username, groupID, createdTime })
    } 

    const createPost = (formData: PostFormData) => {
        postAPI
            .create(groupID!, formData)
            .then((res: AxiosResponse<Post[]>) => {
                setGroup((prevGroup): Group => ({
                    ...prevGroup!,
                    posts: res.data,
                }));
            })
            .catch((e) => {
                if (e.response.status === 400) {
                    if (e.response.data === 'chrono-error') {
                        setError('invalid input for deadline');
                        setTimeout(() => {
                            setError('');
                        }, 3000);
                    } else {
                        setError('failed to create post');
                        setTimeout(() => {
                            setError('');
                        }, 3000);
                    }
                }
            });
    };

    return(
        <Chat error={error} group={group} messages={messages} sendMessage={sendMessage} createPost={createPost}/>
    )
};

export default ChatContainer;
