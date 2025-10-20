import { apiClient } from './client';
import { UserCreateDto, UserLoginDto, UserLoginResponseDto } from '@/lib/types/auth';

export const signup = async (userData: UserCreateDto): Promise<UserLoginResponseDto> => {
    return apiClient.post<UserLoginResponseDto>('/api/Users/signup', userData);
};

export const login = async (credentials: UserLoginDto): Promise<UserLoginResponseDto> => {
    return apiClient.post<UserLoginResponseDto>('/api/Users/signin', credentials);
};
