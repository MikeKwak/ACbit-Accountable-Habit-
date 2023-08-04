import React, { useState } from 'react';
import Button from '../common/Button';
import { CreateFormData } from '../../containers/groups/GroupListContainer';

type CreateFormProps = {
    createGroup: (formData: CreateFormData) => void
};

const CreateForm: React.FC<CreateFormProps> = ({ createGroup }: CreateFormProps) => {
    const [formData, setFormData] = useState<CreateFormData>({
        name: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <form onSubmit={() => createGroup(formData)}>
            <input
                autoComplete="name"
                name="name"
                placeholder="name"
                onChange={handleChange}
                value={formData.name}
            />
            <input
                autoComplete="password"
                name="password"
                placeholder="password"
                onChange={handleChange}
                value={formData.password}
            />
            <Button>Create</Button>
        </form>
    );
};

export default CreateForm;
