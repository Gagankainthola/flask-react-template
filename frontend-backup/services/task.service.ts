import APIService from 'frontend/services/api.service';
import { ApiResponse } from 'frontend/types';
import { getAccessTokenFromStorage } from 'frontend/utils/storage-util';

export interface Task {
    _id: string;
    account_id: string;
    title: string;
    description: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export default class TaskService extends APIService {
    // yaha se token fetch hoga
    private getAuthHeaders() {
        const token = getAccessTokenFromStorage();
        return token ? { Authorization: `Bearer ${token.token}` } : {};
    }

    private getAccountId() {
        const token = getAccessTokenFromStorage();
        return token?.accountId;
    }

    getTasks = async (): Promise<ApiResponse<Task[]>> =>
        this.apiClient.get(`/accounts/${this.getAccountId()}/tasks`, {
            headers: this.getAuthHeaders(),
        });

    createTask = async (
        task: Omit<Task, '_id' | 'created_at' | 'updated_at'>
    ): Promise<ApiResponse<Task>> =>
        this.apiClient.post(`/accounts/${this.getAccountId()}/tasks`, task, {
            headers: this.getAuthHeaders(),
        });

    updateTask = async (
        id: string,
        task: Partial<Task>
    ): Promise<ApiResponse<Task>> =>
        this.apiClient.patch(`/accounts/${this.getAccountId()}/tasks/${id}`, task, {
            headers: this.getAuthHeaders(),
        });

    deleteTask = async (id: string): Promise<ApiResponse<void>> =>
        this.apiClient.delete(`/accounts/${this.getAccountId()}/tasks/${id}`, {
            headers: this.getAuthHeaders(),
        });
}
