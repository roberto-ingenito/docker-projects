import { apiClient } from './client';
import { CategoryCreateDto, CategoryResponseDto, CategoryUpdateDto } from '@/lib/types/category';

export const getCategories = async (): Promise<CategoryResponseDto[]> => {
    return apiClient.get<CategoryResponseDto[]>('/Categories');
};

export const createCategory = async (data: CategoryCreateDto): Promise<CategoryResponseDto> => {
    return apiClient.post<CategoryResponseDto>('/Categories', data);
};

export const updateCategory = async ({ categoryId, data }: { categoryId: number, data: CategoryUpdateDto }): Promise<CategoryResponseDto> => {
    return apiClient.put<CategoryResponseDto>(`/Categories/${categoryId}`, data);
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
    return apiClient.delete(`/Categories/${categoryId}`);
};
