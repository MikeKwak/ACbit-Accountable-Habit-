import React, { useEffect, useState } from 'react';
import GroupList from '../../components/groups/GroupList';
import * as groupAPI from '../../lib/api/groups';
import { AxiosResponse } from 'axios';
import GroupForm from '../../components/groups/GroupForm';
import '../../styles/groups/GroupPage.scss';
import ProfileContainer from '../common/ProfileContainer';

export type GroupInfo = {
    groupID: string;
    name: string;
    users: {
        username: string;
        imgURL: string;
        _id: string;
    }[];
};

export type CreateFormData = {
    name: string;
    password: string;
};

export type JoinFormData = {
    groupID: string;
    password: string;
};

const GroupListContainer: React.FC = () => {
    const [groups, setGroups] = useState<GroupInfo[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const deleteGroup = (id: string) => {
        //API call
        groupAPI
            .leave(id)
            .then(() =>
                setGroups(
                    groups!.filter((group: GroupInfo) => group.groupID !== id),
                ),
            )
            .catch((e) => console.log(e));
    };

    const createGroup = (formData: CreateFormData) => {
        setError('');
        if (!formData.name || !formData.password) {
            setError('Missing Field'); //bad request
            return;
        }
        //API call
        groupAPI
            .create(formData)
            .then((res: AxiosResponse<GroupInfo>) => {
                setGroups((prevData) => [...prevData!, res.data]);
            })
            .catch((e) => {
                if (e.response.status === 400) {
                    if (e.response.data === '"name" length must be less than or equal to 20 characters long') {
                        setError('name too long');
                    } else if (e.response.data === '"password" length must be at least 8 characters long') {
                        setError('password too short');
                    }
                }
            });
    };

    const joinGroup = (formData: JoinFormData) => {
        if (!formData.groupID || !formData.password) {
            setError('Missing Field'); //bad request
            return;
        }
        //API call
        groupAPI
            .join(formData)
            .then((res: AxiosResponse<GroupInfo>) => {
                setGroups((prevGroups) => [...prevGroups!, res.data]);
            })
            .catch((e) => {
                if (e.response.status === 401) {
                    setError('wrong groupID or password');
                } else if (e.response.status === 404) {
                    setError('No group with that id');
                } else if (e.response.status === 409) {
                    setError('already joined');
                }
            });
    };

    useEffect(() => {
        setLoading(true);
        //API call
        groupAPI
            .list()
            .then((res: AxiosResponse<GroupInfo[]>) => {
                console.log(res.data, "1")
                setGroups(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching groups:', error);
                setError('Server Error');
                setLoading(false);
            });
    }, []);

    return (
        <div className="grid-container">
            <div className="column1">
                <ProfileContainer />
                <GroupForm
                    createGroup={createGroup}
                    joinGroup={joinGroup}
                    error={error}
                />
            </div>
            <div className="column2">
                {!loading && groups && (
                    <GroupList
                        loading={loading}
                        groups={groups!}
                        deleteGroup={deleteGroup}
                    />
                )}
            </div>
        </div>
    );
};

export default GroupListContainer;
