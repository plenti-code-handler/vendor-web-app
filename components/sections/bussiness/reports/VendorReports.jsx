"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowPathIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { setActivePage } from "../../../../redux/slices/headerSlice";
import {
  fetchVendorReports,
  requestOrderReport,
  fetchReportDownloadUrl,
  clearDownloadError,
} from "../../../../redux/slices/vendorReportsSlice";
import {
  istStartOfDayUnix,
  istEndOfDayUnix,
  formatUnixIst,
} from "../../../../utility/istUnix";

const REPORT_TYPES = [{ label: "Orders", value: "orders" }];

function StatusBadge({ status }) {
  const s = (status || "").toUpperCase();
  const busy = s === "PENDING" || s === "RUNNING" || s === "QUEUED";

  const styles = {
    PENDING: "bg-amber-50 text-amber-800 ring-amber-200",
    QUEUED: "bg-amber-50 text-amber-800 ring-amber-200",
    RUNNING: "bg-sky-50 text-sky-800 ring-sky-200",
    READY: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    FAILED: "bg-rose-50 text-rose-800 ring-rose-200",
  };
  const base =
    styles[s] || "bg-slate-50 text-slate-700 ring-slate-200";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${base}`}
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

export default function VendorReports() {
  const dispatch = useDispatch();
  const {
    jobs,
    listLoading,
    listError,
    requestLoading,
    requestError,
    downloadLoadingId,
    downloadError,
  } = useSelector((state) => state.vendorReports);

  const [requestOpen, setRequestOpen] = useState(false);
  const [reportType, setReportType] = useState("orders");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(setActivePage("Reports"));
  }, [dispatch]);

  const refresh = useCallback(() => {
    dispatch(fetchVendorReports());
  }, [dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (requestError) toast.error(String(requestError));
  }, [requestError]);

  useEffect(() => {
    if (downloadError) {
      toast.error(String(downloadError));
      dispatch(clearDownloadError());
    }
  }, [downloadError, dispatch]);

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
    if (reportType !== "orders") {
      toast.error("Only Orders reports are available right now.");
      return;
    }
    try {
      await dispatch(requestOrderReport({ start_ts, end_ts })).unwrap();
      toast.success("Report queued. It will appear below when ready.");
      setStartDate("");
      setEndDate("");
      dispatch(fetchVendorReports());
    } catch {
      /* toast via effect */
    }
  };

  const handleDownload = async (job) => {
    const key = job.response?.s3_key;
    if (!key) {
      toast.error("No file key for this report yet.");
      return;
    }
    try {
      const { download_url: url } = await dispatch(
        fetchReportDownloadUrl({ jobId: job.id, s3_key: key })
      ).unwrap();
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      /* toast */
    }
  };

  const canDownload = (job) => {
    const ok = (job.status || "").toUpperCase() === "READY";
    return ok && Boolean(job.response?.s3_key);
  };

  return (
    <div className="min-h-screen p-4 animate-slide-in-left">
      <div className="mx-auto max-w-7xl space-y-8">
        {listError && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          >
            {String(listError)}
          </div>
        )}

        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              Reports
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Export order data for any date range (IST). Downloads use a
              secure signed link.
            </p>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={listLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-[#5f22d9]/30 hover:bg-slate-50 disabled:opacity-60"
          >
            <ArrowPathIcon
              className={`h-4 w-4 ${listLoading ? "animate-spin" : ""}`}
            />
            Refresh list
          </button>
        </header>

        {/* Request new report */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
          <button
            type="button"
            onClick={() => setRequestOpen((o) => !o)}
            className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50/80"
          >
            <div>
              <span className="text-base font-semibold text-slate-900">
                Request new report
              </span>
              <p className="text-sm text-slate-500">
                Choose type and date range - Report will be available in the list below when ready.
              </p>
            </div>
            <ChevronDownIcon
              className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-300 ${
                requestOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
              requestOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="border-t border-slate-100 px-5 pb-6 pt-2">
                <form onSubmit={handleSubmitRequest} className="space-y-5 pt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block space-y-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Report type
                      </span>
                      <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-[#5f22d9]/20 transition focus:border-[#5f22d9] focus:ring-2"
                      >
                        {REPORT_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="hidden sm:block" aria-hidden />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block space-y-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Start date (IST)
                      </span>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-[#5f22d9]/20 transition focus:border-[#5f22d9] focus:ring-2"
                      />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        End date (IST)
                      </span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-[#5f22d9]/20 transition focus:border-[#5f22d9] focus:ring-2"
                      />
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={requestLoading}
                      className="inline-flex items-center justify-center rounded-xl bg-[#5f22d9] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#5f22d9]/25 transition hover:bg-[#4c1bb0] disabled:opacity-60"
                    >
                      {requestLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Queueing…
                        </span>
                      ) : (
                        "Queue report"
                      )}
                    </button>
                    <span className="text-xs text-slate-400">
                      Range is interpreted as start–end of each day in India time.
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Previous reports */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Previous reports
            </h2>
            <span className="text-xs text-slate-500">{jobs.length} total</span>
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

            {jobs.map((job) => {
              const busy =
                ["PENDING", "RUNNING", "QUEUED"].indexOf(
                  (job.status || "").toUpperCase()
                ) >= 0;
              return (
                <div
                  key={job.id}
                  className={`group rounded-2xl border bg-white p-4 shadow-sm transition ${
                    busy
                      ? "border-sky-100 shadow-sky-100/50 ring-1 ring-sky-100/80"
                      : "border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-slate-400">
                          {String(job.job_type || "").replace(/_/g, " ")}
                        </span>
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
                      {job.error_message && (
                        <p className="text-xs text-rose-600">{job.error_message}</p>
                      )}
                      {busy && (
                        <div className="flex items-center gap-2 pt-1">
                          <div className="relative h-1.5 flex-1 max-w-[220px] overflow-hidden rounded-full bg-slate-100">
                            <div className="absolute inset-y-0 -left-1/3 w-1/3 rounded-full bg-gradient-to-r from-[#5f22d9]/40 via-[#39ff14] to-[#5f22d9]/40 animate-vendor-report-shimmer" />
                          </div>
                          <span className="text-[11px] font-medium text-slate-500">
                            Processing…
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {canDownload(job) ? (
                        <button
                          type="button"
                          onClick={() => handleDownload(job)}
                          disabled={downloadLoadingId === job.id}
                          className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100 disabled:opacity-50"
                        >
                          {downloadLoadingId === job.id ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-300 border-t-emerald-700" />
                          ) : (
                            <DocumentArrowDownIcon className="h-4 w-4" />
                          )}
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
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
