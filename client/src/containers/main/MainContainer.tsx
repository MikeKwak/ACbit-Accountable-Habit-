import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ProfileContainer from '../common/ProfileContainer';
import MonthlyCalendar from '../../components/common/MonthlyCalendar';
import ChatContainer from '../chat/ChatContainer';
import PostListContainer from '../posts/PostListContainer';
import { useParams } from 'react-router-dom';
import * as groupAPI from '../../lib/api/groups';
import { AxiosResponse } from 'axios';
import { Post } from '../posts/PostListContainer'

const MainBlock = styled.div`
    display: flex;
    justify-content: center;
    /* padding-left: 1rem;
    padding-right: 1rem; */
    width: 1200px;
    margin: 0 auto;

    @media (max-width: 1250px) {
        width: 768px;
    }

    /* @media (max-width: 1024px) {
        width: 768px;
    } */

    @media (max-width: 768px) {
        width: 100%;
    }
`;

export type Group = {
    groupID: string;
    name: string;
    posts: Post[];
    users: {
        username: string;
        imgURL: string;
    }[];
    createdDate: Date;
};

const MainContainer = () => {
    const { groupID } = useParams();
    const [group, setGroup] = useState<Group | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        groupAPI
            .get(groupID!)
            .then((res: AxiosResponse<Group>) => {
                setGroup(res.data);
                setLoading(false);
            })
            .catch((e) => {
                setError('Failed to get group data from the server')
            });
    }, [groupID]);

    return (
        <MainBlock>
            {(group && !loading) && (
                <div className="main-grid-container">
                    <div className="grid profile-container">
                        <ProfileContainer />
                        <MonthlyCalendar />
                    </div>

                    <div className="grid chat-container">
                        <ChatContainer group={group!} setGroup={setGroup} />
                    </div>

                    <div className="grid posts-container">
                        <PostListContainer users={group.users} posts={group.posts} setGroup={setGroup} error={error} setError={setError} />
                    </div>
                </div>
            )}
            
        </MainBlock>
    );
};

export default MainContainer;
