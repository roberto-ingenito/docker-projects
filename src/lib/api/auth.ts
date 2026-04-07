import { UserCreateDto, UserLoginResponseDto, UserLoginDto } from '../types/user';
import { apiClient } from './client';

export const signup = async (userData: UserCreateDto): Promise<UserLoginResponseDto> => {
  return apiClient.post<UserLoginResponseDto>('/Users/signup', userData);
};

export const login = async (credentials: UserLoginDto): Promise<UserLoginResponseDto> => {
  return apiClient.post<UserLoginResponseDto>('/Users/signin', credentials);
};

export const refreshToken = async (refreshTokenValue: string): Promise<UserLoginResponseDto> => {
  return apiClient.post<UserLoginResponseDto>('/Users/refresh', {
    refreshToken: refreshTokenValue,
  });
};
