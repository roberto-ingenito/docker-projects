import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CategoriesState, CategoryCreateDto } from '@/lib/types/category';
import * as categoriesApi from '@/lib/api/categories';

const initialState: CategoriesState = {
    categories: [],
    isLoading: false,
    error: null,
    firstLoadDone: false,
};

export const getCategories = createAsyncThunk(
    'categories/getCategories',
    async () => {
        const response = await categoriesApi.getCategories();
        return response;
    }
);

export const createCategory = createAsyncThunk(
    'categories/createCategory',
    async (data: CategoryCreateDto) => {
        const response = await categoriesApi.createCategory(data);
        return response;
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (categoryId: number) => {
        await categoriesApi.deleteCategory(categoryId);
        return categoryId;
    }
);

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clear: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Get Categories
            .addCase(getCategories.pending, (state) => {
                state.isLoading = true;
                state.firstLoadDone = false;
                state.error = null;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.firstLoadDone = true;
                state.categories = action.payload;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch categories';
            })
            // Create Category
            .addCase(createCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories.push(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to create category';
            })
            // Delete Category
            .addCase(deleteCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = state.categories.filter((category) => category.categoryId !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to delete category';
            });
    },
});

export const { clear } = categoriesSlice.actions
export default categoriesSlice.reducer;