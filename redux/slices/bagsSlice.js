import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { toast } from "sonner";
import axiosClient from "../../AxiosClient";

export const fetchAllBags = createAsyncThunk("bags/fetchAllBags", async () => {
  try {
    const response = await axiosClient.get(
      "/v1/vendor/item/get/all?active=true"
    );
    return response.data || [];
  } catch (error) {
    console.log(error);
    throw error;
  }
});

const bagsSlice = createSlice({
  name: "bags",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateBag: (state, action) => {
      const updatedBag = action.payload;
      state.items = state.items.map((bag) =>
        bag.id === updatedBag.id ? updatedBag : bag
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBags.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllBags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateBag } = bagsSlice.actions;
export default bagsSlice.reducer;
