import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CategoryCreateDto, CategoryResponseDto, CategoryUpdateDto } from '@/lib/types/category';
import * as categoriesApi from '@/lib/api/categories';


interface CategoriesState {
    categories: CategoryResponseDto[];
    isLoading: boolean;
    isPerformingAction: boolean;
    firstLoadDone: boolean;
    error: string | null;
}

const initialState: CategoriesState = {
    categories: [],
    isLoading: false,
    isPerformingAction: false,
    error: null,
    firstLoadDone: false,
};

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
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

export const updateCategory = createAsyncThunk(
    'categories/updateCategory',
    async ({ categoryId, data }: { categoryId: number, data: CategoryUpdateDto }) => {
        const response = await categoriesApi.updateCategory({ categoryId, data });
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
            .addCase(fetchCategories.pending, (state) => {
                state.isLoading = true;
                state.firstLoadDone = false;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.firstLoadDone = true;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch categories';
            });

        // Create Category
        builder
            .addCase(createCategory.pending, (state) => {
                state.isPerformingAction = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
                state.isPerformingAction = false;
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.isPerformingAction = false;
                state.error = action.error.message || 'Failed to create category';
            });

        // Update Category
        builder
            .addCase(updateCategory.pending, (state) => {
                state.isPerformingAction = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const updatedCategory = action.payload;
                const index = state.categories.findIndex(c => c.categoryId === updatedCategory.categoryId);

                if (index !== -1) {
                    state.categories.splice(index, 1);
                    state.categories.splice(index, 0, updatedCategory);
                }
                state.isPerformingAction = false;
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to update category';
                state.isPerformingAction = false;
            });

        // Delete Category
        builder
            .addCase(deleteCategory.pending, (state) => {
                state.isPerformingAction = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter((category) => category.categoryId !== action.payload);
                state.isPerformingAction = false;
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to delete category';
                state.isPerformingAction = false;
            });
    },
});

export const { clear } = categoriesSlice.actions
export default categoriesSlice.reducer;