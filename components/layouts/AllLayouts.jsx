"use client";
import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVendorDetails } from "../../redux/slices/vendorSlice";
import { preloadSound, initializeAudio } from "../../utils/notificationSound";
import AuthMain from "./AuthMain";
import Header from "./Header";
import Main from "./Main";
import { BagsProvider } from "../../contexts/BagsContext";
import NotificationPermissionPrompt from "../NotificationPermissionPrompt";

export const PublicLayout = ({ children }) => {
  useProtectedRoute([]);
  return <AuthMain>{children}</AuthMain>;
};

export const BusinessLayout = ({ children }) => {
  useProtectedRoute(["vendor"]);
  const dispatch = useDispatch();
  const vendorData = useSelector((state) => state.vendor.vendorData);
  
  // Fetch vendor details if not loaded
  useEffect(() => {
    if (!vendorData) {
      dispatch(fetchVendorDetails());
    }
  }, [dispatch, vendorData]);

  // Initialize audio
  useEffect(() => {
    preloadSound('order');
    const unlockAudio = () => {
      console.log('🎵 User interacted - unlocking audio...');
      initializeAudio();
    };
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });
    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  return (
    <BagsProvider>
      <Header />
      <Main>{children}</Main>
      <NotificationPermissionPrompt />
    </BagsProvider>
  );
};

export const LandingLayout = ({ children }) => {
  return (
    <>
      <div>{children}</div>
    </>
  );
};
