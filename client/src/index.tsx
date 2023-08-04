import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { GroupProvider } from './contexts/GroupContext';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);
root.render(
    // <React.StrictMode>
        <UserProvider>
            <GroupProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </GroupProvider>
        </UserProvider>
    // </React.StrictMode>,
);
