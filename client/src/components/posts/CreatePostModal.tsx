import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { styled } from 'styled-components';
import Button from '../common/Button';
import { PostFormData } from '../../containers/posts/PostListContainer';

const CreatePostBlock = styled(ReactModal)`
    width: 400px;
    height: 400px;
    border: 1px solid black;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
`;

type CreatePostModalProps = {
    isOpen: boolean;
    onRequestClose: React.Dispatch<React.SetStateAction<boolean>>;
    createPost: (formData: PostFormData) => void;
    setError: React.Dispatch<React.SetStateAction<string>>;
};

const CreatePostModal: React.FC<CreatePostModalProps> = ({
    isOpen,
    onRequestClose,
    createPost,
    setError,
}) => {
    const [postForm, setPostForm] = useState<PostFormData>({
        title: '',
        body: '',
        deadline: '',
    });

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(postForm.title === '' || postForm.body === '' || postForm.deadline === '') {
            setError('Missing Field');
            setTimeout(() => {
                setError('');
            }, 3000)
            return;
        }
        createPost(postForm);

            setPostForm({
                title: '',
                body: '',
                deadline: '',
            });
            onRequestClose(false);
    };

    const handleChange = (
        e:
            | React.ChangeEvent<HTMLTextAreaElement>
            | React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value } = e.target;
        setPostForm((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <CreatePostBlock
            ariaHideApp={false}
            isOpen={isOpen}
            onRequestClose={() => onRequestClose(false)}
        >
            <h1>Create a Promise</h1>
            <hr />
            <form onSubmit={handleCreate}>
                <div>
                    <label>Title:</label>
                    <input
                        autoComplete="title"
                        name="title"
                        placeholder="title"
                        onChange={handleChange}
                        value={postForm.title}
                    />
                </div>
                <div>
                    <label>Body:</label>
                    <textarea
                        name="body"
                        placeholder="body"
                        onChange={handleChange}
                        value={postForm.body}
                    />
                </div>
                <div>
                    <label>Deadline:</label>
                    <input
                        autoComplete="deadline"
                        name="deadline"
                        placeholder="deadline"
                        onChange={handleChange}
                        value={postForm.deadline}
                    />
                </div>
                <Button type="submit">Submit</Button>
                <Button type="button" onClick={() => onRequestClose(false)}>
                    Cancel
                </Button>
            </form>
        </CreatePostBlock>
    );
};

export default CreatePostModal;
