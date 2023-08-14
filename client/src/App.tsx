import { Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GroupListPage from './pages/GroupListPage';

function App() {
    return (
        <>
            <Routes>
                {/* <Route path="/" element={<MainPage />} /> */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path={'/:username/groups'} element={<GroupListPage />} />
                <Route path={'/:username/:groupID'} element={<MainPage />} />
            </Routes>
        </>
    );
}

export default App;
