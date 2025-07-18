import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/config/axiosConfig";
import axios from "axios";



export const login = createAsyncThunk(
    "auth/login",
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/auth/login", credentials);
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
    "auth/register",
    async (credentials: { email: string; password: string, firstName: string, lastName: string, username: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/auth/register", credentials);
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
    "auth/info/{uuid}",
    async (uuid: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/auth/users/info/${uuid}`);
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
    "auth/updateUser/{uuid}",
    async (user: { email: string; password: string, firstName: string, lastName: string, username: string, uuid: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/auth/users/${user.uuid}`, user);
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
    "auth/delete/{uuid}",
    async (uuid: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/auth/users/${uuid}`);
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
        error: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        }
    }
});