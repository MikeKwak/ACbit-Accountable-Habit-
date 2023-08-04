import { Route, Routes } from 'react-router-dom';
import PostListPage from './pages/PostListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WritePage from './pages/WritePage';
import PostPage from './pages/PostPage';
import GroupListPage from './pages/GroupListPage';
import ChatPage from './pages/ChatPage';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<PostListPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path={'/:username/groups'} element={<GroupListPage />} />
                <Route path={'/:username/:groupID'} element={<PostListPage />} />
                <Route path={`/:username/:groupID/chatroom`} element={<ChatPage />} />
            </Routes>
        </>
    );
}

export default App;
