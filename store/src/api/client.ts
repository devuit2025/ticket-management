import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@config/env';
import React from 'react';

let apiHandlerRef: React.RefObject<any> = React.createRef();

export const setApiHandlerRef = (ref: React.RefObject<any>) => {
    apiHandlerRef = ref;
};

const client: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
client.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
        apiHandlerRef.current?.startLoading?.();

        const token = await AsyncStorage.getItem('AUTH_TOKEN');
        if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
        }

        return config;
    },
    (error: AxiosError) => {
        apiHandlerRef.current?.stopLoading?.();
        return Promise.reject(error);
    }

);

// Response interceptor
client.interceptors.response.use(
    (response: any) => {
        apiHandlerRef.current?.stopLoading?.();
        return response.data;
    },
    (error: AxiosError) => {
        apiHandlerRef.current?.stopLoading?.();
        apiHandlerRef.current?.showError?.(error.response?.data?.error);
        return Promise.reject(error);
    }
);

export default client;
