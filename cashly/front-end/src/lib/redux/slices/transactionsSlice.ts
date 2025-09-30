import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TransactionsState, Transaction, TransactionCreateDto, TransactionType } from '@/lib/types/transaction';
import * as transactionsApi from '@/lib/api/transactions';

const initialState: TransactionsState = {
    transactions: [],
    isLoading: false,
    error: null,
    filters: {},
};

export const fetchTransactions = createAsyncThunk(
    'transactions/fetchAll',
    async (accountId: number) => {
        const response = await transactionsApi.getTransactions(accountId);
        return response;
    }
);

export const createTransaction = createAsyncThunk(
    'transactions/create',
    async ({ accountId, data }: { accountId: number; data: TransactionCreateDto }) => {
        const response = await transactionsApi.createTransaction(accountId, data);
        return response;
    }
);

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<TransactionsState['filters']>) => {
            state.filters = action.payload;
        },
        clearFilters: (state) => {
            state.filters = {};
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch transactions
            .addCase(fetchTransactions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch transactions';
            })
            // Create transaction
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.transactions.unshift(action.payload);
            });
    },
});

export const { setFilters, clearFilters } = transactionsSlice.actions;
export default transactionsSlice.reducer;