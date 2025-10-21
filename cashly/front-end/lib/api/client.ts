import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from '@/lib/types/api';
import { getJwtToken } from '@/app/actions';

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
            async (config) => {
                const token = await getJwtToken();

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
            (error: AxiosError<{ message: string }>) => {
                console.log(error);

                const apiError: ApiError = {
                    message: error.response?.data.message || 'An error occurred',
                    statusCode: error.response?.status,
                };

                return Promise.reject(apiError);
            }
        );
    }

    async get<T>(url: string, params?: unknown) {
        const res = await this.client.get<T>(url, { params });
        return res.data;
    }

    async post<T>(url: string, data?: unknown) {
        const res = await this.client.post<T>(url, data);
        return res.data;
    }

    async put<T>(url: string, data?: unknown) {
        const res = await this.client.put<T>(url, data);
        return res.data;
    }

    async delete<T>(url: string) {
        const res = await this.client.delete<T>(url);
        return res.data;
    }
}

export const apiClient = new ApiClient();
