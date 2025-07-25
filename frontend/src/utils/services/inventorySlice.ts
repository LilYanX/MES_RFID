import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/config/axiosConfig";
import axios from "axios";

export const getInventory = createAsyncThunk(
    "inventory/list",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/inventory/list");
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message ?? "An error occurred during inventory retrieval.");
            }
            return rejectWithValue("An unexpected error occurred during inventory retrieval.");
        }
    }
);

export const getInventoryByStep = createAsyncThunk(
    "inventory/list/step",
    async (step_name: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/inventory/list/${step_name}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message ?? "An error occurred during inventory retrieval.");
            }
            return rejectWithValue("An unexpected error occurred during inventory retrieval.");
        }
    }
);

export const getSteps = createAsyncThunk(
    "inventory/steps",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/inventory/steps");
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message ?? "An error occurred during steps retrieval.");
            }
            return rejectWithValue("An unexpected error occurred during steps retrieval.");
        }
    } 
);

// --- Inventory Slice ---
interface InventoryItem {
  reference: string;
  uuid: string;
  step_name: string;
}

interface InventoryState {
  data: InventoryItem[];
  loading: boolean;
  error: string;
  steps: string[];
  stepsLoading: boolean;
  stepsError: string;
}

const initialState: InventoryState = {
  data: [],
  loading: false,
  error: "",
  steps: [],
  stepsLoading: false,
  stepsError: "",
};

export const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInventory.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getInventory.fulfilled, (state, action) => {
        state.data = Array.isArray(action.payload.inventory)
          ? action.payload.inventory
          : [];
        state.loading = false;
        state.error = "";
      })
      .addCase(getInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Erreur lors du chargement de l'inventaire.";
        state.data = [];
      })
      .addCase(getInventoryByStep.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getInventoryByStep.fulfilled, (state, action) => {
        state.data = Array.isArray(action.payload.inventory)
          ? action.payload.inventory
          : [];
        state.loading = false;
        state.error = "";
      })
      .addCase(getInventoryByStep.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Erreur lors du chargement de l'inventaire.";
        state.data = [];
      })
      // Gestion des steps
      .addCase(getSteps.pending, (state) => {
        state.stepsLoading = true;
        state.stepsError = "";
      })
      .addCase(getSteps.fulfilled, (state, action) => {
        state.steps = Array.isArray(action.payload) ? action.payload : [];
        state.stepsLoading = false;
        state.stepsError = "";
      })
      .addCase(getSteps.rejected, (state, action) => {
        state.stepsLoading = false;
        state.stepsError = action.payload as string || "Erreur lors du chargement des étapes.";
        state.steps = [];
      });
  },
});