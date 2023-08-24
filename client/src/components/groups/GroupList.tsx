import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GroupInfo } from '../../containers/groups/GroupListContainer';
import { UserContext } from '../../contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import defaultPicture from '../../img/default.png';
import deletedPicture from '../../img/default.png'

import '../../styles/groups/GroupPage.scss';

type GroupItemProps = {
    group: GroupInfo;
    deleteGroup: (id: string) => void;
};

const GroupItem: React.FC<GroupItemProps> = ({ group, deleteGroup }) => {
    const { user } = useContext(UserContext);
    const username = user?.username;
    const { name, groupID, users } = group;

    const [init, setInit] = useState(false);

    useEffect(() => {
        console.log(users)
        setTimeout(() => {
            setInit(true);
        }, 250);
    }, []);

    const getUserImgURL = (username: string) => {
        if (username === user!.username && user!.imgURL) {
            return user!.imgURL;            
        }

        const groupUser = users.find((user) => user.username === username);
        if (!groupUser){
            return deletedPicture;
        } else {
            if (groupUser.imgURL) {
                return groupUser.imgURL;
            } 
        }
        return defaultPicture;
    };

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
                {users.map((u) => (
                    <img
                        src={
                            u.username = user!.username
                                ? (user!.imgURL
                                    ? user!.imgURL
                                    : defaultPicture)
                                : getUserImgURL(u.username)
                        }
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
