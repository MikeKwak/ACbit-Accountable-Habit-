import client from './client';
import { AxiosResponse } from 'axios';
import { GroupInfo } from '../../containers/groups/GroupListContainer';
import { CreateFormData, JoinFormData } from '../../containers/groups/GroupListContainer';
import { Group } from '../../containers/main/MainContainer';

export const list = (): Promise<AxiosResponse<GroupInfo[]>> => 
    client.get<void, AxiosResponse<GroupInfo[]>>('/api/groups')

export const leave = (id: string): Promise<void> => 
    client.post<string, void>('/api/groups/leave', { groupID: id })

export const create = (formData: CreateFormData): Promise<AxiosResponse<GroupInfo>> => 
    client.post<GroupInfo>('/api/groups/create', formData)

export const join = (formData: JoinFormData): Promise<AxiosResponse<GroupInfo>> => 
client.post<GroupInfo>('/api/groups/join', formData)

export const get = (id: string): Promise<AxiosResponse<Group>> => 
    client.get<string, AxiosResponse<Group>>(`/api/groups/${id}`)