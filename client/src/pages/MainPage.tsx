import styled from 'styled-components';
import HeaderContainer from '../containers/common/HeaderContainer';
import PostListContainer from '../containers/posts/PostListContainer';
import '../styles/main/MainPage.scss';
import MonthlyCalendar from '../components/common/MonthlyCalendar';
import ChatContainer from '../containers/chat/ChatContainer';
import ProfileContainer from '../containers/common/ProfileContainer';
import MainContainer from '../containers/main/MainContainer';
import palette from '../lib/styles/palette';

const MainPage = () => {
    return (
        <>
            <HeaderContainer />
            <div style={{backgroundColor: palette.gray['1']}}><MainContainer /></div>
            
        </>
    );
};

export default MainPage;
