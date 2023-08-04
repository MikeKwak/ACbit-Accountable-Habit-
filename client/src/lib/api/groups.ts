import client from './client';
import { AxiosResponse } from 'axios';
import { Group } from '../../containers/groups/GroupListContainer';
import { CreateFormData, JoinFormData } from '../../containers/groups/GroupListContainer';

export const list = (): Promise<AxiosResponse<Group[]>> => 
    client.get<void, AxiosResponse<Group[]>>('/api/groups')

export const leave = (id: string): Promise<void> => 
    client.post<string, void>('/api/groups/leave', { groupID: id })

export const create = (formData: CreateFormData): Promise<AxiosResponse<Group>> => 
    client.post<Group>('/api/groups/create', formData)

export const join = (formData: JoinFormData): Promise<AxiosResponse<Group>> => 
client.post<Group>('/api/groups/join', formData)