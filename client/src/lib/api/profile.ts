import { AxiosResponse } from 'axios';
import { User } from '../../contexts/UserContext';
import client from './client';

export const uploadImage = (imgURL: string): Promise<AxiosResponse<void>> => client.patch('/api/profile/image', { imgURL });

export const getImage = (username: String): Promise<AxiosResponse<string>> => client.get(`/api/profile/image/${username}`);