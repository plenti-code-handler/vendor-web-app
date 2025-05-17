"use client";

import { useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import axiosClient from "../../../../AxiosClient";
import { toast } from "sonner";

export default function OnlineOfflineToggle() {
  const [isOnline, setIsOnline] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleStatus = async () => {
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

      setIsOnline((prev) => !prev);

      toast.success(`Status updated to ${!isOnline ? "online" : "offline"}`);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    } finally {
      setTimeout(() => {
        setIsAnimating(false);
      }, 600);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg pr-3">
      <div
        onClick={toggleStatus}
        className={`relative flex items-center w-36 h-12 px-2 rounded-full cursor-pointer shadow-md transition-all duration-500 ease-in-out ${
          isOnline ? "bg-green-500" : "bg-yellow-500"
        }`}
      >
        <div
          className={`absolute w-8 h-8 bg-white rounded-full shadow-lg transition-all duration-500 ease-in-out ${
            isOnline ? "left-24" : "left-4"
          } ${isAnimating ? "scale-90" : "scale-100"}`}
        >
          <div className="flex items-center justify-center w-full h-full">
            {isOnline ? (
              <Wifi size={20} className="text-green-500" />
            ) : (
              <WifiOff size={20} className="text-yellow-500" />
            )}
          </div>
        </div>

        <div
          className={`absolute transition-all duration-500 ease-in-out ${
            isOnline ? "left-4 opacity-100" : "left-4 opacity-0"
          } text-white font-medium`}
        >
          ONLINE
        </div>

        <div
          className={`absolute transition-all duration-500 ease-in-out ${
            !isOnline ? "left-16 opacity-100" : "left-16 opacity-0"
          } text-white font-medium`}
        >
          OFFLINE
        </div>
      </div>
    </div>
  );
}
