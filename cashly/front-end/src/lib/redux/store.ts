import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import accountsReducer from './slices/accountsSlice';
import categoriesReducer from './slices/categoriesSlice';
import transactionsReducer from './slices/transactionsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        accounts: accountsReducer,
        categories: categoriesReducer,
        transactions: transactionsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
