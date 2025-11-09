export interface Category {
    categoryId: number;
    categoryName: string;
    iconName?: string;
    colorHex?: string;
    userId: number;
}

export interface CategoryCreateDto {
    categoryName: string;
    iconName?: string;
    colorHex?: string;
}

export interface CategoryResponseDto {
    categoryId: number;
    categoryName: string;
    iconName?: string;
    colorHex?: string;
}

export interface CategoriesState {
    categories: CategoryResponseDto[];
    isLoading: boolean;
    firstLoadDone: boolean;
    error: string | null;
}
