import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/authSlice"
import categoriesReducer from "./slices/categoriesSlice"
import accountsReducer from './slices/accountsSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        categories: categoriesReducer,
        accounts: accountsReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store