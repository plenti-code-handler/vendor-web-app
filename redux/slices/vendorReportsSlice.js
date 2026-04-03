import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../AxiosClient";

export const REPORT_JOB_TYPE = "VENDOR_ORDER_REPORT";

const reportListUrl = `/v2/vendor/report`;

export const fetchVendorReports = createAsyncThunk(
  "vendorReports/fetchList",
  async ({ jobType = REPORT_JOB_TYPE, limit = 100 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get(reportListUrl, {
        params: { job_type: jobType, skip: 0, limit },
      });
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return rejectWithValue(e.response?.data?.detail || e.message);
    }
  }
);

export const requestOrderReport = createAsyncThunk(
  "vendorReports/requestOrder",
  async ({ start_ts, end_ts }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post(reportListUrl, { start_ts, end_ts });
      return data;
    } catch (e) {
      const d = e.response?.data?.detail;
      return rejectWithValue(typeof d === "string" ? d : JSON.stringify(d || e.message));
    }
  }
);

export const fetchReportDownloadUrl = createAsyncThunk(
  "vendorReports/downloadUrl",
  async ({ jobId, s3_key }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post(`${reportListUrl}/download-url`, {
        s3_key,
      });
      return { ...data, jobId };
    } catch (e) {
      const d = e.response?.data?.detail;
      return rejectWithValue(typeof d === "string" ? d : JSON.stringify(d || e.message));
    }
  }
);

const vendorReportsSlice = createSlice({
  name: "vendorReports",
  initialState: {
    jobs: [],
    vendorId: null,
    listLoading: false,
    listError: null,
    requestLoading: false,
    requestError: null,
    downloadLoadingId: null,
    downloadError: null,
  },
  reducers: {
    clearDownloadError: (state) => {
      state.downloadError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorReports.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchVendorReports.fulfilled, (state, action) => {
        state.listLoading = false;
        state.jobs = action.payload;
        const vid = action.payload.find((j) => j.vendor_id)?.vendor_id;
        if (vid) state.vendorId = vid;
      })
      .addCase(fetchVendorReports.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload || action.error.message;
      })
      .addCase(requestOrderReport.pending, (state) => {
        state.requestLoading = true;
        state.requestError = null;
      })
      .addCase(requestOrderReport.fulfilled, (state, action) => {
        state.requestLoading = false;
        state.jobs = [action.payload, ...state.jobs.filter((j) => j.id !== action.payload.id)];
        if (action.payload.vendor_id) state.vendorId = action.payload.vendor_id;
      })
      .addCase(requestOrderReport.rejected, (state, action) => {
        state.requestLoading = false;
        state.requestError = action.payload || action.error.message;
      })
      .addCase(fetchReportDownloadUrl.pending, (state, action) => {
        state.downloadLoadingId = action.meta.arg?.jobId ?? null;
        state.downloadError = null;
      })
      .addCase(fetchReportDownloadUrl.fulfilled, (state) => {
        state.downloadLoadingId = null;
      })
      .addCase(fetchReportDownloadUrl.rejected, (state, action) => {
        state.downloadLoadingId = null;
        state.downloadError = action.payload || action.error.message;
      });
  },
});

export const { clearDownloadError } = vendorReportsSlice.actions;
export default vendorReportsSlice.reducer;
