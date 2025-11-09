import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/authSlice"
import categoriesReducer from "./slices/categoriesSlice"
import accountsReducer from './slices/accountsSlice';
import transactionsReducer from './slices/transactionsSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        categories: categoriesReducer,
        transactions: transactionsReducer,
        accounts: accountsReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store