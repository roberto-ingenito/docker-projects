import { apiClient } from './client';
import { Category, CategoryCreateDto } from '@/lib/types/category';

export const getCategories = async (): Promise<Category[]> => {
    return apiClient.get<Category[]>('/api/Categories');
};

export const createCategory = async (data: CategoryCreateDto): Promise<Category> => {
    return apiClient.post<Category>('/api/Categories', data);
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
    return apiClient.delete(`/api/Categories/${categoryId}`);
};
