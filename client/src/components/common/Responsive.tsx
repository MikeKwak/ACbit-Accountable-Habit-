import { css, styled } from "styled-components";

interface ResponsiveBlockProps{
    center? : boolean;
}

const ResponsiveBlock = styled.div<ResponsiveBlockProps>`
    padding-left: 1rem;
    padding-right: 1rem;
    width: 1024px;
    margin: 0 auto;
    
    @media (max-width: 1024px) {
        width: 768px;
    }

    @media (max-width: 768px) {
        width: 100%;
    }

    ${(props) => 
        props.center &&
        css`
            display: flex;
            justify-content: center;
        `}
`

interface ResponsiveProps extends ResponsiveBlockProps{
    children: React.ReactNode;
}

const Responsive: React.FC<ResponsiveProps> = ({ children, ...rest }) => {
    return <ResponsiveBlock {...rest}>{children}</ResponsiveBlock>
}

export default Responsive;