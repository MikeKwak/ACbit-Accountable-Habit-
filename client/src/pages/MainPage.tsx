import styled from 'styled-components';
import Responsive from '../components/common/Responsive';
import HeaderContainer from '../containers/common/HeaderContainer';
import PostListContainer from '../containers/posts/PostListContainer';
import '../styles/main/MainPage.scss';
import Profile from '../components/groups/Profile';
import MonthlyCalendar from '../components/common/MonthlyCalendar';
import ChatContainer from '../containers/chat/ChatContainer';

const MainBlock = styled.div`
    display: flex;
    justify-content: center;
    padding-left: 1rem;
    padding-right: 1rem;
    width: 1300px;
    margin: 0 auto;

    @media (max-width: 1024px) {
        width: 768px;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const MainPage = () => {
    return (
        <>
            <HeaderContainer />
            <MainBlock>
                <div className="main-grid-container">
                    <div className="grid profile-container">
                        <Profile />
                        <MonthlyCalendar />
                    </div>

                    {/* <div className="grid chart-container"></div> */}
                    <div className="grid chat-container">
                        <ChatContainer />
                    </div>
                    <div className="grid posts-container">
                        <PostListContainer />
                    </div>
                </div>
            </MainBlock>
        </>
    );
};

export default MainPage;
