import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { PostsProvider } from './contexts/PostsContext';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);
root.render(
    // <React.StrictMode>
        <UserProvider>
            <PostsProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </PostsProvider>
        </UserProvider>
    // </React.StrictMode>,
);
