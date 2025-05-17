// src/store/slices/balanceSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../AxiosClient";

// Async thunk for fetching balance
export const fetchBalance = createAsyncThunk(
  "balance/fetchBalance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/v1/vendor/me/balance");
      return response.data.balance;
    } catch (error) {
      console.error("Error fetching balance:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch balance"
      );
    }
  }
);

// Slice
const balanceSlice = createSlice({
  name: "balance",
  initialState: {
    value: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.value = action.payload;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default balanceSlice.reducer;
