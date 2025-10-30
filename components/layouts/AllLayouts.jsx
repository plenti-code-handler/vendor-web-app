"use client";
import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import { useEffect } from "react";
import { preloadSound, initializeAudio } from "../../utils/notificationSound";
import AuthMain from "./AuthMain";
import AdminMain from "./AdminMain";
import Header from "./Header";
import Main from "./Main";
import { BagsProvider } from "../../contexts/BagsContext";
import { AdminProvider } from "../../contexts/AdminContext";
import NotificationPermissionPrompt from "../NotificationPermissionPrompt"; // Add this import

export const PublicLayout = ({ children }) => {
  useProtectedRoute([]);

  return <AuthMain>{children}</AuthMain>;
};

export const BusinessLayout = ({ children }) => {
  useProtectedRoute(["vendor"]);

  // 🔊 Initialize audio for the entire business section
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
      <NotificationPermissionPrompt /> {/* Add this component */}
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
