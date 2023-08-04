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
            setError('Error: Missing Field');
            return;
        }

        if (password !== passwordConfirm) {
            setError('Error: Passwords do not match');
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
                    setError('Username too long or short');
                } else if (e.response.status === 409) {
                    setError('Username Taken');
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
