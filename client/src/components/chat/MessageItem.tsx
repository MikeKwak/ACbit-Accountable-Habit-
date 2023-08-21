import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Message } from '../../containers/chat/ChatContainer';
import defaultURL from '../../img/default.png'

type MessageProps = {
    message: Message;
    imgURL: string | null;
};

const MessageItem: React.FC<MessageProps> = ({ message, imgURL }) => {
    const { user } = useContext(UserContext);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // profileAPI
        //     .getImage(message.username)
        //     .then((res: AxiosResponse<string>) => {
        //         setImageURL(res.data);
        //     });
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message]);

    return (
        <div
            ref={ref}
            className={`message-block ${
                message.username === user!.username ? 'owner' : ''
            }`}
        >
            <img className="message-profile" src={imgURL ? imgURL : defaultURL} alt="" />
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
