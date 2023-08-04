import React, { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import palette from '../../lib/styles/palette';

interface StyledButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    fullWidth?: boolean;
    cyan?: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: bold;
    padding: 0.25rem 1rem;
    color: white;
    outline: none;
    cursor: pointer;

    background: ${palette.gray[8]};
    &:hover {
        background: ${palette.gray[6]};
    }

    ${(props) =>
        props.fullWidth &&
        css`
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
            width: 100%;
            font-size: 1.125rem;
        `}

    ${(props) =>
        props.cyan &&
        css`
            background: ${palette.cyan[5]};
            &:hover {
                background: ${palette.cyan[4]};
            }
        `}
`;

interface ButtonProps extends StyledButtonProps {
    to?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button : React.FC<ButtonProps> = ({ to, ...rest }) => {
    const navigate = useNavigate();
    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (to) {
            navigate(to);
        }
        if (rest.onClick) {
            rest.onClick(e);
        }
    };
    return <StyledButton {...rest} onClick={onClick} />;
};

export default Button;
