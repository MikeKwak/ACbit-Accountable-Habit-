import styled from 'styled-components';
import Button from '../common/Button';
import CreateForm from './CreateForm';
import JoinForm from './JoinForm';
import { useState } from 'react';
import {
    CreateFormData,
    JoinFormData,
} from '../../containers/groups/GroupListContainer';

const CreateJoinButtonsWrapper = styled.div`
    margin-top: 2rem;
    width: 100%;
    display: flex;
    justify-content: flex-end;
`;

type GroupFormProps = {
    createGroup: (formData: CreateFormData) => void;
    joinGroup: (formData: JoinFormData) => void;
};

const GroupForm: React.FC<GroupFormProps> = ({ createGroup, joinGroup }) => {
    const [formType, setFormType] = useState<string>('join');

    return (
        <>
            <CreateJoinButtonsWrapper>
                <Button cyan onClick={() => setFormType('create')}>
                    Create A Group
                </Button>
                <Button cyan onClick={() => setFormType('join')}>
                    Join A Group
                </Button>
            </CreateJoinButtonsWrapper>

            {formType === 'create' ? (
                <CreateForm createGroup={createGroup} />
            ) : (
                <JoinForm joinGroup={joinGroup} />
            )}
        </>
    );
};

export default GroupForm;
