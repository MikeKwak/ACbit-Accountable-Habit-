import React, { FormEvent, useState } from 'react';
import { styled } from 'styled-components';
import Button from '../common/Button';
import palette from '../../lib/styles/palette';
import { JoinFormData } from '../../containers/groups/GroupListContainer';

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const StyledInput = styled.input`
    font-size: 1rem;
    border: none;
    border-bottom: 1px solid ${palette.gray[5]};
    padding-bottom: 0.5 rem;
    outline: none;
    width: 80%;
    &:focus {
        color: $oc-teal-7;
        border-bottom: 1px solid ${palette.gray[7]};
    }
    & + & {
        margin-top: 1rem;
    }
`;

const ButtonWithMarginTop = styled(Button)`
    margin-top: 1rem;
`;

type JoinFormProps = {
    joinGroup: (formData: JoinFormData) => void;
};

const JoinForm: React.FC<JoinFormProps> = ({ joinGroup }) => {
    const [formData, setFormData] = useState<JoinFormData>({
        groupID: '',
        password: '',
    });

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(formData)
        joinGroup(formData)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        
    };

    return (
        <StyledForm onSubmit={onSubmit}>
            <StyledInput
                autoComplete="groupID"
                name="groupID"
                placeholder="groupID"
                onChange={handleChange}
                value={formData.groupID}
            />
            <StyledInput
                autoComplete="password"
                name="password"
                placeholder="password"
                onChange={handleChange}
                value={formData.password}
            />
            <ButtonWithMarginTop fullWidth>Join</ButtonWithMarginTop>
        </StyledForm>
    );
};

export default JoinForm;
