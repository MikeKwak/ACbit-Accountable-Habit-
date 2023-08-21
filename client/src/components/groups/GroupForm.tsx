import styled from 'styled-components';
import CreateForm from './CreateForm';
import palette from '../../lib/styles/palette';
import JoinForm from './JoinForm';
import { useState } from 'react';
import {
    CreateFormData,
    JoinFormData,
} from '../../containers/groups/GroupListContainer';

const GroupFormBlock = styled.div`
    grid-column: 1;
`

const Footer = styled.div`
    width: 100%;
    padding: 0 10px;
    margin-top: 1rem;
    text-align: right;
    display: flex;
    justify-content: space-between;
    a {
        font-size: small;
        color: ${palette.gray[6]};
        text-decoration: underline;
        cursor: pointer;
        &:hover {
            color: ${palette.gray[9]};
        }
    }
`;

const ErrorMessage = styled.div`
    color: red;
    text-align: center;
    font-size: 0.875rem;
    margin-top: -0.75rem;
    margin-bottom: 1rem;
`;

type GroupFormProps = {
    createGroup: (formData: CreateFormData) => void;
    joinGroup: (formData: JoinFormData) => void;
    error: string;
};

const GroupForm: React.FC<GroupFormProps> = ({ createGroup, joinGroup, error }) => {
    const [formType, setFormType] = useState<string>('create');

    return (
        <GroupFormBlock>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            {formType === 'create' ? (
                <CreateForm createGroup={createGroup}/>
            ) : (
                <JoinForm joinGroup={joinGroup} />
            )}



            <Footer>
                <a style={{ color: formType === 'create' ? 'black' : palette.gray[6]}} onClick={() => setFormType('create')}>
                    Create A Group
                </a>
                <a style={{ color: formType === 'join' ? 'black' : palette.gray[6]}} onClick={() => setFormType('join')}>
                    Join A Group
                </a>
            </Footer>
        </GroupFormBlock>
    );
};

export default GroupForm;
