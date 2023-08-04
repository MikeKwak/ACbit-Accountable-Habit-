import React, { useState } from 'react';
import Button from '../common/Button';
import { JoinFormData } from '../../containers/groups/GroupListContainer';

type JoinFormProps = {
    joinGroup: (formData: JoinFormData) => void;
};

const JoinForm: React.FC<JoinFormProps> = ({ joinGroup }) => {
    const [formData, setFormData] = useState<JoinFormData>({
        groupID: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <form onSubmit={() => joinGroup(formData)}>
            <input
                autoComplete="groupID"
                name="groupID"
                placeholder="groupID"
                onChange={handleChange}
                value={formData.groupID}
            />
            <input
                autoComplete="password"
                name="password"
                placeholder="password"
                onChange={handleChange}
                value={formData.password}
            />
            <Button>Join</Button>
        </form>
    );
};

export default JoinForm;
