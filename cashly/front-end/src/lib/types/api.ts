export interface ApiError {
    message: string;
    statusCode?: number;
    errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
    data?: T;
    error?: ApiError;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface SortParams {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
