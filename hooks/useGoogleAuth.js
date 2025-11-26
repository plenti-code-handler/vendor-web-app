import { useState } from 'react';
import { toast } from 'sonner';
import axiosClient from '../AxiosClient';

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async (credentialResponse, isRegistration = false) => {
    try {
      setLoading(true);

      const response = await axiosClient.post(
        '/v1/vendor/me/login/google',
        null,
        {
          params: { token: credentialResponse.credential }
        }
      );

      if (response.status === 200) {
        const { access_token, vendor } = response.data;
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(vendor));
        
        // OnboardLayout will handle routing based on vendor state
        const message = isRegistration ? "Account created successfully!" : "Google sign-in successful";
        toast.success(message);
        
        // Trigger a page reload to let OnboardLayout handle routing
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Google auth error:", error);
      const message = isRegistration ? "Google sign-up failed" : "Google sign-in failed";
      toast.error(error.response?.data?.detail || `${message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (isRegistration = false) => {
    const message = isRegistration ? "Google sign-up" : "Google sign-in";
    toast.error(`${message} was cancelled or failed`);
  };

  return {
    loading,
    handleGoogleAuth,
    handleGoogleError
  };
};