import React, { useEffect, useState } from 'react';
import GroupList from '../../components/groups/GroupList';
import * as groupAPI from '../../lib/api/groups';
import { AxiosResponse } from 'axios';
import GroupForm from '../../components/groups/GroupForm';

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
    const [error, setError] = useState<boolean>(false);

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
                console.error('Error fetching posts:', error);
                setError(true);
                setLoading(false);
            });
    }, []);

    return (
        <>
            <GroupList
                loading={loading}
                error={error}
                groups={groups}
                deleteGroup={deleteGroup}
            />

            <GroupForm createGroup={createGroup} joinGroup={joinGroup} />
        </>
    );
};

export default GroupListContainer;
