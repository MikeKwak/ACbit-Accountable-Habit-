import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Message } from '../../containers/chat/ChatContainer';
import * as profileAPI from '../../lib/api/profile';
import { AxiosResponse } from 'axios';

type MessageProps = {
    message: Message;
};

const MessageItem: React.FC<MessageProps> = ({ message }) => {
    const { user } = useContext(UserContext);
    const [imageURL, setImageURL] = useState<string>('');

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        profileAPI
            .getImage(message.username)
            .then((res: AxiosResponse<string>) => {
                setImageURL(res.data);
            });
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message]);

    return (
        <div
            ref={ref}
            className={`message-block ${
                message.username === user!.username ? 'owner' : ''
            }`}
        >
            <img className="message-profile" src={imageURL} alt="" />
            <div className="message-content">
                <div className="message-username">{message.username}</div>
                <p>{message.message}</p>
            </div>
            <div className="message-info">
                {new Date(message.createdTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                })}
            </div>
        </div>
    );
};

export default MessageItem;
