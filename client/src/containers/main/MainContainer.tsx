import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ProfileContainer from '../common/ProfileContainer';
import MonthlyCalendar from '../../components/common/MonthlyCalendar';
import ChatContainer from '../chat/ChatContainer';
import PostListContainer from '../posts/PostListContainer';
import { useParams } from 'react-router-dom';
import * as groupAPI from '../../lib/api/groups';
import { AxiosResponse } from 'axios';

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

export type Group = {
    groupID: string;
    name: string;
    posts: {
        status: string;
        title: string;
        body: string;
        tags: string[];
        publishedDate: Date;
        deadlineDate: Date;
        user: {
            username: string;
        };
    };
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

    useEffect(() => {
        groupAPI
            .get(groupID!)
            .then((res: AxiosResponse<Group>) => {
                setGroup(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching group:', error);
            });
    }, [group]);

    return (
        <MainBlock>
            {!loading && (
                <div className="main-grid-container">
                    <div className="grid profile-container">
                        <ProfileContainer />
                        <MonthlyCalendar />
                    </div>

                    <div className="grid chat-container">
                        <ChatContainer users={group!.users} />
                    </div>

                    <div className="grid posts-container">
                        <PostListContainer />
                    </div>
                </div>
            )}
        </MainBlock>
    );
};

export default MainContainer;
