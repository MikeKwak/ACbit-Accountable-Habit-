import { useContext } from 'react';
import Header from '../../components/common/Header';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext';
import { logout } from '../../lib/api/auth';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = () => {
    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const onLogout = () => {
        logout().then(() => {
            setUser(null);
            navigate('/login');
        }).catch((e: { response: { status: number } }) => {
            console.log(e)
        });
    };

    return <Header user={user} onLogout={onLogout} />;
};

export default HeaderContainer;
