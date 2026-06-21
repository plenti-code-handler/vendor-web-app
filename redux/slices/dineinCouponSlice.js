import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../AxiosClient";

const BASE_URL = "/v1/vendor/dinein-coupon";

export const fetchDineinCoupons = createAsyncThunk(
  "dineinCoupons/fetchList",
  async ({ skip = 0, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get(`${BASE_URL}/get`, {
        params: { skip, limit },
      });
      console.log(data, "data");
      return { ...data, skip, limit };
    } catch (e) {
      const detail = e.response?.data?.detail;
      return rejectWithValue(
        typeof detail === "string" ? detail : e.message || "Failed to load coupons"
      );
    }
  }
);

export const createDineinCoupon = createAsyncThunk(
  "dineinCoupons/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post(`${BASE_URL}/create`, payload);
      return data;
    } catch (e) {
      const detail = e.response?.data?.detail;
      return rejectWithValue(
        typeof detail === "string" ? detail : e.message || "Failed to create coupon"
      );
    }
  }
);

export const toggleDineinCoupon = createAsyncThunk(
  "dineinCoupons/toggle",
  async ({ couponId, is_active }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.patch(`${BASE_URL}/toggle/${couponId}`, {
        is_active,
      });
      return data;
    } catch (e) {
      const detail = e.response?.data?.detail;
      return rejectWithValue(
        typeof detail === "string" ? detail : e.message || "Failed to update coupon"
      );
    }
  }
);

export const deactivateAllDineinCoupons = createAsyncThunk(
  "dineinCoupons/deactivateAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.patch(`${BASE_URL}/deactivate-all`);
      return data;
    } catch (e) {
      const detail = e.response?.data?.detail;
      return rejectWithValue(
        typeof detail === "string" ? detail : e.message || "Failed to deactivate coupons"
      );
    }
  }
);

export const verifyDineinCoupon = createAsyncThunk(
  "dineinCoupons/verify",
  async ({ code, bill_amount }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post(`${BASE_URL}/verify`, {
        code,
        bill_amount,
      });
      console.log(data, "data");
      return data;
    } catch (e) {
      const detail = e.response?.data?.detail;
      return rejectWithValue(
        typeof detail === "string" ? detail : e.message || "Verification failed"
      );
    }
  }
);

const dineinCouponSlice = createSlice({
  name: "dineinCoupons",
  initialState: {
    coupons: [],
    issuedCount: 0,
    usedCount: 0,
    skip: 0,
    limit: 20,
    listLoading: false,
    listError: null,
    createLoading: false,
    createError: null,
    toggleLoadingId: null,
    toggleError: null,
    deactivateAllLoading: false,
    deactivateAllError: null,
    verifyLoading: false,
    verifyError: null,
    lastVerifyResult: null,
  },
  reducers: {
    clearVerifyResult(state) {
      state.lastVerifyResult = null;
      state.verifyError = null;
    },
    clearCreateError(state) {
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDineinCoupons.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchDineinCoupons.fulfilled, (state, action) => {
        state.listLoading = false;
        state.coupons = action.payload.coupons ?? [];
        state.issuedCount = action.payload.issued_count ?? 0;
        state.usedCount = action.payload.used_count ?? 0;
        state.skip = action.payload.skip ?? 0;
        state.limit = action.payload.limit ?? 20;
      })
      .addCase(fetchDineinCoupons.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload || action.error.message;
      })
      .addCase(createDineinCoupon.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createDineinCoupon.fulfilled, (state, action) => {
        state.createLoading = false;
        state.coupons = [action.payload, ...state.coupons.filter((c) => c.id !== action.payload.id)];
      })
      .addCase(createDineinCoupon.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || action.error.message;
      })
      .addCase(toggleDineinCoupon.pending, (state, action) => {
        state.toggleLoadingId = action.meta.arg.couponId;
        state.toggleError = null;
      })
      .addCase(toggleDineinCoupon.fulfilled, (state, action) => {
        state.toggleLoadingId = null;
        const updated = action.payload;
        if (updated.is_active) {
          state.coupons = state.coupons.map((coupon) =>
            coupon.id === updated.id
              ? updated
              : { ...coupon, is_active: false }
          );
        } else {
          state.coupons = state.coupons.map((coupon) =>
            coupon.id === updated.id ? updated : coupon
          );
        }
      })
      .addCase(toggleDineinCoupon.rejected, (state, action) => {
        state.toggleLoadingId = null;
        state.toggleError = action.payload || action.error.message;
      })
      .addCase(deactivateAllDineinCoupons.pending, (state) => {
        state.deactivateAllLoading = true;
        state.deactivateAllError = null;
      })
      .addCase(deactivateAllDineinCoupons.fulfilled, (state) => {
        state.deactivateAllLoading = false;
        state.coupons = state.coupons.map((coupon) => ({
          ...coupon,
          is_active: false,
        }));
      })
      .addCase(deactivateAllDineinCoupons.rejected, (state, action) => {
        state.deactivateAllLoading = false;
        state.deactivateAllError = action.payload || action.error.message;
      })
      .addCase(verifyDineinCoupon.pending, (state) => {
        state.verifyLoading = true;
        state.verifyError = null;
        state.lastVerifyResult = null;
      })
      .addCase(verifyDineinCoupon.fulfilled, (state, action) => {
        state.verifyLoading = false;
        state.lastVerifyResult = action.payload;
        state.usedCount += 1;
      })
      .addCase(verifyDineinCoupon.rejected, (state, action) => {
        state.verifyLoading = false;
        state.verifyError = action.payload || action.error.message;
      });
  },
});

export const { clearVerifyResult, clearCreateError } = dineinCouponSlice.actions;
export default dineinCouponSlice.reducer;
