import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GroupInfo } from '../../containers/groups/GroupListContainer';
import { UserContext } from '../../contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import defaultPicture from '../../img/default.png';

import '../../styles/groups/GroupPage.scss';

type GroupItemProps = {
    group: GroupInfo;
    deleteGroup: (id: string) => void;
};

const GroupItem: React.FC<GroupItemProps> = ({ group, deleteGroup }) => {
    const { user } = useContext(UserContext);
    const { name, groupID, users } = group;
    const [init, setInit] = useState(false);
    console.log(group);
    console.log(users);
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
            <div className="controller">
                {users.map((user) => (
                    <img
                        src={user.imgURL ? user.imgURL : defaultPicture}
                        alt="profile"
                    />
                ))}
            </div>
        </div>
    );
};

type GroupListProps = {
    groups: GroupInfo[];
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
