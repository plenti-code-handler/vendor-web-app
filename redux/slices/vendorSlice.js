import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../AxiosClient';

// Async thunk to fetch vendor details
export const fetchVendorDetails = createAsyncThunk(
  'vendor/fetchVendorDetails',
  async (token, { rejectWithValue }) => {
    try {
      if (!token) {
        token = localStorage.getItem("token");
      }
      console.log("fetching vendor details", token);
      const response = await axiosClient.get("/v1/vendor/me/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("venor details fetched ->", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch vendor details');
    }
  }
);

// Async thunk to update vendor details
export const updateVendorDetails = createAsyncThunk(
  'vendor/updateVendorDetails',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.put("/v1/vendor/me/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update vendor details');
    }
  }
);

// Async thunk to fetch bank account details
export const fetchBankAccountDetails = createAsyncThunk(
  'vendor/fetchBankAccountDetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get("/v1/vendor/me/account-details/get", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch bank account details');
    }
  }
);

// Async thunk to update bank account details
export const updateBankAccountDetails = createAsyncThunk(
  'vendor/updateBankAccountDetails',
  async (bankData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.post("/v1/vendor/me/add-account-details", bankData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update bank account details');
    }
  }
);

const initialState = {
  vendorData: null,
  loading: false,
  error: null,
  isOnline: false,
  isActive: false,
  emailVerified: false,
  bankAccountDetails: null,
  bankAccountLoading: false,
  bankAccountError: null,
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    logoutVendor: (state) => {
      state.vendorData = null;
      state.loading = false;
      state.error = null;
      state.isOnline = false;
      state.isActive = false;
      state.emailVerified = false;
      state.bankAccountDetails = null;
      state.bankAccountLoading = false;
      state.bankAccountError = null;
    },
    clearVendorData: (state) => {
      state.vendorData = null;
      state.loading = false;
      state.error = null;
    },
    setVendorOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
      if (state.vendorData) {
        state.vendorData.is_online = action.payload;
      }
    },
    setVendorActiveStatus: (state, action) => {
      state.isActive = action.payload;
      if (state.vendorData) {
        state.vendorData.is_active = action.payload;
      }
    },
    updateVendorField: (state, action) => {
      const { field, value } = action.payload;
      if (state.vendorData) {
        state.vendorData[field] = value;
      }
    },
    clearBankAccountDetails: (state) => {
      state.bankAccountDetails = null;
      state.bankAccountLoading = false;
      state.bankAccountError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch vendor details
    builder
      .addCase(fetchVendorDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorData = action.payload;
        state.isOnline = action.payload.is_online || false;
        state.isActive = action.payload.is_active || false;
        state.emailVerified = action.payload.email_verified || false;
      })
      .addCase(fetchVendorDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update vendor details
      .addCase(updateVendorDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVendorDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorData = { ...state.vendorData, ...action.payload };
      })
      .addCase(updateVendorDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch bank account details
      .addCase(fetchBankAccountDetails.pending, (state) => {
        state.bankAccountLoading = true;
        state.bankAccountError = null;
      })
      .addCase(fetchBankAccountDetails.fulfilled, (state, action) => {
        state.bankAccountLoading = false;
        state.bankAccountDetails = action.payload;
      })
      .addCase(fetchBankAccountDetails.rejected, (state, action) => {
        state.bankAccountLoading = false;
        state.bankAccountError = action.payload;
      })
      // Update bank account details
      .addCase(updateBankAccountDetails.pending, (state) => {
        state.bankAccountLoading = true;
        state.bankAccountError = null;
      })
      .addCase(updateBankAccountDetails.fulfilled, (state, action) => {
        state.bankAccountLoading = false;
        state.bankAccountDetails = action.payload;
      })
      .addCase(updateBankAccountDetails.rejected, (state, action) => {
        state.bankAccountLoading = false;
        state.bankAccountError = action.payload;
      });
  },
});

export const { 
  logoutVendor,
  clearVendorData, 
  setVendorOnlineStatus, 
  setVendorActiveStatus, 
  updateVendorField,
  clearBankAccountDetails
} = vendorSlice.actions;

// Selectors
export const selectVendorData = (state) => state.vendor.vendorData;
export const selectVendorLoading = (state) => state.vendor.loading;
export const selectVendorError = (state) => state.vendor.error;
export const selectVendorOnlineStatus = (state) => state.vendor.isOnline;
export const selectVendorActiveStatus = (state) => state.vendor.isActive;
export const selectVendorEmailVerified = (state) => state.vendor.emailVerified;

// Bank account selectors
export const selectBankAccountDetails = (state) => state.vendor.bankAccountDetails;
export const selectBankAccountLoading = (state) => state.vendor.bankAccountLoading;
export const selectBankAccountError = (state) => state.vendor.bankAccountError;

export default vendorSlice.reducer;
