// vendor-web-app/redux/slices/couponsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../AxiosClient";

export const fetchActiveCoupons = createAsyncThunk(
  "coupons/fetchActive",
  async () => {
    const response = await axiosClient.get("/v1/vendor/coupon/get?active=true");
    // Handle different response structures
    console.log(response.data, "response.data");
    return response.data?.data || response.data || [];
  }
);

export const fetchInactiveCoupons = createAsyncThunk(
  "coupons/fetchInactive",
  async () => {
    const response = await axiosClient.get("/v1/vendor/coupon/get?active=false");
    console.log(response.data, "incative");
    // Handle different response structures
    return response.data?.data || response.data || [];
  }
);

const couponsSlice = createSlice({
  name: "coupons",
  initialState: {
    activeCoupons: [],
    inactiveCoupons: [],
    activeLoading: false,
    inactiveLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Active coupons
      .addCase(fetchActiveCoupons.pending, (state) => {
        state.activeLoading = true;
      })
      .addCase(fetchActiveCoupons.fulfilled, (state, action) => {
        state.activeLoading = false;
        // Ensure we always store an array
        state.activeCoupons =  action.payload.response;
        state.error = null;
      })
      .addCase(fetchActiveCoupons.rejected, (state, action) => {
        state.activeLoading = false;
        state.error = action.error.message;
      })
      // Inactive coupons
      .addCase(fetchInactiveCoupons.pending, (state) => {
        state.inactiveLoading = true;
      })
      .addCase(fetchInactiveCoupons.fulfilled, (state, action) => {
        state.inactiveLoading = false;
        // Ensure we always store an array
        state.inactiveCoupons =  action.payload.response;
        state.error = null;
      })
      .addCase(fetchInactiveCoupons.rejected, (state, action) => {
        state.inactiveLoading = false;
        state.error = action.error.message;
      });
  },
});

export default couponsSlice.reducer;