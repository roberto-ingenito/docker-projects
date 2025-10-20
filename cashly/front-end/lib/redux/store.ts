import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/authSlice"
import categoriesReducer from "./slices/categoriesSlice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        categories: categoriesReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store