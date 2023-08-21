import styled from 'styled-components';
import HeaderContainer from '../containers/common/HeaderContainer';
import PostListContainer from '../containers/posts/PostListContainer';
import '../styles/main/MainPage.scss';
import MonthlyCalendar from '../components/common/MonthlyCalendar';
import ChatContainer from '../containers/chat/ChatContainer';
import ProfileContainer from '../containers/common/ProfileContainer';
import MainContainer from '../containers/main/MainContainer';

const MainPage = () => {
    return (
        <>
            <HeaderContainer />
            <MainContainer />
        </>
    );
};

export default MainPage;
