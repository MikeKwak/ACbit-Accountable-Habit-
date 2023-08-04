import { createContext, useEffect, useState } from 'react';
import { Group } from '../containers/groups/GroupListContainer';


export const GroupContext = createContext<{
    group: Group | null;
    setGroup: (group: Group | null) => void;
}>({
    group: {
        groupID: '',
        name: '',
    },
    setGroup: () => {},
});

interface GroupProviderProps {
    children: React.ReactNode;
}

export const GroupProvider: React.FC<GroupProviderProps> = ({ children }) => {
    const [group, setGroup] = useState<Group | null>(() => {
        const storedGroup = localStorage.getItem('group');
        return storedGroup ? JSON.parse(storedGroup) : null;
    });

    useEffect(() => {
        if (group) {
            localStorage.setItem('group', JSON.stringify(group));
        } else {
            localStorage.removeItem('group');
        }
    }, [group]);

    return (
        <GroupContext.Provider value={{ group, setGroup }}>
            {children}
        </GroupContext.Provider>
    );
};
