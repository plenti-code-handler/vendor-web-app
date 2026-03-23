import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../AxiosClient";

export const fetchParentDetails = createAsyncThunk(
  "parent/fetchParentDetails",
  async (token, { rejectWithValue }) => {
    try {
      const authToken = token || localStorage.getItem("token");
      const response = await axiosClient.get("/v1/vendor/parent/me/get", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch parent details"
      );
    }
  }
);

const initialState = {
  parentData: null,
  loading: false,
  error: null,
};

const parentSlice = createSlice({
  name: "parent",
  initialState,
  reducers: {
    clearParentData: (state) => {
      state.parentData = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.parentData = action.payload;
      })
      .addCase(fetchParentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearParentData } = parentSlice.actions;

export const selectParentData = (state) => state.parent.parentData;
export const selectParentLoading = (state) => state.parent.loading;
export const selectParentError = (state) => state.parent.error;

export default parentSlice.reducer;

