"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "@headlessui/react";
import {
  ArrowPathIcon,
  CheckBadgeIcon,
  GiftIcon,
  SparklesIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { setActivePage } from "../../../../redux/slices/headerSlice";
import {
  clearCreateError,
  clearVerifyResult,
  createDineinCoupon,
  deactivateAllDineinCoupons,
  fetchDineinCoupons,
  toggleDineinCoupon,
  verifyDineinCoupon,
} from "../../../../redux/slices/dineinCouponSlice";
import { formatUnixIst } from "../../../../utility/istUnix";
import BetaBadge from "../../../common/BetaBadge";
import StatusResultModal from "../../../modals/StatusResultModal";
import VerifyDineinCouponModal from "../../../modals/VerifyDineinCouponModal";

const FIELD_LABEL_CLASS =
  "text-xs font-medium uppercase tracking-wide text-slate-500";
const INPUT_CLASS =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-[#5f22d9]/20 transition focus:border-[#5f22d9] focus:ring-2";

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <p className={FIELD_LABEL_CLASS}>{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function CouponCard({ coupon, onToggle, toggling }) {
  const active = coupon.is_active;

  return (
    <div
      className={`rounded-2xl border bg-white p-4 shadow-sm transition animate-slide-in-right ${
        active
          ? "border-green-600/40 ring-1 ring-green-600/20"
          : "border-slate-200/80 hover:border-slate-300"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-semibold text-slate-900">
              {coupon.discount_value}% off
            </span>
            {active ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-600/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-600 ring-1 ring-inset ring-green-600/20">
                <SparklesIcon className="h-3 w-3" />
                ACTIVE
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 ring-1 ring-inset ring-slate-200">
                Inactive
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Min bill ₹{coupon.min_order_value}
            {coupon.max_discount != null ? ` · Max discount ₹${coupon.max_discount}` : ""}
            {" · "}
            Valid {coupon.validity_period} days after issue
          </p>
          <p className="text-xs text-slate-400">
            Created {formatUnixIst(coupon.created_at)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="text-xs font-medium text-slate-500">
            {active ? "Active" : "Inactive"}
          </span>
          <Switch
            checked={active}
            disabled={toggling}
            onChange={() => onToggle(coupon)}
            className="group relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-slate-200 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5f22d9]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-green-600"
          >
            <span className="sr-only">Toggle coupon active state</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                toggling ? "opacity-60" : ""
              } ${active ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </Switch>
          {toggling ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-green-600" />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function VendorDineinCoupons() {
  const dispatch = useDispatch();
  const {
    coupons,
    issuedCount,
    usedCount,
    listLoading,
    listError,
    createLoading,
    createError,
    toggleLoadingId,
    toggleError,
    deactivateAllLoading,
    deactivateAllError,
    verifyLoading,
  } = useSelector((state) => state.dineinCoupons);

  const [discountValue, setDiscountValue] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("0");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [validityPeriod, setValidityPeriod] = useState("30");
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [resultModal, setResultModal] = useState({
    open: false,
    variant: "success",
    title: "",
    message: "",
  });

  const showResultModal = useCallback(({ variant, title = "", message }) => {
    setResultModal({ open: true, variant, title, message });
  }, []);

  const closeResultModal = useCallback(() => {
    setResultModal((current) => ({ ...current, open: false }));
    dispatch(clearVerifyResult());
  }, [dispatch]);

  const refresh = useCallback(() => {
    dispatch(fetchDineinCoupons({ skip: 0, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(setActivePage("Dine-In Coupons"));
    refresh();
  }, [dispatch, refresh]);

  useEffect(() => {
    if (listError) toast.error(String(listError));
  }, [listError]);

  useEffect(() => {
    if (createError) toast.error(String(createError));
  }, [createError]);

  useEffect(() => {
    if (toggleError) toast.error(String(toggleError));
  }, [toggleError]);

  useEffect(() => {
    if (deactivateAllError) toast.error(String(deactivateAllError));
  }, [deactivateAllError]);

  const anyCouponActive = coupons.some((coupon) => coupon.is_active);

  const handleCreate = async (e) => {
    e.preventDefault();
    const discount_value = Number(discountValue);
    const min_order_value = Number(minOrderValue) || 0;
    const max_discount = maxDiscount === "" ? null : Number(maxDiscount);
    const validity_period = Number(validityPeriod);

    if (!discount_value || discount_value <= 0 || discount_value > 100) {
      toast.error("Discount must be between 1 and 100%.");
      return;
    }
    if (!validity_period || validity_period <= 0) {
      toast.error("Validity period must be at least 1 day.");
      return;
    }

    try {
      await dispatch(
        createDineinCoupon({
          discount_value,
          min_order_value,
          max_discount,
          validity_period,
        })
      ).unwrap();
      toast.success("Dine-in coupon created. Activate it to attach to new listings.");
      setDiscountValue("");
      setMinOrderValue("0");
      setMaxDiscount("");
      setValidityPeriod("30");
      dispatch(clearCreateError());
      refresh();
    } catch {
      /* toast via effect */
    }
  };

  const handleToggle = async (coupon) => {
    try {
      await dispatch(
        toggleDineinCoupon({
          couponId: coupon.id,
          is_active: !coupon.is_active,
        })
      ).unwrap();
      toast.success(
        coupon.is_active
          ? "Coupon deactivated."
          : "Coupon activated — new listings will include this offer."
      );
      refresh();
    } catch {
      /* toast via effect */
    }
  };

  const handleDeactivateAll = async (checked) => {
    if (checked) return;
    try {
      await dispatch(deactivateAllDineinCoupons()).unwrap();
      toast.success("All dine-in coupons turned off.");
      refresh();
    } catch {
      /* toast via effect */
    }
  };

  const handleVerify = async ({ code, bill_amount }) => {
    if (!/^\d{6}$/.test(code || "")) {
      showResultModal({
        variant: "error",
        title: "Invalid code",
        message: "Enter the full 6-digit coupon code.",
      });
      return;
    }

    if (!bill_amount || bill_amount <= 0) {
      showResultModal({
        variant: "error",
        title: "Invalid bill amount",
        message: "Enter a valid bill amount before verifying the coupon.",
      });
      return;
    }

    try {
      const result = await dispatch(
        verifyDineinCoupon({ code, bill_amount })
      ).unwrap();
      setVerifyModalOpen(false);
      showResultModal({
        variant: "success",
        title: "Coupon verified",
        message: `Apply ₹${result.discount_amount} discount on the customer's bill.`,
      });
      refresh();
    } catch (error) {
      showResultModal({
        variant: "error",
        title: "Verification failed",
        message: String(error || "Could not verify this coupon. Please try again."),
      });
    }
  };

  return (
    <div className="min-h-screen p-4 animate-slide-in-left">
      <div className="max-w-7xl space-y-8">
        <header>
          <div className="flex flex-row items-center justify-start gap-2">
            <BetaBadge />
            <p className="mt-1 text-sm text-slate-600">
              Reward walk-in customers with dine-in coupons on your Plenti listings.
            </p>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Templates" value={coupons.length} accent="text-slate-900" />
          <StatCard label="Issued to customers" value={issuedCount} accent="text-[#5f22d9]" />
          <StatCard label="Redeemed" value={usedCount} accent="text-emerald-700" />
        </div>

        {anyCouponActive ? (
          <div className="flex flex-col gap-3 rounded-2xl border border-green-600/30 bg-green-50/50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                Dine-in coupons on listings
              </p>
              <p className="text-xs text-slate-600">
                A coupon is active and will attach to new bag listings. Turn off to stop.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-xs font-medium text-green-700">On</span>
              <Switch
                checked={anyCouponActive}
                disabled={deactivateAllLoading}
                onChange={handleDeactivateAll}
                className="group relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-slate-200 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-green-600"
              >
                <span className="sr-only">Turn off all dine-in coupons</span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    deactivateAllLoading ? "opacity-60" : ""
                  } ${anyCouponActive ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </Switch>
              {deactivateAllLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-green-600" />
              ) : null}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setVerifyModalOpen(true)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-700 sm:w-auto"
        >
          <CheckBadgeIcon className="h-5 w-5" />
          Verify dine-in coupon
        </button>

        <VerifyDineinCouponModal
          open={verifyModalOpen}
          onClose={() => setVerifyModalOpen(false)}
          onVerify={handleVerify}
          loading={verifyLoading}
        />

        <StatusResultModal
          open={resultModal.open}
          onClose={closeResultModal}
          variant={resultModal.variant}
          title={resultModal.title}
          message={resultModal.message}
        />

        <section className="overflow-hidden">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">Create Dine-in Coupon</h2>
          </div>
          <div className="rounded-3xl bg-gradient-to-r from-[#5f22d9]/10 to-blue-100 px-5 pb-6 pt-2 shadow-sm shadow-blue-100/50">
            <form onSubmit={handleCreate} className="space-y-5 pt-4">
              <p className="text-sm text-slate-600">
                Only one coupon can be active at a time. Active coupons auto-attach to new bag listings.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className="block space-y-2">
                  <span className={FIELD_LABEL_CLASS}>Discount (%)</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="15"
                    className={INPUT_CLASS}
                    required
                  />
                </label>
                <label className="block space-y-2">
                  <span className={FIELD_LABEL_CLASS}>Min bill (₹)</span>
                  <input
                    type="number"
                    min="0"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </label>
                <label className="block space-y-2">
                  <span className={FIELD_LABEL_CLASS}>Max discount (₹)</span>
                  <input
                    type="number"
                    min="0"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    placeholder="Optional"
                    className={INPUT_CLASS}
                  />
                </label>
                <label className="block space-y-2">
                  <span className={FIELD_LABEL_CLASS}>Valid for (days)</span>
                  <input
                    type="number"
                    min="1"
                    value={validityPeriod}
                    onChange={(e) => setValidityPeriod(e.target.value)}
                    className={INPUT_CLASS}
                    required
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={createLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5f22d9] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#5f22d9]/25 transition hover:bg-[#4c1bb0] disabled:opacity-60"
              >
                {createLoading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <GiftIcon className="h-4 w-4" />
                )}
                Create dine-in coupon
              </button>
            </form>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-lg font-semibold text-slate-900">Your templates</h2>
              <span className="text-xs text-slate-500">{coupons.length} total</span>
            </div>
            <button
              type="button"
              onClick={refresh}
              disabled={listLoading}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-[#5f22d9]/30 hover:bg-slate-50 disabled:opacity-60"
            >
              <ArrowPathIcon className={`h-4 w-4 ${listLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          <div className="space-y-3">
            {listLoading && coupons.length === 0 && (
              <div className="flex items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#5f22d9]/20 border-t-[#5f22d9]" />
                <span className="text-sm text-slate-600">Loading coupons…</span>
              </div>
            )}

            {!listLoading && coupons.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white/80 py-14 text-center">
                <TicketIcon className="h-10 w-10 text-slate-300" />
                <p className="text-sm text-slate-500">
                  No dine-in coupons yet. Create one above to get started.
                </p>
              </div>
            )}

            {coupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                onToggle={handleToggle}
                toggling={toggleLoadingId === coupon.id}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
