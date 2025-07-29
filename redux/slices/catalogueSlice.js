import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../AxiosClient';

// Async thunk to fetch catalogue
export const fetchCatalogue = createAsyncThunk(
  'catalogue/fetchCatalogue',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get("/v1/vendor/catalogue/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data, "response.data");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch catalogue');
    }
  }
);

// Async thunk to request catalogue update
export const requestCatalogueUpdate = createAsyncThunk(
  'catalogue/requestUpdate',
  async (catalogueData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/v1/vendor/catalogue/request', catalogueData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update catalogue');
    }
  }
);

const catalogueSlice = createSlice({
  name: 'catalogue',
  initialState: {
    itemTypes: {}, // Changed from 'items' to 'itemTypes'
    payout: {}, // Added payout field
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null,
    lastUpdated: null,
  },
  reducers: {
    clearCatalogueError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    resetCatalogue: (state) => {
      state.itemTypes = {}; // Updated field name
      state.payout = {}; // Added payout reset
      state.loading = false;
      state.error = null;
      state.updateLoading = false;
      state.updateError = null;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch catalogue
      .addCase(fetchCatalogue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCatalogue.fulfilled, (state, action) => {
        state.loading = false;
        // Handle new response structure
        state.itemTypes = action.payload.item_types || {}; // Updated field name
        state.payout = action.payload.payout || {}; // Added payout handling
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCatalogue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Request update
      .addCase(requestCatalogueUpdate.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(requestCatalogueUpdate.fulfilled, (state) => {
        state.updateLoading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(requestCatalogueUpdate.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
  },
});

export const { clearCatalogueError, resetCatalogue } = catalogueSlice.actions;
export default catalogueSlice.reducer;