import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../AxiosClient";

/** Unified async worker job type (backend ``AsyncJobTypes.VENDOR_REPORT``). */
export const VENDOR_REPORT_JOB_TYPE = "VENDOR_REPORT";

/** Report categories sent in API payload and shown in the UI. */
export const REPORT_TYPES = {
  ORDERS: "ORDER",
  PAYMENTS: "PAYMENT",
  REFUNDS: "REFUNDS",
  PAYOUTS: "PAYOUTS",
  ITEM_CONSOLIDATED: "ITEM_CONSOLIDATED",
};

const reportListUrl = `/v2/vendor/report`;

export const fetchVendorReports = createAsyncThunk(
  "vendorReports/fetchList",
  async ({ reportType, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const params = { skip: 0, limit };
      if (reportType) {
        params.report_type = reportType;
      }
      const { data } = await axiosClient.get(reportListUrl, { params });
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return rejectWithValue(e.response?.data?.detail || e.message);
    }
  }
);

export const requestVendorReport = createAsyncThunk(
  "vendorReports/requestReport",
  async ({ start_ts, end_ts, report_type = REPORT_TYPES.ORDERS }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post(reportListUrl, {
        start_ts,
        end_ts,
        report_type,
      });
      return data;
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
  },
  reducers: {},
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
      .addCase(requestVendorReport.pending, (state) => {
        state.requestLoading = true;
        state.requestError = null;
      })
      .addCase(requestVendorReport.fulfilled, (state, action) => {
        state.requestLoading = false;
        const jobId = action.payload.job_id;
        state.jobs = [
          action.payload,
          ...state.jobs.filter((j) => (j.job_id || j.id) !== jobId),
        ];
        if (action.payload.vendor_id) state.vendorId = action.payload.vendor_id;
      })
      .addCase(requestVendorReport.rejected, (state, action) => {
        state.requestLoading = false;
        state.requestError = action.payload || action.error.message;
      });
  },
});
export default vendorReportsSlice.reducer;
