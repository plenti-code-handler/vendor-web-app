"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowPathIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { setActivePage } from "../../../../redux/slices/headerSlice";
import {
  fetchVendorReports,
  requestOrderReport,
  REPORT_TYPES,
} from "../../../../redux/slices/vendorReportsSlice";
import {
  istStartOfDayUnix,
  istEndOfDayUnix,
  formatUnixIst,
} from "../../../../utility/istUnix";
import { baseUrl } from "../../../../utility/BaseURL";
import BetaBadge from "../../../common/BetaBadge";

const REPORT_TABS = [
  { key: "orders", label: "Orders", reportType: REPORT_TYPES.ORDERS, enabled: true },
  { key: "payments", label: "Payments", reportType: REPORT_TYPES.PAYMENTS, enabled: false },
  { key: "refunds", label: "Refunds", reportType: REPORT_TYPES.REFUNDS, enabled: false },
  { key: "payouts", label: "Payouts", reportType: REPORT_TYPES.PAYOUTS, enabled: false },
];

const REPORT_POLL_INTERVAL_MS = 10_000;
const NEW_REPORT_MAX_AGE_SEC = 5 * 60;
/** Ignore repeat download taps while navigation starts (no in-button spinner; browser shows progress). */
const DOWNLOAD_NAV_DEBOUNCE_MS = 1_500;

function buildVendorReportDownloadPageUrl(jobId) {
  const root = String(baseUrl || "").replace(/\/$/, "");
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  const params = new URLSearchParams({ access_token: token });
  const role = localStorage.getItem("role");
  const targetVendorId = localStorage.getItem("target_vendor_id");
  if (role === "PARENT" && targetVendorId) {
    params.set("target_vendor_id", targetVendorId);
  }
  return `${root}/v2/vendor/report/download/${encodeURIComponent(jobId)}?${params.toString()}`;
}


const FIELD_LABEL_CLASS =
  "text-xs font-medium uppercase tracking-wide text-slate-500";
const DATE_INPUT_CLASS =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-[#5f22d9]/20 transition focus:border-[#5f22d9] focus:ring-2";

function normStatus(status) {
  return (status || "").toUpperCase();
}

/** PENDING: card emphasis, StatusBadge pulse, and top-row list polling. */
function isReportInProgressStatus(status) {
  return normStatus(status) === "PENDING" || normStatus(status) === "RUNNING";
}

function canReportJobDownload(job) {
  return normStatus(job.status) === "READY" && Boolean(job.response?.s3_key);
}

function reportTabButtonClass({ selected, disabled }) {
  const base =
    "inline-flex min-h-[2.5rem] shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5F22D9]/35 focus-visible:ring-offset-1";
  if (disabled) {
    return `${base} cursor-not-allowed border-slate-300 bg-slate-100 text-slate-400 shadow-none hover:bg-slate-100`;
  }
  if (selected) {
    return `${base} border-[#5F22D9] bg-[#5F22D9]/10 text-[#5F22D9] shadow-sm`;
  }
  return `${base} border-transparent text-slate-600 hover:border-slate-200 hover:bg-white`;
}

function reportCardClass({ busy, isNew }) {
  if (busy) {
    return "border-sky-100 shadow-sky-100/50 ring-1 ring-sky-100/80";
  }
  if (isNew) {
    return "border-transparent bg-gradient-to-r from-amber-100/80 to-yellow-50/40 ring-1 ring-amber-100/50";
  }
  return "border-slate-200/80 hover:border-slate-300";
}

const STATUS_BADGE_STYLES = {
  PENDING: "bg-amber-50 text-amber-800 ring-amber-200",
  QUEUED: "bg-amber-50 text-amber-800 ring-amber-200",
  RUNNING: "bg-sky-50 text-sky-800 ring-sky-200",
  READY: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  FAILED: "bg-rose-50 text-rose-800 ring-rose-200",
};

function StatusBadge({ status }) {
  const s = normStatus(status);
  const busy = isReportInProgressStatus(s);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
        STATUS_BADGE_STYLES[s] || "bg-slate-50 text-slate-700 ring-slate-200"
      }`}
    >
      {busy && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#39ff14] opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e]" />
        </span>
      )}
      {status || "—"}
    </span>
  );
}

function ReportJobRow({ job, onDownload }) {
  const nowTs = Math.floor(Date.now() / 1000);
  const isNew =
    job?.created_at && nowTs - Number(job.created_at) <= NEW_REPORT_MAX_AGE_SEC;
  const busy = isReportInProgressStatus(job.status);
  const downloadable = canReportJobDownload(job);

  return (
    <div
      className={`group rounded-2xl border bg-white p-4 shadow-sm transition ${reportCardClass({
        busy,
        isNew,
      })}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-slate-400">
              {String(job.job_type || "").replace(/_/g, " ")}
            </span>
            {isNew ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-900 ring-1 ring-inset ring-amber-200">
                New
              </span>
            ) : null}
            <StatusBadge status={job.status} />
          </div>
          <p className="text-xs text-slate-500">
            Requested{" "}
            <span className="font-medium text-slate-700">
              {formatUnixIst(job.created_at)}
            </span>
            {job.completed_at ? (
              <>
                {" "}
                · Completed{" "}
                <span className="font-medium text-slate-700">
                  {formatUnixIst(job.completed_at)}
                </span>
              </>
            ) : null}
          </p>
          {busy && (
            <p className="text-[11px] font-medium text-slate-500">
              Your report is getting processed. It can take upto 2-5 minutes.
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {downloadable ? (
            <button
              type="button"
              onClick={() => onDownload(job)}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              Download
            </button>
          ) : (
            <span className="text-xs text-slate-400">
              {busy ? "Not ready yet" : "—"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VendorReports() {
  const dispatch = useDispatch();
  const {
    jobs,
    listLoading,
    listError,
    requestLoading,
    requestError,
  } = useSelector((state) => state.vendorReports);

  const [activeTabKey, setActiveTabKey] = useState("orders");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const lastDownloadNavAtRef = useRef(0);

  const activeTab =
    REPORT_TABS.find((t) => t.key === activeTabKey) ?? REPORT_TABS[0];

  useEffect(() => {
    dispatch(setActivePage("Reports"));
  }, [dispatch]);

  const refresh = useCallback(() => {
    dispatch(fetchVendorReports({ jobType: activeTab.reportType }));
  }, [dispatch, activeTab.reportType]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const shouldPollList = isReportInProgressStatus(jobs[0]?.status);

  useEffect(() => {
    if (!shouldPollList) return undefined;
    const id = setInterval(refresh, REPORT_POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [shouldPollList, refresh]);

  useEffect(() => {
    if (requestError) toast.error(String(requestError));
  }, [requestError]);

  const handleTabClick = useCallback((tab) => {
    if (!tab.enabled) {
      toast.message("Coming soon", {
        description: `${tab.label} reports will be available later.`,
      });
      return;
    }
    setActiveTabKey(tab.key);
  }, []);

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error("Choose both start and end dates (IST).");
      return;
    }
    const start_ts = istStartOfDayUnix(startDate);
    const end_ts = istEndOfDayUnix(endDate);
    if (start_ts >= end_ts) {
      toast.error("End date must be after start date.");
      return;
    }
    if (!activeTab.enabled) {
      toast.error("This report type is not available yet.");
      return;
    }
    try {
      await dispatch(
        requestOrderReport({
          start_ts,
          end_ts,
          report_type: activeTab.reportType,
        })
      ).unwrap();
      toast.success("Report queued. It will appear below when ready.");
      setStartDate("");
      setEndDate("");
      dispatch(fetchVendorReports({ jobType: activeTab.reportType }));
    } catch {
      /* toast via effect */
    }
  };

  const handleDownload = useCallback((job) => {
    const key = job.response?.s3_key;
    if (!key) {
      toast.error("No file key for this report yet.");
      return;
    }
    const url = buildVendorReportDownloadPageUrl(job.id);
    if (!url) {
      toast.error("Not signed in. Sign in again to download.");
      return;
    }
    const now = Date.now();
    if (now - lastDownloadNavAtRef.current < DOWNLOAD_NAV_DEBOUNCE_MS) {
      return;
    }
    lastDownloadNavAtRef.current = now;
    window.location.assign(url);
  }, []);


  return (
    <div className="min-h-screen p-4 animate-slide-in-left">
      <div className="max-w-7xl space-y-8">
        {listError && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          >
            {String(listError)}
          </div>
        )}

        <header>
          <div className="flex flex-row items-center justify-start gap-2">
            <BetaBadge />
            <p className="mt-1 text-sm text-slate-600">
              Generate and download reports for your business here.
            </p>
          </div>
        </header>

        <section className="overflow-hidden">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Request new report
            </h2>
          </div>

          <div className="rounded-3xl bg-gradient-to-r from-[#5f22d9]/10 to-blue-100 shadow-sm shadow-blue-100/50 px-5 pb-6 pt-2">
            <form onSubmit={handleSubmitRequest} className="space-y-5 pt-4">
              <div className="space-y-2">
                <span className={FIELD_LABEL_CLASS}>Report type</span>
                <div
                  className="flex flex-wrap gap-1 rounded-xl p-1"
                  role="tablist"
                  aria-label="Report category"
                >
                  {REPORT_TABS.map((tab) => {
                    const selected = tab.key === activeTabKey;
                    const disabled = !tab.enabled;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        disabled={disabled}
                        title={
                          disabled
                            ? `${tab.label} — coming soon`
                            : `Report: ${tab.label}`
                        }
                        onClick={() => handleTabClick(tab)}
                        className={reportTabButtonClass({ selected, disabled })}
                      >
                        <span className={disabled ? "opacity-90" : undefined}>
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className={FIELD_LABEL_CLASS}>Start date (IST)</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={DATE_INPUT_CLASS}
                  />
                </label>
                <label className="block space-y-2">
                  <span className={FIELD_LABEL_CLASS}>End date (IST)</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={DATE_INPUT_CLASS}
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={requestLoading || !activeTab.enabled}
                  className="inline-flex items-center justify-center rounded-xl bg-[#5f22d9] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#5f22d9]/25 transition hover:bg-[#4c1bb0] disabled:opacity-60"
                >
                  {requestLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Queueing…
                    </span>
                  ) : (
                    "Generate Report"
                  )}
                </button>
                <span className="text-xs text-slate-400">
                  Range is interpreted as start–end of each day in India time.
                </span>
              </div>
            </form>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-lg font-semibold text-slate-900">
                Previous reports
              </h2>
              <span className="text-xs text-slate-500">{jobs.length} total</span>
            </div>
            <button
              type="button"
              onClick={refresh}
              disabled={listLoading}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-[#5f22d9]/30 hover:bg-slate-50 disabled:opacity-60"
            >
              <ArrowPathIcon
                className={`h-4 w-4 ${listLoading ? "animate-spin" : ""}`}
              />
              Refresh list
            </button>
          </div>

          <div className="space-y-3">
            {listLoading && jobs.length === 0 && (
              <div className="flex items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#5f22d9]/20 border-t-[#5f22d9]" />
                <span className="text-sm text-slate-600">Loading reports…</span>
              </div>
            )}

            {!listLoading && jobs.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 py-14 text-center text-sm text-slate-500">
                No reports yet. Request one above.
              </div>
            )}

            {jobs.map((job) => (
              <ReportJobRow
                key={job.id}
                job={job}
                onDownload={handleDownload}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
