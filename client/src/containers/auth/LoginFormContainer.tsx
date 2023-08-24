import { useContext, ChangeEvent, FormEvent, useState } from 'react';
import AuthForm from '../../components/auth/AuthForm';
import { useNavigate } from 'react-router-dom';
import { User, UserContext } from '../../contexts/UserContext';
import * as authAPI from '../../lib/api/auth';
import { AxiosResponse } from 'axios';

type LoginForm = {
    username: string;
    password: string;
};

const LoginFormContainer = () => {
    const [form, setForm] = useState<LoginForm>({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const { setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;

        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const { username, password } = form;

        if ([username, password].includes('')) {
            setError('Error: Missing Field');
            return;
        }

        //API call
        authAPI.login({ username, password })
            .then((res: AxiosResponse<User>) => {
                setUser(res.data);
                navigate(`/${username}/groups`);
            })
            .catch((e) => {
                if (e.response.status === 401) {
                    setError('wrong username or password');
                } else if (e.response.status === 500) {
                    setError('Server Error : contact help');
                }
            });
    };
    return (
        <AuthForm
            type="login"
            form={form}
            onChange={onChange}
            onSubmit={onSubmit}
            error={error}
        />
    );
};

export default LoginFormContainer;
