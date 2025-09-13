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

// --- Phone Login ---
export const phoneLogin = async (data: PhoneLoginRequest): Promise<PhoneLoginResponse> => {
    try {
        const response = await client.post<PhoneLoginResponse>('/auth/phone-login', data);
        return response.data;
    } catch (error: any) {
        console.error('Phone Login error:', error?.response?.error);
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

// --- Facebook Login ---
export const facebookLogin = async (data: SocialLoginRequest): Promise<LoginResponse> => {
    try {
        const response = await client.post<LoginResponse>('/auth/facebook-login', data);
        return response.data;
    } catch (error: any) {
        console.error('Facebook Login error:', error?.response?.error);
        throw error;
    }
};

// --- Google Login ---
export const googleLogin = async (data: SocialLoginRequest): Promise<LoginResponse> => {
    try {
        const response = await client.post<LoginResponse>('/auth/google-login', data);
        return response.data;
    } catch (error: any) {
        console.error('Google Login error:', error?.response?.error);
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

// --- Forgot Password ---
export const forgotPassword = async (email: string): Promise<void> => {
    try {
        await client.post('/auth/forgot-password', { email });
    } catch (error: any) {
        console.error('Forgot Password error:', error?.response?.error);
        throw error;
    }
};

// --- Reset Password ---
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
        await client.post('/auth/reset-password', { token, newPassword });
    } catch (error: any) {
        console.error('Reset Password error:', error?.response?.error);
        throw error;
    }
};
