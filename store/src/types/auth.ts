// src/types/auth.ts

// --- Request payloads ---
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    phone: string;
    password: string;
    role: string;
}

// --- Response payloads ---
export type UserRole = 'user' | 'admin' | 'super_admin';

export interface User {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    role?: UserRole;
    // add more fields as returned by your API
}

export interface LoginResponse {
    token: string; // JWT or auth token
    user: User;
}

export interface RegisterResponse {
    user: User;
    token: string;
}

// --- Password reset / forgot password payloads ---
export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface PhoneLoginRequest {
    phone: string;
    otp: string;
}

export interface PhoneLoginResponse {
    token: string;
    user: User;
}

export interface SocialLoginRequest {
    accessToken: string;
}

export interface RequestOtpRequest {
    phone: string;
}

export interface RequestOtpResponse {
    success: boolean;
    message?: string;
}
