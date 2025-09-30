import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CategoriesState, Category, CategoryCreateDto } from '@/lib/types/category';
import * as categoriesApi from '@/lib/api/categories';

const initialState: CategoriesState = {
    categories: [],
    isLoading: false,
    error: null,
};

export const fetchCategories = createAsyncThunk(
    'categories/fetchAll',
    async () => {
        const response = await categoriesApi.getCategories();
        return response;
    }
);

export const createCategory = createAsyncThunk(
    'categories/create',
    async (data: CategoryCreateDto) => {
        const response = await categoriesApi.createCategory(data);
        return response;
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/delete',
    async (categoryId: number) => {
        await categoriesApi.deleteCategory(categoryId);
        return categoryId;
    }
);

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch categories
            .addCase(fetchCategories.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch categories';
            })
            // Create category
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })
            // Delete category
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(c => c.categoryId !== action.payload);
            });
    },
});

export default categoriesSlice.reducer;
