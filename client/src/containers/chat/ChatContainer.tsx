import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import Chat from '../../components/chat/Chat';
import { UserContext } from '../../contexts/UserContext';
import { PostsContext } from '../../contexts/PostsContext';
import { Post, PostFormData } from '../posts/PostListContainer';
import * as postAPI from '../../lib/api/posts';
import { AxiosResponse } from 'axios';


export type Message = {
    message: String;
    groupID: String;
    username: String;
    createdTime: Date;
};

const ChatContainer = () => {
    const { user } = useContext(UserContext);
    const { setPosts } = useContext(PostsContext);
    const { groupID } = useParams();
    const [messages, setMessages] = useState<Message[]>([]);
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
            .then((res: AxiosResponse<Post>) => {
                setPosts((prevPosts) => [...prevPosts, res.data]);
                
            })
            .catch((error) => {
                console.error('Error fetching groups:', error);
            });
    };

    return(
        <Chat socket={socket.current!} messages={messages} sendMessage={sendMessage} createPost={createPost}/>
    )
};

export default ChatContainer;
