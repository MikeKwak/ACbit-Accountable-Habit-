import { AxiosResponse } from 'axios';
import { Post, PostFormData } from '../../containers/posts/PostListContainer';
import client from './client';

export const create = (
    groupID: string,
    formData: PostFormData,
): Promise<AxiosResponse<Post>> =>
    client.post<PostFormData, AxiosResponse<Post>>(
        `/api/posts/${groupID}`,
        formData,
    );

export const complete = (groupID: string, _id: string): Promise<void> =>
    client.delete<string, void>(`/api/posts/${groupID}/${_id}`);
