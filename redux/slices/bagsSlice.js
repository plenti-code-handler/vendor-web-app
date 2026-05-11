import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axiosClient from "../../AxiosClient";

export const BAGS_PAGE_LIMIT = 10;

export const fetchAllBags = createAsyncThunk(
  "bags/fetchAllBags",
  async (arg = {}) => {
    const active = arg.active !== undefined ? arg.active : true;
    const skip = arg.skip ?? 0;
    const limit = arg.limit ?? BAGS_PAGE_LIMIT;
    const append = arg.append ?? false;

    const response = await axiosClient.get(
      `/v1/vendor/item/get/all?active=${active ? "true" : "false"}&skip=${skip}&limit=${limit}`
    );
    const items = Array.isArray(response.data) ? response.data : [];
    return { items, limit, append, active };
  }
);

const bagsSlice = createSlice({
  name: "bags",
  initialState: {
    items: [],
    loading: false,
    loadingMore: false,
    hasMore: false,
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
      .addCase(fetchAllBags.pending, (state, action) => {
        const append = action.meta.arg?.append ?? false;
        state.error = null;
        if (append) {
          state.loadingMore = true;
        } else {
          state.loading = true;
        }
      })
      .addCase(fetchAllBags.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        const { items, limit, append } = action.payload;
        if (append) {
          state.items = [...state.items, ...items];
        } else {
          state.items = items;
        }
        state.hasMore = items.length === limit;
      })
      .addCase(fetchAllBags.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.error.message;
      });
  },
});

export const { updateBag } = bagsSlice.actions;
export default bagsSlice.reducer;
