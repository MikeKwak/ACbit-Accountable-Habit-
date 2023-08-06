import GroupTemplate from '../components/groups/GroupTemplate';
import GroupListContainer from '../containers/groups/GroupListContainer';
import Profile from '../components/groups/Profile';

const GroupListPage = () => {
    return (
        <>

            <GroupTemplate>
                <Profile />
                <GroupListContainer />
            </GroupTemplate>
        </>
    );
};
export default GroupListPage;
