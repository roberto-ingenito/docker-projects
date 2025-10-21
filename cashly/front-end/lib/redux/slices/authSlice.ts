import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, UserCreateDto, UserLoginDto } from '@/lib/types/auth';
import * as authApi from '@/lib/api/auth';
import * as actions from '@/app/actions';

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
        await actions.saveJwtToken(response.token);
        await actions.saveUser(response.user);
        return response;
    }
);

export const signup = createAsyncThunk(
    'auth/signup',
    async (userData: UserCreateDto) => {
        const response = await authApi.signup(userData);
        await actions.saveJwtToken(response.token);
        await actions.saveUser(response.user);
        return response;
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    await actions.deleteJwtToken();
    await actions.deleteUser();
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isLoading = false;
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
                state = initialState;
            });
    },
});

export const { setUser } = authSlice.actions
export default authSlice.reducer;
