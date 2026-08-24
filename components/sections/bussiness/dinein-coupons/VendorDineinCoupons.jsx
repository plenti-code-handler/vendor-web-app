"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "@headlessui/react";
import { useLoadScript } from "@react-google-maps/api";
import {
  ArrowPathIcon,
  CheckBadgeIcon,
  GiftIcon,
  MapPinIcon,
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
import { processPlaceForVendor } from "../../../../utility/googlePlacesUtils";
import BetaBadge from "../../../common/BetaBadge";
import StatusResultModal from "../../../modals/StatusResultModal";
import VerifyDineinCouponModal from "../../../modals/VerifyDineinCouponModal";
import CouponCard from "./CouponCard";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_LIBRARIES = ["places"];

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
  const [service, setService] = useState("");
  const [serviceType, setServiceType] = useState("INTERNAL");
  const [site, setSite] = useState("");
  const [addressUrl, setAddressUrl] = useState("");
  const [placeSearch, setPlaceSearch] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const autoCompleteRef = useRef(null);
  const autocompleteInstanceRef = useRef(null);
  const isExternal = serviceType === "EXTERNAL";

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });
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

  useEffect(() => {
    if (loadError) {
      toast.error("Failed to load Google Maps search");
    }
  }, [loadError]);

  useEffect(() => {
    if (!isExternal) {
      setSite("");
      setAddressUrl("");
      setPlaceSearch("");
      setMapUrl("");
      if (autocompleteInstanceRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteInstanceRef.current);
        autocompleteInstanceRef.current = null;
      }
    }
  }, [isExternal]);

  useEffect(() => {
    if (!isLoaded || !isExternal || !autoCompleteRef.current) return;

    try {
      if (autocompleteInstanceRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteInstanceRef.current);
      }

      autocompleteInstanceRef.current = new window.google.maps.places.Autocomplete(
        autoCompleteRef.current,
        {
          types: ["geocode", "establishment"],
          componentRestrictions: { country: "IN" },
          fields: [
            "formatted_address",
            "geometry",
            "place_id",
            "name",
            "url",
            "website",
            "types",
            "address_components",
          ],
        }
      );

      autocompleteInstanceRef.current.addListener("place_changed", () => {
        const place = autocompleteInstanceRef.current.getPlace();
        const processedPlace = processPlaceForVendor(place, GOOGLE_MAPS_API_KEY);
        if (!processedPlace) {
          toast.error("Please select a valid place from the suggestions");
          return;
        }

        setSite(place.name || processedPlace.formattedAddress);
        setAddressUrl(processedPlace.googleMapsUrl);
        setPlaceSearch(place.name || processedPlace.formattedAddress);
        setMapUrl(processedPlace.mapEmbedUrl);
        toast.success("Location selected");
      });
    } catch (error) {
      console.error("Error initializing autocomplete:", error);
      toast.error("Failed to initialize location search");
    }

    return () => {
      if (autocompleteInstanceRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteInstanceRef.current);
        autocompleteInstanceRef.current = null;
      }
    };
  }, [isLoaded, isExternal]);

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
    if (isExternal && (!site.trim() || !addressUrl.trim())) {
      toast.error("Search and select a partner location from Google Maps.");
      return;
    }

    try {
      await dispatch(
        createDineinCoupon({
          discount_value,
          min_order_value,
          max_discount,
          validity_period,
          service: service.trim() || undefined,
          service_type: serviceType,
          ...(isExternal
            ? { site: site.trim(), address_url: addressUrl.trim() }
            : {}),
        })
      ).unwrap();
      toast.success(
        isExternal
          ? "Partner coupon created. It will go live after Plenti approval."
          : "Dine-in coupon created. Activate it to attach to new listings."
      );
      setDiscountValue("");
      setMinOrderValue("0");
      setMaxDiscount("");
      setValidityPeriod("30");
      setService("");
      setServiceType("INTERNAL");
      setSite("");
      setAddressUrl("");
      setPlaceSearch("");
      setMapUrl("");
      dispatch(clearCreateError());
      refresh();
    } catch {
      /* toast via effect */
    }
  };

  const handleToggle = async (coupon) => {
    if (!coupon.is_active && coupon.approved !== true) {
      toast.error(
        coupon.approved === false
          ? "This coupon was rejected and cannot go live."
          : "This coupon is pending Plenti approval."
      );
      return;
    }

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
      <style jsx global>{`
        .pac-container {
          z-index: 10000;
        }
      `}</style>
      <div className="space-y-8">
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

        <section>
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
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className={FIELD_LABEL_CLASS}>Service</span>
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    placeholder="Buffet, spa, gym session"
                    className={INPUT_CLASS}
                  />
                </label>
                <label className="block space-y-2">
                  <span className={FIELD_LABEL_CLASS}>Service type</span>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className={INPUT_CLASS}
                  >
                    <option value="INTERNAL">Your store</option>
                    <option value="EXTERNAL">Another business</option>
                  </select>
                </label>
              </div>
              {isExternal ? (
                <div className="space-y-3">
                  <label className="block space-y-2">
                    <span className={FIELD_LABEL_CLASS}>Partner location</span>
                    <div className="relative">
                      <input
                        type="text"
                        ref={autoCompleteRef}
                        value={placeSearch}
                        onChange={(e) => setPlaceSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.preventDefault();
                        }}
                        placeholder={
                          isLoaded
                            ? "Search a place on Google Maps"
                            : "Loading location search..."
                        }
                        className={INPUT_CLASS}
                        disabled={!isLoaded}
                        autoComplete="off"
                      />
                      {!isLoaded ? (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#5f22d9]" />
                        </div>
                      ) : null}
                    </div>
                    <p className="text-xs text-slate-500">
                      Pick the partner from suggestions. Site name and maps link are filled automatically.
                    </p>
                  </label>
                  {site && addressUrl ? (
                    <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-700">
                      <p className="font-medium">{site}</p>
                      <a
                        href={addressUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#5f22d9] hover:underline"
                      >
                        <MapPinIcon className="h-3.5 w-3.5" />
                        View on Google Maps
                      </a>
                    </div>
                  ) : null}
                  {mapUrl ? (
                    <iframe
                      src={mapUrl}
                      title="Selected partner location"
                      width="450"
                      height="220"
                      className="w-full rounded-xl"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : null}
                  <p className="text-xs text-amber-700">
                    External coupons need Plenti approval before you can turn them on.
                  </p>
                </div>
              ) : null}
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
