import { ChangeEvent, FormEvent, useState, useContext } from 'react';
import AuthForm from '../../components/auth/AuthForm';
import { useNavigate } from 'react-router-dom';
import { User, UserContext } from '../../contexts/UserContext';
import * as authAPI from '../../lib/api/auth';
import { AxiosResponse } from 'axios';

type RegisterForm = {
    username: string;
    password: string;
    passwordConfirm: string;
};

const RegisterFormContainer = () => {
    const [form, setForm] = useState<RegisterForm>({
        username: '',
        password: '',
        passwordConfirm: '',
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

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { username, password, passwordConfirm } = form;

        if ([username, password, passwordConfirm].includes('')) {
            setError('missing field');
            return;
        }

        if (password !== passwordConfirm) {
            setError('passwords do not match');
            setForm((prevForm) => ({
                ...prevForm,
                [password]: '',
                [passwordConfirm]: '',
            }));
            return;
        }

        //API call
        authAPI.register({ username, password })
            .then((res: AxiosResponse<User>) => {
                //set UserContext
                console.log(res)
                setUser(res.data);
                navigate(`/${username}/groups`);
            })
            .catch((e) => {
                if (e.response.status === 400) {
                    console.log(e.response.data)
                    if (e.response.data === '"username" length must be at least 3 characters long') {
                        setError('username too short');
                    } else if (e.response.data === '"username" length must be less than or equal to 20 characters long') {
                        setError('username too long');
                    } else if (e.response.data === '"password" length must be at least 8 characters long') {
                        setError('password too short');
                    } else {
                        setError('password must include at least one character');
                    }
                } else if (e.response.status === 409) {
                    setError('username Taken');
                } else if (e.response.status === 500) {
                    setError('Server Error : contact help');
                }
            });
    };

    return (
        <AuthForm
            type="register"
            form={form}
            onChange={onChange}
            onSubmit={onSubmit}
            error={error}
        />
    );
};

export default RegisterFormContainer;
