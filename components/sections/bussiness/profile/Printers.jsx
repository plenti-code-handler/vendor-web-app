"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ComputerDesktopIcon,
  PrinterIcon,
  SignalIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import {
  PRINT_CONNECT_DOWNLOAD_URL,
  createPrintPairingCode,
  formatPairingCountdown,
  getPairingSecondsLeft,
  listPrintDevices,
  revokePrintDevice,
} from "../../../../utility/printApi";
import { formatUnixIst } from "../../../../utility/istUnix";

const FIELD_LABEL_CLASS =
  "text-xs font-medium uppercase tracking-wide text-slate-500";

function DeviceStatusBadge({ device }) {
  if (!device.is_active) {
    return (
      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 ring-1 ring-inset ring-slate-200">
        Disconnected
      </span>
    );
  }

  if (device.online) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-600/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700 ring-1 ring-inset ring-green-600/20">
        <SignalIcon className="h-3 w-3" />
        Online
      </span>
    );
  }

  return (
    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 ring-1 ring-inset ring-amber-200">
      Offline
    </span>
  );
}

function DeviceCard({ device, onRevoke, revoking }) {
  const canRevoke = device.is_active;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <ComputerDesktopIcon className="h-5 w-5 text-[#5f22d9]" />
            <span className="text-base font-semibold text-slate-900">
              {device.device_name}
            </span>
            <DeviceStatusBadge device={device} />
          </div>
          <p className="text-xs text-slate-500">
            {device.platform}
            {device.app_version ? ` · v${device.app_version}` : ""}
          </p>
          <p className="text-xs text-slate-400">
            Last seen{" "}
            {device.last_seen_at ? formatUnixIst(device.last_seen_at) : "never"}
          </p>
          {device.auto_print_enabled === false ? (
            <p className="text-xs text-amber-700">Auto-print is turned off on this computer</p>
          ) : null}
        </div>

        {canRevoke ? (
          <button
            type="button"
            disabled={revoking}
            onClick={() => onRevoke(device)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {revoking ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-300 border-t-red-700" />
            ) : (
              <TrashIcon className="h-4 w-4" />
            )}
            Remove
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function Printers() {
  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [devicesError, setDevicesError] = useState(null);
  const [revokingId, setRevokingId] = useState(null);

  const [pairing, setPairing] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [generatingCode, setGeneratingCode] = useState(false);

  const loadDevices = useCallback(async (silent = false) => {
    if (!silent) {
      setLoadingDevices(true);
    }
    setDevicesError(null);
    try {
      const data = await listPrintDevices();
      setDevices(Array.isArray(data) ? data : []);
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.message ||
        "Could not load printers";
      setDevicesError(typeof message === "string" ? message : "Could not load printers");
    } finally {
      if (!silent) {
        setLoadingDevices(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadDevices();
    const interval = setInterval(() => void loadDevices(true), 30_000);
    return () => clearInterval(interval);
  }, [loadDevices]);

  useEffect(() => {
    if (!pairing?.expires_at) {
      setSecondsLeft(0);
      return;
    }

    const tick = () => {
      setSecondsLeft(getPairingSecondsLeft(pairing.expires_at));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [pairing?.expires_at]);

  async function handleGenerateCode() {
    setGeneratingCode(true);
    try {
      const data = await createPrintPairingCode();
      setPairing(data);
      setSecondsLeft(getPairingSecondsLeft(data.expires_at));
      toast.success("Pairing code ready — enter it in Print Connect");
    } catch (error) {
      const message =
        error.response?.data?.detail || error.message || "Could not generate code";
      toast.error(typeof message === "string" ? message : "Could not generate code");
    } finally {
      setGeneratingCode(false);
    }
  }

  async function handleRevoke(device) {
    const confirmed = window.confirm(
      `Remove "${device.device_name}"? It will stop receiving orders until paired again.`,
    );
    if (!confirmed) return;

    setRevokingId(device.id);
    try {
      await revokePrintDevice(device.id);
      toast.success("Computer removed");
      await loadDevices(true);
    } catch (error) {
      const message =
        error.response?.data?.detail || error.message || "Could not remove device";
      toast.error(typeof message === "string" ? message : "Could not remove device");
    } finally {
      setRevokingId(null);
    }
  }

  const activeDevices = devices.filter((device) => device.is_active);
  const revokedDevices = devices.filter((device) => !device.is_active);
  const codeExpired = pairing && secondsLeft <= 0;

  return (
    <div className="space-y-6 animate-slide-in-left">
      <section className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-[#f8f5ff] to-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PrinterIcon className="h-6 w-6 text-[#5f22d9]" />
              <h2 className="text-md font-semibold text-slate-900">Print Connect</h2>
            </div>
            <p className="max-w-xl text-xs text-slate-600">
              Install Plenti Print Connect on your counter PC.
            </p>
          </div>
          <a
            href={PRINT_CONNECT_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5f22d9] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#4c1bb8]"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Download for Windows
          </a>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className={FIELD_LABEL_CLASS}>Pair a computer</p>
            <p className="text-xs font-semibold text-slate-900">Generate pairing code</p>
            <p className="text-xs text-slate-600">
              Open Print Connect on the counter PC and enter this code.
            </p>
          </div>
          <button
            type="button"
            disabled={generatingCode}
            onClick={() => void handleGenerateCode()}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#5f22d9]/20 bg-[#f8f5ff] px-4 py-2.5 text-xs font-semibold text-[#5f22d9] transition hover:bg-[#efe8ff] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {generatingCode ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#5f22d9]/30 border-t-[#5f22d9]" />
            ) : (
              <ArrowPathIcon className="h-4 w-4" />
            )}
            {pairing && !codeExpired ? "New code" : "Generate code"}
          </button>
        </div>

        {pairing ? (
          <div
            className={`mt-5 rounded-2xl border p-5 text-center ${
              codeExpired
                ? "border-amber-200 bg-amber-50"
                : "border-[#5f22d9]/20 bg-[#faf8ff]"
            }`}
          >
            {codeExpired ? (
              <>
                <p className="text-sm font-medium text-amber-800">Code expired</p>
                <p className="mt-1 text-xs text-amber-700">
                  Generate a new code and enter it in Print Connect.
                </p>
              </>
            ) : (
              <>
                <p className={FIELD_LABEL_CLASS}>Enter in Print Connect</p>
                <p className="mt-2 font-mono text-2xl font-bold tracking-[0.35em] text-[#5f22d9]">
                  {pairing.code}
                </p>
                <p className="mt-3 text-xs text-slate-600">
                  Expires in{" "}
                  <span className="font-semibold tabular-nums text-slate-900">
                    {formatPairingCountdown(secondsLeft)}
                  </span>
                </p>
              </>
            )}
          </div>
        ) : null}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className={FIELD_LABEL_CLASS}>Connected computers</p>
            <h3 className="text-sm font-semibold text-slate-900">Your devices</h3>
          </div>
          <button
            type="button"
            onClick={() => void loadDevices()}
            disabled={loadingDevices}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loadingDevices ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {devicesError ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {devicesError}
          </p>
        ) : null}

        {loadingDevices && devices.length === 0 ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#5f22d9]/30 border-t-[#5f22d9]" />
          </div>
        ) : activeDevices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
            <p className="text-sm font-medium text-slate-700">No computers connected yet</p>
            <p className="mt-1 text-xs text-slate-500">
              Download Print Connect, generate a code above, and pair your counter PC.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {activeDevices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                revoking={revokingId === device.id}
                onRevoke={handleRevoke}
              />
            ))}
          </div>
        )}

        {revokedDevices.length > 0 ? (
          <div className="pt-2">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              Previously removed
            </p>
            <div className="grid gap-2 opacity-70">
              {revokedDevices.map((device) => (
                <DeviceCard key={device.id} device={device} onRevoke={() => {}} revoking={false} />
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
