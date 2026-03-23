"use client";

import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { fetchVendorDetails } from "../../redux/slices/vendorSlice";
import { preloadSound, initializeAudio } from "../../utils/notificationSound";
import Header from "./Header";
import Main from "./Main";
import { BagsProvider } from "../../contexts/BagsContext";
import NotificationPermissionPrompt from "../NotificationPermissionPrompt";
import NotificationSoundHandler from "../NotificationSoundHandler";
import TermsAcceptanceModal from "../modals/TermsAcceptanceModal";

export const BusinessLayout = ({ children }) => {
  useProtectedRoute(["vendor"]);
  const dispatch = useDispatch();
  const vendorData = useSelector((state) => state.vendor.vendorData);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const pathname = usePathname();

  // Initialize last_terms_popup in localStorage (set to 2 days ago for first-time show)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lastPopup = localStorage.getItem("last_terms_popup");
      if (!lastPopup) {
        const twoDaysAgo = Math.floor(Date.now() / 1000) - 2 * 24 * 60 * 60;
        localStorage.setItem("last_terms_popup", twoDaysAgo.toString());
      }
    }
  }, []);

  // Fetch vendor details if not loaded
  useEffect(() => {
    if (!vendorData) {
      dispatch(fetchVendorDetails());
    }
  }, [dispatch, vendorData]);

  // Check if terms modal should be shown (works on all /business routes)
  useEffect(() => {
    if (!vendorData) return;

    const isMouEmpty = Object.keys(vendorData.mou || {}).length === 0;

    if (isMouEmpty) {
      const lastPopup = localStorage.getItem("last_terms_popup");
      const currentTime = Math.floor(Date.now() / 1000);

      if (lastPopup) {
        const lastPopupTime = parseInt(lastPopup, 10);
        const hoursSinceLastPopup = (currentTime - lastPopupTime) / 3600;

        // Show popup if 6 hours or more have passed
        if (hoursSinceLastPopup >= 6) {
          setShowTermsModal(true);
          localStorage.setItem("last_terms_popup", currentTime.toString());
        }
      } else {
        setShowTermsModal(true);
        localStorage.setItem("last_terms_popup", currentTime.toString());
      }
    } else {
      setShowTermsModal(false);
    }
  }, [vendorData, pathname]);

  // Initialize audio
  useEffect(() => {
    preloadSound("order");
    const unlockAudio = () => {
      initializeAudio();
    };
    document.addEventListener("click", unlockAudio, { once: true });
    document.addEventListener("touchstart", unlockAudio, { once: true });
    return () => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  const handleCloseTermsModal = () => {
    setShowTermsModal(false);
    localStorage.setItem(
      "last_terms_popup",
      Math.floor(Date.now() / 1000).toString()
    );
  };

  return (
    <BagsProvider>
      <Header />
      <Main>{children}</Main>
      <NotificationPermissionPrompt />
      <NotificationSoundHandler />
      {showTermsModal && (
        <TermsAcceptanceModal
          isModal={true}
          onClose={handleCloseTermsModal}
        />
      )}
    </BagsProvider>
  );
};

export default BusinessLayout;

