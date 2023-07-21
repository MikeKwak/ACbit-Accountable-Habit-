import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeField, initializeForm, register } from '../../modules/auth.js';
import AuthForm from '../../components/auth/AuthForm.js';
import { check } from '../../modules/user';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const [ error, setError ] = useState(null)
    const dispatch = useDispatch();
    const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
        form: auth.register,
        auth: auth.auth,
        authError: auth.authError,
        user: user.user,
    }));

    const onChange = (e) => {
        const { value, name } = e.target;
        dispatch(
            changeField({
                form: 'register',
                key: name,
                value,
            })
        );
    };

    const onSubmit = e => {
        e.preventDefault();
        const { username, password, passwordConfirm } = form;

        if ([username, password, passwordConfirm].includes('')){
            setError('Error: Missing Field');
            return;
        }

        if(password !== passwordConfirm){
            setError('Error: Passwords do not match');
            dispatch(changeField({ form: 'register', key: 'password', value: '' }));
            dispatch(changeField({ form: 'register', key: 'passwordConfirm', value: '' }));
            return;
        }
        dispatch(register({ username, password }))
    }

    // form reset
    useEffect(() => {
        dispatch(initializeForm('register'))
    }, [dispatch])

    // Register success / failure
    useEffect(() => {
        if(authError){
            // Account exists
            if(authError.response.status === 409){
                setError('username already taken')
                return;
            }
            setError('Register Fail')
            return;
        }
        if (auth) {
            console.log("Registered")
            console.log(auth)
            dispatch(check());
        }
    }, [auth, authError, dispatch])

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/')
            try {
                localStorage.setItem('user', JSON.stringify(user));
            } catch (e) {
                console.log('localStorage not working')
            }
        }
    }, [navigate, user])

    return (
        <AuthForm
            type='register'
            form={form}
            onChange={onChange}
            onSubmit={onSubmit}
            error={error}
        />
    )
};

export default RegisterForm;