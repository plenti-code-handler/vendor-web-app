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

export const fetchParentStats = createAsyncThunk(
  "parent/fetchParentStats",
  async (token, { rejectWithValue }) => {
    try {
      const authToken = token || localStorage.getItem("token");
      const response = await axiosClient.get("/v1/vendor/parent/me/stat", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch parent stats"
      );
    }
  }
);

export const fetchParentOutlets = createAsyncThunk(
  "parent/fetchParentOutlets",
  async (token, { rejectWithValue }) => {
    try {
      const authToken = token || localStorage.getItem("token");
      const response = await axiosClient.get("/v1/vendor/parent/outlet/list", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch parent outlets"
      );
    }
  }
);

export const toggleParentOutletOnline = createAsyncThunk(
  "parent/toggleParentOutletOnline",
  async ({ childId, currentIsOnline }, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axiosClient.patch(
        `/v1/vendor/parent/outlet/toggle-online/${childId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to toggle outlet online status"
      );
    }
  }
);

export const addParentOutlet = createAsyncThunk(
  "parent/addParentOutlet",
  async ({ username }, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axiosClient.post(
        "/v1/vendor/parent/outlet/add",
        { username },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to add outlet"
      );
    }
  }
);

export const createParentOutlet = createAsyncThunk(
  "parent/createParentOutlet",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axiosClient.post(
        "/v1/vendor/parent/outlet/create",
        { username, password },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create outlet"
      );
    }
  }
);

export const updateParentDetails = createAsyncThunk(
  "parent/updateParentDetails",
  async (parentUpdate, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axiosClient.put(
        "/v1/vendor/parent/me/update",
        parentUpdate,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update parent details"
      );
    }
  }
);

const initialState = {
  parentData: null,
  parentStats: null,
  loading: false,
  statsLoading: false,
  error: null,
  statsError: null,
  parentOutlets: null,
  outletsLoading: false,
  outletsError: null,
};

const parentSlice = createSlice({
  name: "parent",
  initialState,
  reducers: {
    clearParentData: (state) => {
      state.parentData = null;
      state.parentStats = null;
      state.loading = false;
      state.statsLoading = false;
      state.error = null;
      state.statsError = null;
      state.parentOutlets = null;
      state.outletsLoading = false;
      state.outletsError = null;
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

    builder
      .addCase(fetchParentStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchParentStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.parentStats = action.payload;
      })
      .addCase(fetchParentStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      });

    builder
      .addCase(fetchParentOutlets.pending, (state) => {
        state.outletsLoading = true;
        state.outletsError = null;
      })
      .addCase(fetchParentOutlets.fulfilled, (state, action) => {
        state.outletsLoading = false;
        state.parentOutlets = action.payload;
      })
      .addCase(fetchParentOutlets.rejected, (state, action) => {
        state.outletsLoading = false;
        state.outletsError = action.payload;
      })
      .addCase(toggleParentOutletOnline.fulfilled, (state, action) => {
        const updated = action.payload;
        state.parentOutlets =
          state.parentOutlets?.map((outlet) =>
            outlet.vendor_id === updated.vendor_id
              ? { ...outlet, is_online: updated.is_online }
              : outlet
          ) || state.parentOutlets;
      });

    builder
      .addCase(updateParentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateParentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.parentData = action.payload;
      })
      .addCase(updateParentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearParentData } = parentSlice.actions;

export const selectParentData = (state) => state.parent.parentData;
export const selectParentLoading = (state) => state.parent.loading;
export const selectParentError = (state) => state.parent.error;

export const selectParentStats = (state) => state.parent.parentStats;
export const selectParentStatsLoading = (state) =>
  state.parent.statsLoading;
export const selectParentStatsError = (state) => state.parent.statsError;

export const selectParentOutlets = (state) => state.parent.parentOutlets;
export const selectParentOutletsLoading = (state) => state.parent.outletsLoading;
export const selectParentOutletsError = (state) => state.parent.outletsError;

export default parentSlice.reducer;

