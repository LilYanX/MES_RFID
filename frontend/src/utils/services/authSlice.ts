import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/config/axiosConfig";
import axios from "axios";

export const login = createAsyncThunk(
    "login",
    async (credentials: { email: string; password_hash: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/login", credentials);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message ?? "An error occurred during login.");
            }
            return rejectWithValue("An unexpected error occurred during login.");
        }
    }
);

export const register = createAsyncThunk(
    "register",
    async (credentials: { email: string; password: string, firstName: string, lastName: string, username: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/register", credentials);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message ?? "An error occurred during registration.");
            }
            return rejectWithValue("An unexpected error occurred during registration.");
        }
    }
);

export const getUserInfo = createAsyncThunk(
    "info/{uuid}",
    async (uuid: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/users/info/${uuid}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message ?? "An error occurred during getting user info.");
            }
            return rejectWithValue("An unexpected error occurred during getting user info.");
        }
    }
);

export const updateUser = createAsyncThunk(
    "update/{uuid}",
    async (user: { email: string; password: string, firstName: string, lastName: string, username: string, uuid: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/users/${user.uuid}`, user);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message ?? "An error occurred during updating user.");
            }
            return rejectWithValue("An unexpected error occurred during updating user.");
        }
    }
);  

export const deleteUser = createAsyncThunk(
    "delete/{uuid}",
    async (uuid: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/users/${uuid}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message ?? "An error occurred during deleting user.");
            }
            return rejectWithValue("An unexpected error occurred during deleting user.");
        }
    }
);

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isLoading: false,
        error: null as string | null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                // Adapter selon la structure de la réponse API
                state.user = action.payload.user || action.payload;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.user = null;
                state.error = action.payload as string;
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.user = action.payload.user || action.payload;
                state.error = null;
            })
            .addCase(getUserInfo.rejected, (state, action) => {
                state.user = null;
                state.error = action.payload as string;
            });
    }
});