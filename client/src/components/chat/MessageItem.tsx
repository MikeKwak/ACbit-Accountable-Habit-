import React, { HTMLAttributes, useContext, useEffect, useRef } from "react";
import { styled, css } from "styled-components";
import { UserContext } from "../../contexts/UserContext";
import { Message } from './Messages'

interface StyledMessageBlockProps extends HTMLAttributes<HTMLDivElement> {
    owner?: boolean;
}

const MessageBlock = styled.div<StyledMessageBlockProps>`
    display: flex;
    gap: 20px;
    margin-bottom: 20px;

    ${(props) =>
        props.owner &&
        css`
            align-self: flex-end;
            background-color: #ffc0cb;
        `}
`

const MessageInfo = styled.div`
    display: flex;
            flex-direction: column;
            color: gray;
            font-weight: 300;
`

const MessageContent = styled.div`
    max-width: 80%;
            display: flex;
            flex-direction: column;
            gap: 10px;
`

const MessageText = styled.p`
    background-color: white;
              padding: 10px 20px;
              border-radius: 0px 10px 10px 10px;
              max-width: max-content;
`

type MessageProps = {
    message: Message;
}

const MessageItem: React.FC<MessageProps> = ({ message }) => {
    const { user } = useContext(UserContext);

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return (
        <MessageBlock ref={ref} owner={message.username === user!.username ? true : false} >
            <MessageInfo>
                <span>just now</span>
            </MessageInfo>
            <MessageContent>
                <MessageText>{message.message}</MessageText>
            </MessageContent>

        </MessageBlock>
    )
}

export default MessageItem;