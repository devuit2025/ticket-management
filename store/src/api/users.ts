// api/users.ts
import client from './client';
// @types/users.ts
export interface User {
  id: number;
  phone: string;
  name: string;
  role: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
}


// Get current logged-in user's profile
export const getProfile = async (): Promise<User> => {
  try {
    const response = await client.get<User>('/profile');
    return response;
  } catch (error: any) {
    console.error('GetProfile error:', error?.response?.error || error.message);
    throw error;
  }
};

// Update profile (name and/or phone)
export const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
  try {
    const response = await client.put<User>('/profile', data);
    return response;
  } catch (error: any) {
    console.error('UpdateProfile error:', error?.response?.error || error.message);
    throw error;
  }
};
