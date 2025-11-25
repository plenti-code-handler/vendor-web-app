"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "../../../components/sections/auth/BackButton";
import axiosClient from "../../../AxiosClient";
import { toast } from "sonner";
import AuthLeftContent from "../../../components/layouts/AuthLeftContent";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVendorDetails,
  updateVendorDetails,
  selectVendorData,
  selectVendorLoading,
} from "../../../redux/slices/vendorSlice";
import BeatLoader from "react-spinners/BeatLoader";
import ContactDetailsForm from "../../../components/sections/auth/ContactDetailsForm";
import CompleteProfileForm from "../../../components/sections/auth/CompleteProfileForm";

function Page() {
  const dispatch = useDispatch();
  const router = useRouter();
  const vendorData = useSelector(selectVendorData);
  const vendorLoading = useSelector(selectVendorLoading);

  // Step state: 1 = Contact Details, 2 = Complete Profile
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch vendor data on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !vendorData) {
      dispatch(fetchVendorDetails(token));
    }
  }, [dispatch, vendorData]);

  // Determine which step to show based on vendor data
  useEffect(() => {
    if (vendorData) {
      const hasPhoneNumber =
        vendorData.phone_number && vendorData.phone_number.trim() !== "";
      const hasVendorName =
        vendorData.vendor_name && vendorData.vendor_name.trim() !== "";
      const hasAddress = vendorData.address && vendorData.address.trim() !== "";

      // If phone_number OR vendor_name is missing, show Step 1
      if (!hasPhoneNumber || !hasVendorName) {
        setCurrentStep(1);
      }
      // If phone_number AND vendor_name are filled but address is missing, show Step 2
      else if (hasPhoneNumber && hasVendorName && !hasAddress) {
        setCurrentStep(2);
      }
      // If all required fields are filled, redirect to account processing or business
      else {
        if (!vendorData.is_active) {
          router.push("/accountProcessing");
        } else {
          router.push("/business");
        }
      }
    }
  }, [vendorData, router]);

  // Step 1: Submit Contact Details
  const onSubmitStep1 = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required. Please login again.");
        router.push("/");
        return;
      }

      setLoading(true);

      const contactData = {
        phone_number: data.phoneNumber.trim(),
        vendor_name: data.outletName.trim(),
      };

      await dispatch(updateVendorDetails(contactData)).unwrap();

      // Refresh vendor data
      await dispatch(fetchVendorDetails(token)).unwrap();

      toast.success("Contact details saved successfully!");
      // Step will be updated automatically by the useEffect that watches vendorData
    } catch (error) {
      console.error("Error occurred during contact details submission:", error);
      toast.error(
        error.response?.data?.detail ||
          error.message ||
          "Failed to save contact details"
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit Complete Profile
  const onSubmitStep2 = async (data, { address, coordinates, googleMapsUrl }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required. Please login again.");
        router.push("/");
        return;
      }

      setLoading(true);

      // Upload logo
      const formData = new FormData();
      formData.append("file", data.logo[0]);

      await axiosClient.post(
        "/v1/vendor/me/images/upload?image_type=logo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Prepare vendor update data
      const vendorUpdateData = {
        store_manager_name: data.storeManagerName?.trim() || null,
        owner_name: data.ownerName?.trim() || null,
        vendor_type: data.vendorType,
        gst_number: data.gstnumber.trim(),
        description: data.description.trim(),
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        address_url: googleMapsUrl,
        address: address.trim(),
        pincode: data.pincode.toString().trim(),
      };

      await axiosClient.put("/v1/vendor/me/update", vendorUpdateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh vendor data
      await dispatch(fetchVendorDetails(token)).unwrap();

      localStorage.removeItem("password");
      localStorage.removeItem("email");
      router.push("/accountProcessing");
    } catch (error) {
      console.error("Error occurred during form submission:", error);
      toast.error(
        error.response?.data?.detail ||
          error.message ||
          "Failed to complete profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // Prepare initial data for forms
  const step1InitialData =
    vendorData && currentStep === 1
      ? {
          phoneNumber: vendorData.phone_number || "",
          outletName: vendorData.vendor_name || "",
        }
      : null;

  const step2InitialData =
    vendorData && currentStep === 2
      ? {
          storeManagerName: vendorData.store_manager_name || "",
          ownerName: vendorData.owner_name || "",
          vendorType: vendorData.vendor_type || "",
          gstnumber: vendorData.gst_number || "",
          pincode: vendorData.pincode || "",
          description: vendorData.description || "",
          address: vendorData.address || "",
          latitude: vendorData.latitude || null,
          longitude: vendorData.longitude || null,
          address_url: vendorData.address_url || "",
        }
      : null;

  // Show loading state while fetching vendor data
  if (vendorLoading) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: "url('/Background.png')" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/Background.png')" }}
    >
      <div className="flex flex-col lg:flex-row pt-5 pb-5 justify-between px-10">
        <AuthLeftContent />

        <div className="flex flex-col w-full lg:w-[40%] bg-white lg:h-[95vh] max-h-[800px] rounded-[24px] shadow-lg overflow-hidden mt-20">
          <div className="ml-5 mt-10">
            <BackButton />
          </div>
          <div className="flex flex-col justify-start items-center flex-1 px-6 pb-6 md:pb-10 lg:p-6 h-auto overflow-y-auto">
            {currentStep === 0 && (
              <div className="flex flex-col justify-start items-center flex-1 px-6 pb-6 md:pb-10 lg:p-6 h-auto overflow-y-auto">
                <BeatLoader color="#5F22D9" size={10} />
              </div>
            )}

            {currentStep === 1 && (
              <ContactDetailsForm
                onSubmit={onSubmitStep1}
                loading={loading}
                initialData={step1InitialData}
              />
            )}

            {currentStep === 2 && (
              <CompleteProfileForm
                onSubmit={onSubmitStep2}
                loading={loading}
                initialData={step2InitialData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;