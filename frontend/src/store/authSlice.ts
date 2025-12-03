import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

interface AuthState {
    isAuthenticated: boolean;
    username: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    username: null,
    status: 'idle',
    error: null,
};

export const checkAuth = createAsyncThunk(`${process.env.REACT_APP_BACKEND_API_URL}/auth/checkAuth`, async() => {
    const response = await axios.get<{loggedIn: boolean, username?: string}>(`${process.env.REACT_APP_BACKEND_API_URL}/auth`, { withCredentials: true });
    return response.data;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.isAuthenticated = false;
            state.username = null;
            state.status = 'idle';
            state.error = null;
        },
        setAuth(state, action: PayloadAction<{ username: string, isAuthenticated: boolean, status: string }>) {
            state.username = action.payload.username;
            state.isAuthenticated = action.payload.isAuthenticated;
            state.status = action.payload.status as AuthState['status'];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(checkAuth.fulfilled, (state, action: PayloadAction<{ loggedIn: boolean, username?: string}>) => {
                state.status = 'succeeded';
                state.isAuthenticated = action.payload.loggedIn;
                state.username = action.payload.username || null;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to check authentication';
            });
    },
});

export const { logout } = authSlice.actions;
export const { setAuth } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;