"use client";
import { toast } from 'sonner';
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVendorDetails,
  selectVendorData,
  selectVendorLoading,
  updateVendorDetails,
} from "../../redux/slices/vendorSlice";
import { fetchCatalogue, fetchCatalogueRequest } from "../../redux/slices/catalogueSlice";
import BeatLoader from "react-spinners/BeatLoader";
import axiosClient from "../../AxiosClient";
import AuthLeftContent from "../auth/AuthLeftContent";
import OnboardingTimeline from "../common/OnboardingTimeLine";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Import Onboarding Components
import RegisterForm from "../sections/auth/RegisterForm";
import LoginForm from "../sections/auth/LoginForm";
import ForgotPasswordContent from "../sections/auth/ForgotPasswordContent";
import VerifyOtpContent from "../sections/auth/VerifyOtpContent";
import ContactDetailsForm from "../sections/auth/ContactDetailsForm";
import CompleteProfileForm from "../sections/auth/CompleteProfileForm";
import AccountProcessingContent from "../sections/auth/AccountProcessingContent";
import TermsAcceptanceModal from "../modals/TermsAcceptanceModal";
import PricingForm from "../sections/auth/PricingForm";
import AccountApprovedContent from "../sections/auth/AccountApprovedContent";

// Check if catalogue or catalogue request has pricing data
const checkCataloguePricing = (pricing, requestData) => {
  const hasCatalogue = pricing && Array.isArray(pricing) && pricing.length > 0;
  const hasRequest = requestData?.pricing?.length > 0 || (requestData?.item_types && Object.keys(requestData.item_types).length > 0);
  return hasCatalogue || hasRequest;
};

export const OnboardLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const vendorData = useSelector(selectVendorData);
  const vendorLoading = useSelector(selectVendorLoading);
  const cataloguePricing = useSelector((state) => state.catalogue.pricing);
  const catalogueRequestData = useSelector((state) => state.catalogue.requestData);

  const [isChecking, setIsChecking] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [stepTrigger, setStepTrigger] = useState(0);

  const refreshState = useCallback(() => setStepTrigger(prev => prev + 1), []);

  const handleBackToLogin = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("password");
    localStorage.removeItem("email");
    localStorage.removeItem("logo");
    refreshState();
    router.push("/");
  }, [router, refreshState]);

  // 1. Data Fetching Effect
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (!token) {
      setIsChecking(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsChecking(true);
        await dispatch(fetchVendorDetails()).unwrap();
        await Promise.allSettled([
          dispatch(fetchCatalogue()),
          dispatch(fetchCatalogueRequest()),
        ]);
      } catch (error) {
        if (error && typeof error === 'object' && 'message' in error &&
          (error.message?.includes('vendor') || error.message?.includes('Failed to fetch vendor'))) {
          handleBackToLogin();
        }
      } finally {
        setIsChecking(false);
      }
    };

    fetchData();
  }, [dispatch, stepTrigger, handleBackToLogin]);

  // 2. Smart Redirection Effect - Only for root path "/"
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    if (pathname === "/") {
      if (token) {
        // Authenticated user behavior: Push forward
        if (vendorData && !vendorLoading) {
          if (vendorData.is_active) {
            router.push("/business");
          } else {
            router.push("/onboard");
          }
        }
      } else {
        // Guest user behavior: Clean residues and stay on Login
        const hasResidues = localStorage.getItem("email") || localStorage.getItem("logo") || localStorage.getItem("password");
        if (hasResidues) {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
          localStorage.removeItem("logo");
          localStorage.removeItem("user");
          // NOTE: We don't call refreshState() here to avoid loop, 
          // the memo will pickup the empty state on next render anyway.
        }
      }
    }
  }, [pathname, vendorData, vendorLoading, router]);

  // Determine current stage and step
  const onboardingState = useMemo(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    const email = typeof window !== 'undefined' ? localStorage.getItem("email") : null;

    // No token (Guest) cases
    if (!token) {
      if (pathname === "/forgetPassword") {
        return { stage: "FORGOT_PASSWORD", step: 1 };
      }
      if (pathname === "/onboard") {
        // If we have an email in storage, we move to OTP verification within the same route
        if (email) {
          return { stage: "VERIFY_OTP", step: 1 };
        }
        return { stage: "REGISTER", step: 1 };
      }
      if (pathname === "/verify_otp" && email) {
        return { stage: "VERIFY_OTP", step: 1 };
      }
      // Default to Login for home/other roots
      return { stage: "LOGIN", step: 1 };
    }

    // Authenticated cases
    if (vendorLoading || !vendorData) return { stage: "LOADING", step: 1 };
    if (vendorData.is_active) return { stage: "COMPLETED", step: 5 };

    const hasPhoneNumber = vendorData.phone_number && vendorData.phone_number.trim() !== "";
    const hasVendorName = vendorData.vendor_name && vendorData.vendor_name.trim() !== "";
    const hasAddress = vendorData.address && vendorData.address.trim() !== "";
    if (!hasPhoneNumber || !hasVendorName) return { stage: "PROFILE_CONTACT", step: 1 };
    if (!hasAddress) return { stage: "PROFILE_COMPLETE", step: 1 };
    if (!vendorData.account_approved) return { stage: "PROCESSING", step: 2 };
    if (Object.keys(vendorData.mou || {}).length === 0) return { stage: "TERMS", step: 3 };
    if (!checkCataloguePricing(cataloguePricing, catalogueRequestData)) return { stage: "PRICING", step: 4 };

    return { stage: "APPROVED", step: 5 };
  }, [vendorData, vendorLoading, pathname, cataloguePricing, catalogueRequestData, stepTrigger]);

  // Handle stage transitions and animation direction
  const [direction, setDirection] = useState("right"); // "right" for forward, "left" for backward
  const [prevRank, setPrevRank] = useState(0);

  const STAGE_RANKS = useMemo(() => ({
    "LOGIN": 0,
    "FORGOT_PASSWORD": 0.5,
    "REGISTER": 1,
    "VERIFY_OTP": 2,
    "PROFILE_CONTACT": 3,
    "PROFILE_COMPLETE": 4,
    "PROCESSING": 5,
    "TERMS": 6,
    "PRICING": 7,
    "APPROVED": 8,
    "COMPLETED": 9,
  }), []);

  useEffect(() => {
    const currentRank = STAGE_RANKS[onboardingState.stage] || 0;
    if (currentRank > prevRank) {
      setDirection("right");
    } else if (currentRank < prevRank) {
      setDirection("left");
    }
    setPrevRank(currentRank);
  }, [onboardingState.stage, STAGE_RANKS]);

  // Handle redirects for business routes or fully completed onboarding
  useEffect(() => {
    if (onboardingState.stage === "COMPLETED") {
      router.push("/business");
    }
  }, [onboardingState.stage, router]);



  const onSubmitContactDetails = async (data) => {
    try {
      setFormLoading(true);
      const contactData = {
        phone_number: data.phoneNumber.trim(),
        vendor_name: data.outletName.trim(),
      };
      await dispatch(updateVendorDetails(contactData)).unwrap();
      await dispatch(fetchVendorDetails()).unwrap();
      toast.success("Contact details saved!");
    } catch (error) {
      toast.error(error.message || "Failed to save contact details");
    } finally {
      setFormLoading(false);
    }
  };

  const onSubmitCompleteProfile = async (data, { address, coordinates, googleMapsUrl, service_location }) => {
    try {
      setFormLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("file", data.logo[0]);
      await axiosClient.post("/v1/vendor/me/images/upload?image_type=logo", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });

      const updateData = {
        store_manager_name: data.storeManagerName?.trim() || null,
        owner_name: data.ownerName?.trim() || null,
        vendor_type: data.vendorType,
        gst_number: data.gstnumber.trim(),
        pan_number: data.pannumber.trim(),
        fssai_number: data.fssainumber.trim(),
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        address_url: googleMapsUrl,
        address: address.trim(),
        pincode: data.pincode.toString().trim(),
        service_location: service_location || null,
      };

      await axiosClient.put("/v1/vendor/me/update", updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await dispatch(fetchVendorDetails()).unwrap();
      toast.success("Profile completed!");
    } catch (error) {
      toast.error(error.message || "Failed to complete profile");
    } finally {
      setFormLoading(false);
    }
  };

  if (isChecking || (localStorage.getItem("token") && vendorLoading && !vendorData)) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center" style={{ backgroundImage: "url('/Background.png')" }}>
        <div className="text-center">
          <BeatLoader color="white" size={10} />
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Unified Onboarding Render
  const renderOnboardContent = () => {
    const content = (() => {
      switch (onboardingState.stage) {
        case "LOGIN":
          return <LoginForm refreshState={refreshState} />;
        case "FORGOT_PASSWORD":
          return <ForgotPasswordContent refreshState={refreshState} />;
        case "REGISTER":
          return <RegisterForm refreshState={refreshState} />;
        case "VERIFY_OTP":
          return <VerifyOtpContent refreshState={refreshState} onVerifySuccess={() => refreshState()} />;
        case "PROFILE_CONTACT":
          return (
            <ContactDetailsForm
              onSubmit={onSubmitContactDetails}
              loading={formLoading}
              initialData={{
                phoneNumber: vendorData?.phone_number || "",
                outletName: vendorData?.vendor_name || "",
              }}
            />
          );
        case "PROFILE_COMPLETE":
          return (
            <CompleteProfileForm
              onSubmit={onSubmitCompleteProfile}
              loading={formLoading}
              initialData={{
                storeManagerName: vendorData?.store_manager_name || "",
                ownerName: vendorData?.owner_name || "",
                vendorType: vendorData?.vendor_type || "",
                gstnumber: vendorData?.gst_number || "",
                pannumber: vendorData?.pan_number || "",
                fssainumber: vendorData?.fssai_number || "",
                pincode: vendorData?.pincode || "",
                address: vendorData?.address || "",
                address_url: vendorData?.address_url || "",
                service_location: vendorData?.service_location || "",
              }}
            />
          );
        case "PROCESSING":
          return <AccountProcessingContent />;
        case "TERMS":
          return <TermsAcceptanceModal isModal={false} />;
        case "PRICING":
          return (
            <PricingForm
              onSuccess={() => {
                // dispatch(fetchVendorDetails());
                // dispatch(fetchCatalogue());
                dispatch(fetchCatalogueRequest());
              }}
            />
          );
        case "APPROVED":
          return <AccountApprovedContent />;
        default:
          return (
            <div className="flex justify-center items-center py-20">
              <BeatLoader color="#5F22D9" size={10} />
            </div>
          );
      }
    })();

    return (
      <div
        key={onboardingState.stage}
        className={`w-full ${onboardingState.stage === 'TERMS' ? 'h-full' : ''} flex flex-col items-center ${direction === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}
      >
        {content}
      </div>
    );
  };

  const showTimeline = pathname === "/onboard" && onboardingState.stage !== "REGISTER" && onboardingState.stage !== "VERIFY_OTP" && onboardingState.stage !== "LOADING";
  const showBackButton = pathname !== "/" || onboardingState.stage === "REGISTER" || onboardingState.stage === "VERIFY_OTP";

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/Background.png')" }}>
      <div className="flex flex-col lg:flex-row pt-5 pb-5 justify-between px-10">
        <AuthLeftContent />

        <div className="flex flex-col w-full lg:w-[60%] bg-white h-[85vh] lg:min-h-[85vh] lg:h-[95vh] max-h-[850px] rounded-[24px] shadow-lg overflow-hidden mt-10 lg:mt-20">

          {showTimeline && (
            <OnboardingTimeline currentStep={onboardingState.step} isApproved={vendorData?.account_approved} />
          )}

          {showBackButton && (
            <div className="ml-10 mt-6 lg:mt-10 items-start justify-start pr-10 gap-2">
              <button
                onClick={handleBackToLogin}
                className="text-sm text-[#5F22D9] hover:text-[#4A1BB8] font-medium transition-colors underline-offset-4 hover:underline flex items-center gap-2"
              >
                <ArrowLeftIcon className="h-3 w-3" />
                <span>Go Back to Login</span>
              </button>
            </div>
          )}

          <div className={`flex flex-col items-center flex-1 w-full ${onboardingState.stage === 'TERMS' ? 'h-full overflow-hidden' : 'px-6 pb-6 md:pb-10 lg:p-6 h-auto overflow-y-auto'} ${showTimeline && onboardingState.stage !== 'TERMS' ? 'justify-start mt-4' : 'justify-center'}`}>
            {renderOnboardContent()}
          </div>
        </div>
      </div>
    </div>
  );
};