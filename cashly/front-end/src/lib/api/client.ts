import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from '@/lib/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://roberto-ingenito.ddns.net:5001';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Handle unauthorized access
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }

                const apiError: ApiError = {
                    message: error.message || 'An error occurred',
                    statusCode: error.response?.status,
                };

                return Promise.reject(apiError);
            }
        );
    }

    get<T>(url: string, params?: any) {
        return this.client.get<T>(url, { params }).then(res => res.data);
    }

    post<T>(url: string, data?: any) {
        return this.client.post<T>(url, data).then(res => res.data);
    }

    put<T>(url: string, data?: any) {
        return this.client.put<T>(url, data).then(res => res.data);
    }

    delete<T>(url: string) {
        return this.client.delete<T>(url).then(res => res.data);
    }
}

export const apiClient = new ApiClient();
