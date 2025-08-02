import api from './axios';

// Define response and request types
export interface User {
    id: number;
    name: string;
    email: string;
}

export interface CreateUserDTO {
    name: string;
    email: string;
}

// Get all users
export const getUsers = async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
};

// Create a new user
export const createUser = async (userData: CreateUserDTO): Promise<User> => {
    const response = await api.post<User>('/users', userData);
    return response.data;
};
