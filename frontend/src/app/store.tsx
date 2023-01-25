import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/auth"
import { apiSlice } from "../reducers/api";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer // RTK Query - Built-in data fetching and caching for redux
    },
    middleware: getDefaultMiddleware =>
        // Default middleware to manage cache lifetimes and expiration
        getDefaultMiddleware().concat(apiSlice.middleware)
})

// Inferring RootState type and Dispatch type and exporting them for type-checking
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch