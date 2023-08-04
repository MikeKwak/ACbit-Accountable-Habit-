import AuthTemplate from '../components/auth/AuthTemplate';
import LoginForm from '../containers/auth/LoginFormContainer';

function LoginPage() {
    return (
        <AuthTemplate>
            <LoginForm />
        </AuthTemplate>
    );
}

export default LoginPage;
