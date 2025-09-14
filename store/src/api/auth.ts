import client from './client';

import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    PhoneLoginRequest,
    PhoneLoginResponse,
    SocialLoginRequest,
    RequestOtpRequest,
    RequestOtpResponse,
} from '@types/auth';


// --- Verify Register ---
export interface VerifyRegisterRequest {
  phone: string;
  code: string;
}

export interface VerifyRegisterResponse {
  token: string;
  user: {
    id: number;
    phone: string;
    name: string;
    role: string;
    status: string;
  };
}

// --- Email/Password Login ---
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await client.post<LoginResponse>('/auth/login', data);
        return response;
    } catch (error: any) {
        console.error('Login error:', error?.response?.error);
        throw error;
    }
};

export const requestOtp = async (data: RequestOtpRequest): Promise<RequestOtpResponse> => {
    try {
        const response = await client.post<RequestOtpResponse>('/auth/send-otp', data);
        return response.data;
    } catch (error: any) {
        console.error('Request OTP error:', error?.response?.error);
        throw error;
    }
};

// --- Logout ---
export const logout = async (): Promise<void> => {
    try {
        await client.post('/auth/logout');
    } catch (error: any) {
        console.error('Logout error:', error?.response?.error);
        throw error;
    }
};

// --- Register ---
export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
        const response = await client.post<RegisterResponse>('/auth/register', data);
        return response;
    } catch (error: any) {
        console.error('Register error:', error?.response?.error);
        throw error;
    }
};

// --- Verify Register ---
export const verifyRegister = async (
  data: VerifyRegisterRequest
): Promise<VerifyRegisterResponse> => {
  try {
    const response = await client.post<VerifyRegisterResponse>('/auth/verify-otp', data);
    return response.data;
  } catch (error: any) {
    console.error('Verify Register error:', error?.response?.error);
    throw error;
  }
};

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  try {
    const response = await client.post<ChangePasswordResponse>('/auth/change-password', data);
    return response;
  } catch (error: any) {
    console.error('Change password error:', error?.response?.error || error);
    throw error?.response?.data?.error || error;
  }
};