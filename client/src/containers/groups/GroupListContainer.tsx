import React, { useEffect, useState } from 'react';
import GroupList from '../../components/groups/GroupList';
import * as groupAPI from '../../lib/api/groups';
import { AxiosResponse } from 'axios';
import GroupForm from '../../components/groups/GroupForm';
import Profile from '../../components/groups/Profile';
import { styled } from 'styled-components';
import '../../styles/GroupPage.scss';

export type Group = {
    groupID: string;
    name: string;
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
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const deleteGroup = (id: string) => {
        //API call
        groupAPI
            .leave(id)
            .then(() =>
                setGroups(
                    groups.filter((group: Group) => group.groupID !== id),
                ),
            )
            .catch((e) => console.log(e));
    };

    const createGroup = (formData: CreateFormData) => {
        setError('');
        if (!formData.name || !formData.password) {
            setError('Missing Field');
            return;
        }

        //API call
        groupAPI
            .create(formData)
            .then((res: AxiosResponse<Group>) => {
                const newGroup: Group = {
                    name: res.data.name,
                    groupID: res.data.groupID,
                };
                setGroups((prevData) => [...prevData, newGroup]);
            })
            .catch((error) => {
                console.error('Error fetching groups:', error);
            });
    };

    const joinGroup = (formData: JoinFormData) => {

        if (!formData.groupID || !formData.password) {
            setError('Missing Field');
            return;
        }

        //API call
        groupAPI
            .join(formData)
            .then((response) => {
                setGroups((prevGroups) => [...prevGroups, response.data]);
            })
            .catch((error) => {
                console.error('Error fetching groups:', error);
            });
    };

    useEffect(() => {
        setLoading(true);
        //API call
        groupAPI
            .list()
            .then((res: AxiosResponse<Group[]>) => {
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
        <div className='grid-container'>
            <div className="column1">
                <Profile />
                <GroupForm
                    createGroup={createGroup}
                    joinGroup={joinGroup}
                    error={error}
                />
            </div>
            <div className="column2">
                <GroupList
                    loading={loading}
                    groups={groups}
                    deleteGroup={deleteGroup}
                />
            </div>
        </div>
    );
};

export default GroupListContainer;
