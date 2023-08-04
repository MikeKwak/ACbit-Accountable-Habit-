import { useContext } from 'react';
import { styled } from 'styled-components';
import Responsive from './Responsive';
import Button from './Button';
import palette from '../../lib/styles/palette';
import { Link } from 'react-router-dom';
import { User } from '../../contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { GroupContext } from '../../contexts/GroupContext';

const HeaderBlock = styled.div`
    position: fixed;
    width: 100%;
    background: white;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
    z-index: 10;
`;

const Wrapper = styled(Responsive)`
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo {
        font-size: 1.125rem;
        font-weight: 800;
        letter-spacing: 2px;
    }
    .right {
        width: 200px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        @media (max-width: 1024px) {
            width:180px
        }

        @media (max-width: 768px) {
            width:160px
        }
    }
`;

//since header is 'fixed'
const Spacer = styled.div`
    height: 4rem;
`;

const UserInfo = styled.div`
    font-weight: 800;
`;

const MessegeIcon = styled(FontAwesomeIcon)`
    &:hover {
        transform: translateY(-2px);
    }
`

type HeaderProps = {
    user: User | null;
    onLogout: () => void;
};

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    const { group } = useContext(GroupContext);

    return (
        <>
            <HeaderBlock>
                <Wrapper>
                    <Link to="/" className="logo">
                        ACbit
                    </Link>
                    {user ? (
                        <div className="right">
                            <UserInfo>{user.username}</UserInfo>
                            <Link
                                to={`/${user.username}/${group?.groupID}/chatroom`}
                            >
                                <MessegeIcon icon={faMessage} />
                            </Link>
                            <Button onClick={onLogout}>Logout</Button>
                        </div>
                    ) : (
                        <div className="right">
                            <Button to="/login">Login</Button>
                        </div>
                    )}
                </Wrapper>
            </HeaderBlock>
            <Spacer />
        </>
    );
};

export default Header;
