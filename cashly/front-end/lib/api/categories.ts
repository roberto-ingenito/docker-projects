import { apiClient } from './client';
import { CategoryCreateDto, CategoryResponseDto } from '@/lib/types/category';

export const getCategories = async (): Promise<CategoryResponseDto[]> => {
    return apiClient.get<CategoryResponseDto[]>('/Categories');
};

export const createCategory = async (data: CategoryCreateDto): Promise<CategoryResponseDto> => {
    return apiClient.post<CategoryResponseDto>('/Categories', data);
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
    return apiClient.delete(`/Categories/${categoryId}`);
};
