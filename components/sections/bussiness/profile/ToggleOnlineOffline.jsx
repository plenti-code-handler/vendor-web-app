"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Wifi, WifiOff } from "lucide-react";
import axiosClient from "../../../../AxiosClient";
import { toast } from "sonner";
import { setVendorOnlineStatus } from "../../../../redux/slices/vendorSlice";

export default function OnlineOfflineToggle() {
  const [isOnline, setIsOnline] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  // New state for subtle activation animation
  const [isOnlineJustActivated, setIsOnlineJustActivated] = useState(false);
  const status = useSelector((state) => state.vendor.vendorData?.is_online);
  const dispatch = useDispatch();

  // Update state when status prop changes
  useEffect(() => {
    setIsOnline(status || false);
  }, [status]);

  // Effect to trigger and reset the subtle animation when becoming online
  useEffect(() => {
    // Only trigger if the status is now true (online)
    if (isOnline) {
      setIsOnlineJustActivated(true);
      // Reset the animation class after 1 second (longer than the CSS transition)
      const timer = setTimeout(() => {
        setIsOnlineJustActivated(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  const toggleStatus = async () => {
    // Prevent multiple clicks while the animation/request is running
    if (isAnimating) return;

    setIsAnimating(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axiosClient.patch(
        "/v1/vendor/me/toggle-online",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newStatus = response.data.status;
      // This update triggers the useEffect above
      setIsOnline(newStatus);
      dispatch(setVendorOnlineStatus(newStatus));

      toast.success(`Status updated to ${newStatus ? "online" : "offline"}`);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    } finally {
      setTimeout(() => {
        setIsAnimating(false);
      }, 600);
    }
  };

  /*
   * REVISED JSX WITH SUBTLE ONLINE ACTIVATION ANIMATION
   */
  return (
    <div className="mr-5 flex items-center justify-center">
      <style jsx global>{`
        /* Define the subtle pulse animation */
        @keyframes subtle-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); /* Tailwind green-500 equivalent */
          }
          70% {
            box-shadow: 0 0 0 20px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }

        /* Apply the pulse effect */
        .online-pulse {
          animation: subtle-pulse 1s ease-out;
        }
      `}</style>
      <div
        onClick={toggleStatus}
        // Minimal track styling: w-24 h-8
        className={` p-5 relative flex items-center w-24 h-8 rounded-full cursor-pointer transition-all duration-300 ease-in-out ${
          isOnline ? "bg-green-500 shadow-md" : "bg-gray-300 dark:bg-gray-700"
        } ${isOnline && isOnlineJustActivated ? 'online-pulse' : ''}
        `}
      >
        {/*
          Status Text - Now positioned absolutely inside the track
          and toggling visibility based on state.
        */}

        {/* ONLINE Text */}
        <span
          className={`absolute text-xs font-semibold left-2 transition-opacity duration-300 ${
            isOnline
              ? "opacity-100 text-white"
              : "opacity-0 text-gray-700 dark:text-gray-200"
          }`}
        >
          ONLINE
        </span>

        {/* OFFLINE Text */}
        <span
          className={`absolute text-xs font-semibold right-2 transition-opacity duration-300 ${
            !isOnline
              ? "opacity-100 text-gray-600 dark:text-gray-200"
              : "opacity-0 text-white"
          }`}
        >
          OFFLINE
        </span>

        {/* Minimal handle styling (w-6 h-6) */}
        <div
          className={`absolute w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ease-in-out flex items-center justify-center ${
            // Position the handle (left-1 for full circle, adjusted from previous L/R)
            isOnline ? "left-[calc(100%-1.875rem)]" : "left-1"
          } ${isAnimating ? "scale-95" : "scale-100"}`}
        >
          {/* Icon */}
          {isOnline ? (
            <Wifi size={16} className="text-green-500" />
          ) : (
            <WifiOff size={16} className="text-gray-500 dark:text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
}