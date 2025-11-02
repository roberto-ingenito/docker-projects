import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Account, AccountCreateDto, AccountUpdateDto } from "@/lib/types/account";
import * as accountsApi from "@/lib/api/accounts";

interface AccountsState {
    accounts: Account[];
    isLoading: boolean;
    error: string | null;
    firstLoadDone: boolean;
}

const initialState: AccountsState = {
    accounts: [],
    isLoading: false,
    error: null,
    firstLoadDone: false,
};

// Thunks
export const fetchAccounts = createAsyncThunk(
    'accounts/fetchAccounts',
    async () => {
        const response = await accountsApi.getAccounts();
        return response;
    }
);

export const createAccount = createAsyncThunk(
    'accounts/createAccount',
    async (data: AccountCreateDto) => {
        const response = await accountsApi.createAccount(data);
        return response;
    }
);

export const updateAccount = createAsyncThunk(
    'accounts/updateAccount',
    async ({ accountId, data }: { accountId: number; data: AccountUpdateDto }) => {
        await accountsApi.updateAccount(accountId, data);
        return { accountId, data };
    }
);

export const deleteAccount = createAsyncThunk(
    'accounts/deleteAccount',
    async (accountId: number) => {
        await accountsApi.deleteAccount(accountId);
        return accountId;
    }
);


// Slice
const accountsSlice = createSlice({
    name: "accounts",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Accounts
        builder.addCase(fetchAccounts.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(fetchAccounts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.accounts = action.payload;
                state.firstLoadDone = true;
            })
            .addCase(fetchAccounts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch accounts';
            });

        // Create Account
        builder
            .addCase(createAccount.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createAccount.fulfilled, (state, action) => {
                state.isLoading = false;
                state.accounts.push(action.payload);
            })
            .addCase(createAccount.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to create account';
            });

        // Update Account
        builder
            .addCase(updateAccount.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateAccount.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.accounts.findIndex((acc) => acc.accountId === action.payload.accountId);
                if (index !== -1 && action.payload.data.accountName) {
                    state.accounts[index].accountName = action.payload.data.accountName;
                }
            })
            .addCase(updateAccount.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to update account';
            });

        // Delete Account
        builder
            .addCase(deleteAccount.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteAccount.fulfilled, (state, action) => {
                state.isLoading = false;
                state.accounts = state.accounts.filter((acc) => acc.accountId !== action.payload);
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to delete account';
            });
    },
});

export const { clearError } = accountsSlice.actions;
export default accountsSlice.reducer;