// lib/redux/slices/transactionsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Transaction, TransactionCreateDto, TransactionType, TransactionUpdateDto } from "@/lib/types/transaction";
import * as transactionsApi from "@/lib/api/transactions";

interface TransactionsState {
    transactions: Transaction[];
    isLoading: boolean;
    error: string | null;
    firstLoadDone: boolean;
    filters: {
        type?: TransactionType;
        categoryId?: number;
        dateFrom?: string;
        dateTo?: string;
    };
}

const initialState: TransactionsState = {
    transactions: [],
    isLoading: false,
    error: null,
    firstLoadDone: false,
    filters: {},
};

// Thunks
export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async () => {
        const response = await transactionsApi.getTransactions();
        return response;
    }
);

export const createTransaction = createAsyncThunk(
    'transactions/createTransaction',
    async (data: TransactionCreateDto) => {
        const response = await transactionsApi.createTransaction(data);
        return response;
    }
);

export const deleteTransaction = createAsyncThunk(
    'categories/deleteTransaction',
    async (transactionId: number) => {
        await transactionsApi.deleteTransaction(transactionId);
        return transactionId;
    }
);

export const updateTransaction = createAsyncThunk(
    "transactions/updateTransaction",
    async ({ transactionId, data }: { transactionId: number; data: TransactionUpdateDto }) => {
        return await transactionsApi.updateTransaction({ transactionId, data });
    }
);


// Slice
const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {};
        },
        resetTransactions: (state) => {
            state.transactions = [];
            state.firstLoadDone = false;
            state.filters = {};
        },
        clear: () => initialState,
    },
    extraReducers: (builder) => {
        // Fetch Transactions
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions = action.payload;
                state.firstLoadDone = true;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Errore nel caricamento delle transazioni';
            });

        // Create Transaction
        builder
            .addCase(createTransaction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions.unshift(action.payload); // Aggiungi in cima
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Errore nella creazione della transazione';
            });

        // Update transaction
        builder
            .addCase(updateTransaction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateTransaction.fulfilled, (state, action) => {
                const updatedTransaction = action.payload;
                const index = state.transactions.findIndex(t => t.transactionId === updatedTransaction.transactionId);
                if (index !== -1) {
                    state.transactions[index].amount = updatedTransaction.amount;
                    state.transactions[index].category = updatedTransaction.category;
                    state.transactions[index].description = updatedTransaction.description;
                    state.transactions[index].transactionDate = updatedTransaction.transactionDate;
                    state.transactions[index].type = updatedTransaction.type;
                }
                state.isLoading = false;
            })
            .addCase(updateTransaction.rejected, (state) => {
                state.isLoading = false;
            });

        // Delete transaction
        builder
            .addCase(deleteTransaction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions = state.transactions.filter((transaction) => transaction.transactionId !== action.payload);
            })
            .addCase(deleteTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to delete transaction';
            });
    },
});

export const { clearError, setFilters, clearFilters, resetTransactions, clear } = transactionsSlice.actions;
export default transactionsSlice.reducer;