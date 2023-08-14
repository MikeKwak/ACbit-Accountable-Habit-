import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Group } from '../../containers/groups/GroupListContainer';
import { UserContext } from '../../contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import '../../styles/GroupPage.scss';


type GroupItemProps = {
    group: Group;
    deleteGroup: (id: string) => void;
};

const GroupItem: React.FC<GroupItemProps> = ({ group, deleteGroup }) => {
    const { user } = useContext(UserContext);
    const { name, groupID } = group;
    const [init, setInit] = useState(false);

    console.log(user);
    const username = user?.username;

    useEffect(() => {
        setTimeout(() => {
            setInit(true);
        }, 250);
    }, []);

    return (
        <div className="card">
            <Link to={`/${username}/${groupID}`}>
                <div className="card-content">
                    <div className={`liner ${init ? 'init' : ''}`}></div>
                    <span className="name">{name}</span>
                    <div className="dropdown">
                        <FontAwesomeIcon className="icon" icon={faCaretDown} />
                        <button
                            className="delete-button"
                            onClick={() => {
                                deleteGroup(groupID);
                            }}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </div>
                </div>
            </Link>
            <div className="controller">Controller</div>
        </div>

        // <GroupItemBlock>
        //     <GroupLink
        //         to={`/${username}/${groupID}`}
        //     >
        //         {name}
        //     </GroupLink>
        //     <DeleteButton onClick={() => {deleteGroup(groupID)}}>
        //         <FontAwesomeIcon icon={faTrashAlt} />
        //     </DeleteButton>
        // </GroupItemBlock>
    );
};

type GroupListProps = {
    groups: Group[];
    loading: boolean;
    deleteGroup: (id: string) => void;
};

const GroupList: React.FC<GroupListProps> = ({
    groups,
    loading,
    deleteGroup,
}) => {
    return (
        <>
            {!loading && groups && (
                <div className="groupList-block">
                    {groups.map((group) => (
                        <GroupItem
                            group={group}
                            deleteGroup={deleteGroup}
                            key={group.groupID}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default GroupList;
