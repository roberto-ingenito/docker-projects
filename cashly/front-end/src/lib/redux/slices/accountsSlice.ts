import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AccountsState, Account, AccountCreateDto, AccountUpdateDto } from '@/lib/types/account';
import * as accountsApi from '@/lib/api/accounts';

const initialState: AccountsState = {
    accounts: [],
    selectedAccount: null,
    isLoading: false,
    error: null,
};

export const fetchAccounts = createAsyncThunk(
    'accounts/fetchAll',
    async () => {
        const response = await accountsApi.getAccounts();
        return response;
    }
);

export const fetchAccount = createAsyncThunk(
    'accounts/fetchOne',
    async (accountId: number) => {
        const response = await accountsApi.getAccount(accountId);
        return response;
    }
);

export const createAccount = createAsyncThunk(
    'accounts/create',
    async (data: AccountCreateDto) => {
        const response = await accountsApi.createAccount(data);
        return response;
    }
);

export const updateAccount = createAsyncThunk(
    'accounts/update',
    async ({ id, data }: { id: number; data: AccountUpdateDto }) => {
        const response = await accountsApi.updateAccount(id, data);
        return { id, data };
    }
);

export const deleteAccount = createAsyncThunk(
    'accounts/delete',
    async (accountId: number) => {
        await accountsApi.deleteAccount(accountId);
        return accountId;
    }
);

const accountsSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {
        selectAccount: (state, action: PayloadAction<Account | null>) => {
            state.selectedAccount = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all accounts
            .addCase(fetchAccounts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAccounts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.accounts = action.payload;
            })
            .addCase(fetchAccounts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch accounts';
            })
            // Fetch single account
            .addCase(fetchAccount.fulfilled, (state, action) => {
                state.selectedAccount = action.payload;
            })
            // Create account
            .addCase(createAccount.fulfilled, (state, action) => {
                state.accounts.push(action.payload);
            })
            // Update account
            .addCase(updateAccount.fulfilled, (state, action) => {
                const index = state.accounts.findIndex(a => a.accountId === action.payload.id);
                if (index !== -1) {
                    state.accounts[index] = { ...state.accounts[index], ...action.payload.data };
                }
            })
            // Delete account
            .addCase(deleteAccount.fulfilled, (state, action) => {
                state.accounts = state.accounts.filter(a => a.accountId !== action.payload);
                if (state.selectedAccount?.accountId === action.payload) {
                    state.selectedAccount = null;
                }
            });
    },
});

export const { selectAccount } = accountsSlice.actions;
export default accountsSlice.reducer;
