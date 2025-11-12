import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import axiosClient from '../AxiosClient';
import { fetchVendorDetails } from '../redux/slices/vendorSlice';
import { fetchCatalogue } from '../redux/slices/catalogueSlice';

export const useGoogleAuth = () => {
  const router = useRouter();
  const dispatch = useDispatch();
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
        
        const vendorResult = await dispatch(fetchVendorDetails(access_token)).unwrap();
        if (!vendorResult.latitude && !vendorResult.longitude) {
          router.push("/complete_profile");
          return;
        }
        if (!vendorResult.is_active) {
          router.push("/accountProcessing");
          return;
        }
        dispatch(fetchCatalogue(access_token));
        
        const message = isRegistration ? "Account created successfully!" : "Google sign-in successful";
        toast.success(message);
        
        router.push("/business");
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