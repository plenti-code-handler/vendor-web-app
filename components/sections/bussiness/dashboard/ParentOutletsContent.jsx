"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import BeatLoader from "react-spinners/BeatLoader";
import {
  MapPinIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

import PrimaryButton from "../../../buttons/PrimaryButton";
import SecondaryButton from "../../../buttons/SecondaryButton";
import {
  fetchParentOutlets,
  selectParentOutlets,
  selectParentOutletsLoading,
  toggleParentOutletOnline,
} from "../../../../redux/slices/parentSlice";
import { clearVendorData } from "../../../../redux/slices/vendorSlice";
import AddOutletModal from "./AddOutletModal";
import CreateOutletModal from "./CreateOutletModal";

const formatInt = (n) =>
  Number(n ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const OutletOnlineToggle = ({
  isOnline,
  onToggle,
  disabled,
  loading,
}) => {
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        disabled={disabled || loading}
        className={`relative w-full h-10 rounded-xl border overflow-hidden transition-colors ${
          isOnline ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {/* Slider + labels share the same inset area for consistent spacing */}
        <div className="absolute inset-1 rounded-lg overflow-hidden">
          <div
            className={`h-full w-1/2 rounded-lg transition-transform duration-200 ${
              isOnline ? "translate-x-full bg-green-500" : "translate-x-0 bg-gray-300"
            }`}
          />
        </div>

        <div className="absolute inset-1 z-10 flex items-center justify-between px-2">
          <span
            className={`text-[10px] xs:text-xs font-semibold transition-colors ${
              isOnline ? "text-gray-700" : "text-white"
            } ${loading ? "opacity-0" : "opacity-100"}`}
          >
            OFFLINE
          </span>
          <span
            className={`text-[10px] xs:text-xs font-semibold transition-colors ${
              isOnline ? "text-white" : "text-gray-700"
            } ${loading ? "opacity-0" : "opacity-100"}`}
          >
            ONLINE
          </span>
        </div>

        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div
              className={`h-4 w-4 animate-spin rounded-full border-2 ${
                isOnline
                  ? "border-green-500 border-t-transparent"
                  : "border-gray-400 border-t-transparent"
              }`}
            />
          </div>
        )}
      </button>
    </div>
  );
};

const ParentOutletTile = ({
  outlet,
  onToggleOnline,
  toggling,
  onOpenOutletDashboard,
}) => {
  const isLoading = toggling === outlet.vendor_id;
  const isInactive = outlet.is_active === false;

  return (
    <div
      className={`border rounded-xl px-5 py-4 flex flex-col transition-shadow duration-200 ${
        isInactive
          ? "border-gray-200 bg-gray-50/80 opacity-75 cursor-not-allowed"
          : "border-gray-200 cursor-pointer hover:border-[#5F22D9] hover:shadow-lg"
      }`}
      role={isInactive ? "group" : "button"}
      aria-disabled={isInactive}
      tabIndex={isInactive ? -1 : 0}
      onClick={() => {
        if (!isInactive) onOpenOutletDashboard(outlet.vendor_id);
      }}
      onKeyDown={(e) => {
        if (isInactive) return;
        if (e.key === "Enter" || e.key === " ") onOpenOutletDashboard(outlet.vendor_id);
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center gap-2 min-w-0">
          <MapPinIcon
            className={`w-5 h-5 shrink-0 ${isInactive ? "text-gray-400" : "text-[#5F22D9]"}`}
          />
          <div className="flex flex-col min-w-0">
            <span
              className={`text-sm font-semibold truncate ${
                isInactive ? "text-gray-500" : "text-black"
              }`}
            >
              {outlet.vendor_name || "No name"}
            </span>
            {isInactive && (
              <span className="text-[10px] font-medium text-gray-800 uppercase tracking-wide">
                COMPLETE ONBOARDING TO ACTIVATE
              </span>
            )}
          </div>
        </div>
        <ArrowRightIcon
          className={`w-4 h-4 shrink-0 ${isInactive ? "text-gray-300" : "text-[#5F22D9]"}`}
        />
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Today listings</span>
          <span className="text-lg font-semibold text-black">
            {formatInt(outlet.today_listings)}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-xs text-gray-500">Today orders</span>
          <span className="text-lg font-semibold text-black">
            {formatInt(outlet.today_orders)}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <OutletOnlineToggle
          isOnline={outlet.is_online}
          disabled={isLoading || isInactive}
          loading={isLoading}
          onToggle={() => onToggleOnline(outlet.vendor_id)}
        />
      </div>
    </div>
  );
};

const ParentOutletsContent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const outlets = useSelector(selectParentOutlets);
  const outletsLoading = useSelector(selectParentOutletsLoading);
  const [togglingId, setTogglingId] = useState(null);
  const [isAddOutletOpen, setIsAddOutletOpen] = useState(false);
  const [isCreateOutletOpen, setIsCreateOutletOpen] = useState(false);

  useEffect(() => {
    if (!outlets && !outletsLoading) {
      dispatch(fetchParentOutlets());
    }
  }, [dispatch, outlets, outletsLoading]);

  const handleToggleOnline = async (childId) => {
    const current = outlets?.find((o) => o.vendor_id === childId);
    const currentIsOnline = current?.is_online;

    try {
      setTogglingId(childId);
      await dispatch(
        toggleParentOutletOnline({ childId, currentIsOnline })
      ).unwrap();
      toast.success("Outlet status updated successfully!");
    } catch (e) {
      toast.error("Failed to update outlet status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleOpenOutletDashboard = (childId) => {
    localStorage.setItem("role", "PARENT");
    localStorage.setItem("target_vendor_id", childId);
    dispatch(clearVendorData());
    router.push("/business");
  };

  return (
    <div className="mt-10">
      <div className="max-w-7xl mx-auto px-0">
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-semibold text-gray-500">Outlets</p>
          <div className="flex items-center gap-2">
            <SecondaryButton
              onClick={() => setIsAddOutletOpen(true)}
              disabled={isAddOutletOpen || isCreateOutletOpen}
              className="px-3 py-2 text-xs rounded-xl whitespace-nowrap"
            >
              Add existing outlet +
            </SecondaryButton>
            <PrimaryButton
              onClick={() => setIsCreateOutletOpen(true)}
              disabled={isCreateOutletOpen || isAddOutletOpen}
              className="px-3 py-2 text-xs rounded-xl whitespace-nowrap"
            >
              Create new outlet
            </PrimaryButton>
          </div>
        </div>

        {outletsLoading && !outlets ? (
          <div className="flex items-center justify-center py-16">
            <BeatLoader color="#5F22D9" size={10} />
          </div>
        ) : outlets?.length ? (
          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {outlets.map((outlet) => (
              <ParentOutletTile
                key={outlet.vendor_id}
                outlet={outlet}
                onToggleOnline={handleToggleOnline}
                toggling={togglingId}
                onOpenOutletDashboard={handleOpenOutletDashboard}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-gray-500">No outlets found.</p>
          </div>
        )}

        <AddOutletModal
          open={isAddOutletOpen}
          onClose={() => setIsAddOutletOpen(false)}
        />
        <CreateOutletModal
          open={isCreateOutletOpen}
          onClose={() => setIsCreateOutletOpen(false)}
        />
      </div>
    </div>
  );
};

export default ParentOutletsContent;

