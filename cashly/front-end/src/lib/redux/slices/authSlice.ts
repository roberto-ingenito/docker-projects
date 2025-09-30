import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, UserCreateDto, UserLoginDto, UserLoginResponseDto } from '@/lib/types/auth';
import * as authApi from '@/lib/api/auth';

const initialState: AuthState = {
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// Helper function to set cookie (client-side)
const setCookie = (name: string, value: string, days: number = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const deleteCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: UserLoginDto) => {
        const response = await authApi.login(credentials);

        // Set both localStorage and cookie
        localStorage.setItem('token', response.token);
        setCookie('token', response.token);

        return response;
    }
);

export const signup = createAsyncThunk(
    'auth/signup',
    async (userData: UserCreateDto) => {
        const response = await authApi.signup(userData);

        // Set both localStorage and cookie
        localStorage.setItem('token', response.token);
        setCookie('token', response.token);

        return response;
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    authApi.logout();

    localStorage.removeItem('token');
    deleteCookie('token');

    return null;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<UserLoginResponseDto>) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;

            // Also set cookie when setting credentials
            setCookie('token', token);
        },
        clearAuth: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;

            deleteCookie('token');
        },
        checkAuth: (state) => {
            const token = localStorage.getItem('token');
            if (token) {
                state.token = token;
                state.isAuthenticated = true;
                setCookie('token', token); // Ensure cookie is also set
            }
        },
    },
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
                localStorage.setItem('token', action.payload.token);
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
                localStorage.setItem('token', action.payload.token);
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

export const { setCredentials, clearAuth, checkAuth } = authSlice.actions;
export default authSlice.reducer;
