import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Group } from '../../containers/groups/GroupListContainer';
import { UserContext } from '../../contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const GroupListBlock = styled.div`
    margin-top: 2rem;
    display: flex;
`;

const GroupItemBlock = styled.div`
    position: relative;
    margin-left: 20px;
    &:first-child {
        margin-left: 0%;
    }
`;

const GroupLink = styled(Link)`
    border: 1px solid black;
    border-radius: 4px;
    padding: 13px;
    padding-top: 25px;

    text-decoration: none;
    color: #333;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: #f5f5f5;
    }
`;

const DeleteButton = styled.button`
    position: absolute;
    top: -17px;
    right: 5px;
    background: transparent;
    border: none;
    color: red;
    cursor: pointer;

    &:hover {
        color: darkred;
    }
`;

type GroupItemProps = {
    group: Group;
    deleteGroup: (id: string) => void;
};

const GroupItem: React.FC<GroupItemProps> = ({ group, deleteGroup }) => {
    const { user } = useContext(UserContext);
    const { name, groupID } = group;

    console.log(user)
    const username = user?.username || 'guest';
    return (
        <GroupItemBlock>
            <GroupLink
                to={`/${username}/${groupID}`}
            >
                {name}
            </GroupLink>
            <DeleteButton onClick={() => {deleteGroup(groupID)}}>
                <FontAwesomeIcon icon={faTrashAlt} />
            </DeleteButton>
        </GroupItemBlock>
    );
};

type GroupListProps = {
    groups: Group[];
    loading: boolean;
    error: boolean;
    deleteGroup: (id: string) => void;
};

const GroupList: React.FC<GroupListProps> = ({
    groups,
    loading,
    error,
    deleteGroup,
}) => {
    if (error) {
    }

    return (
        <>
            {!loading && groups && (
                <GroupListBlock>
                    {groups.map((group) => (
                        <GroupItem
                            group={group}
                            deleteGroup={deleteGroup}
                            key={group.groupID}
                        />
                    ))}
                </GroupListBlock>
            )}
        </>
    );
};

export default GroupList;
