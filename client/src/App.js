import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GroupListPage from './pages/GroupListPage';
import WritePage from './pages/WritePage';
import PostPage from './pages/PostPage';


function App() {
  return (
    <Routes>
      <Route path={'/'} element={<GroupListPage/>} />
      <Route path={'/@:username'} element={<GroupListPage/>} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />  
      <Route path="/write" element={<WritePage />} />    
      <Route path="/@:username/:postId" element={<PostPage/>}/>
    </Routes>
  );
}

export default App;
