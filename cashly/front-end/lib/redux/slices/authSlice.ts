import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthState, UserCreateDto, UserLoginDto } from '@/lib/types/auth';
import * as authApi from '@/lib/api/auth';
import { deleteJwtToken, saveJwtToken } from '@/app/actions';

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: UserLoginDto) => {
        const response = await authApi.login(credentials);
        await saveJwtToken(response.token);
        return response;
    }
);

export const signup = createAsyncThunk(
    'auth/signup',
    async (userData: UserCreateDto) => {
        const response = await authApi.signup(userData);
        await saveJwtToken(response.token);
        return response;
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    await deleteJwtToken();
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Login failed';
            })
            // Signup
            .addCase(signup.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(signup.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Signup failed';
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = null;
            });
    },
});

export default authSlice.reducer;
