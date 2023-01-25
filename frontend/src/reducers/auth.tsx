// Reducer for authentication
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import type { AppDispatch } from "../app/store";

type AuthState = {
    user: string | null,
    token: string | null
}

const initialState = (): AuthState => ({
    user: localStorage.getItem('user'),
    token: localStorage.getItem('token')
})


const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setCredentials: (state, {payload: {user, token}} : PayloadAction<{user: string, token: string}>) => {
            state.user = user
            state.token = token
        },
        clearCredentials: () => initialState()
    }
})

const { setCredentials, clearCredentials } = authSlice.actions

export const loginAuth = (user: string, token: string) => (dispatch: AppDispatch) => {
    localStorage.setItem('user', user)
    localStorage.setItem('token', token)
    dispatch(setCredentials({user, token}))
}

export const logout = () => (dispatch: AppDispatch) => {
    localStorage.clear()
    dispatch(clearCredentials())
}

export const selectCurrUser = (state: RootState) => state.auth.user

export default authSlice.reducer
    

