"use client";
import { toast } from 'sonner';
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVendorDetails,
  selectVendorData,
  selectVendorLoading,
} from "../../redux/slices/vendorSlice";
import { fetchCatalogue, fetchCatalogueRequest } from "../../redux/slices/catalogueSlice";
import BeatLoader from "react-spinners/BeatLoader";
import axiosClient from "../../AxiosClient";

// Check if catalogue or catalogue request has pricing data
const checkCataloguePricing = (catalogueItemTypes, requestData) => {
  const hasCatalogue = catalogueItemTypes && Object.keys(catalogueItemTypes).length > 0;
  const hasRequest = requestData?.item_types && Object.keys(requestData.item_types).length > 0;
  return hasCatalogue || hasRequest;
};

export const OnboardLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const vendorData = useSelector(selectVendorData);
  const vendorLoading = useSelector(selectVendorLoading);
  const catalogueItemTypes = useSelector((state) => state.catalogue.itemTypes);
  const catalogueRequestData = useSelector((state) => state.catalogue.requestData);
  const catalogueLoading = useSelector((state) => state.catalogue.loading);
  const catalogueRequestLoading = useSelector((state) => state.catalogue.requestLoading);
  const [isChecking, setIsChecking] = useState(true);
  const [isActivating, setIsActivating] = useState(false);

  // Routes that don't require token
  const publicOnboardRoutes = ["/", "/verify_email", "/verify_otp", "/forgetPassword"];

  // Check if current route is a public onboard route
  const isPublicOnboardRoute = publicOnboardRoutes.includes(pathname);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // If no token, allow access to public onboard routes
    if (!token) {
      if (!isPublicOnboardRoute) {
        // No token but trying to access protected route, redirect to login
        router.push("/");
      }
      setIsChecking(false);
      return;
    }
    
    // Token exists - fetch all required data on every route change
    // This ensures we always have the latest data for routing decisions
    const fetchData = async () => {
      console.log("fetching data");
      try {
        setIsChecking(true);
        
        // Always fetch vendor details (will be cached by Redux if already loaded)
        await dispatch(fetchVendorDetails()).unwrap();
    
        // Always try to fetch catalogue and request (errors are expected if they don't exist)
        // Use Promise.allSettled to handle errors gracefully
        await Promise.allSettled([
          dispatch(fetchCatalogue()),
          dispatch(fetchCatalogueRequest()),
        ]);
      } catch (error) {
        // Only vendor details errors are critical
        if (error && typeof error === 'object' && 'message' in error && 
            (error.message?.includes('vendor') || error.message?.includes('Failed to fetch vendor'))) {
          console.error("Error fetching vendor details:", error);
          localStorage.removeItem("token");
          router.push("/");
          return;
        } else {
          // Catalogue errors are expected for new vendors - just log and continue
          console.log("Catalogue data not available (expected for new vendors)");
        }
      } finally {
        setIsChecking(false);
      }
    };
    
    fetchData();
  }, [dispatch, router, isPublicOnboardRoute]);

  // Handle routing based on vendor data state
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Only proceed if we have a token and vendor data is loaded
    if (!token || vendorLoading || !vendorData || isActivating || catalogueLoading || catalogueRequestLoading) {
      return;
    }
  
    const hasPhoneNumber =
      vendorData.phone_number && vendorData.phone_number.trim() !== "";
    const hasVendorName =
      vendorData.vendor_name && vendorData.vendor_name.trim() !== "";
    const hasAddress =
      vendorData.address && vendorData.address.trim() !== "";
  
    // Determine where user should be based on their state
    let targetRoute = null;
    if (vendorData.is_active) {
      if (pathname !== "/accountApproved") {
        targetRoute = "/business";
      } else {
        targetRoute = pathname;
      }
    }
    else if ((!hasPhoneNumber || !hasVendorName) || !hasAddress) {
      targetRoute = "/complete_profile";
      if (pathname !== targetRoute) {
        toast.info("Please fill up your profile details");
      }
    }
    else if (!vendorData.account_approved) {
      targetRoute = "/accountProcessing";
      if (pathname !== targetRoute) {
        toast.info("Please wait for your account to be approved");
      }
    }
    else if (Object.keys(vendorData.mou || {}).length === 0) {
      targetRoute = "/terms-acceptance";
      if (pathname !== targetRoute) {
        toast.info("Please accept the terms and conditions");
      }
    }
    else if (!checkCataloguePricing(catalogueItemTypes, catalogueRequestData)) {
      // Neither catalogue nor catalogue request has pricing - route to price-decision
      targetRoute = "/pricing";
      if (pathname !== targetRoute) {
        toast.info("Please set up your pricing");
      }
    }
    else {
      targetRoute = "/accountApproved";
    }
  
    // If user is on verify_email or verify_otp with token, redirect based on state
    if (pathname === "/verify_email" || pathname === "/verify_otp") {
      router.push(targetRoute);
      setIsChecking(false);
      return;
    }
  
    // If user is on login page with token, redirect based on state
    if (pathname === "/" && targetRoute !== "/") {
      router.push(targetRoute);
      setIsChecking(false);
      return;
    }
  
    // If user is on wrong route, redirect to correct one
    if (targetRoute && pathname !== targetRoute) {
      router.push(targetRoute);
      setIsChecking(false);
      return;
    }
    
    // User is on correct route
    setIsChecking(false);
  }, [vendorData, vendorLoading, pathname, router, isActivating, catalogueItemTypes, catalogueRequestData, catalogueLoading, catalogueRequestLoading, dispatch]);

  if (isChecking || isActivating || (localStorage.getItem("token") && (vendorLoading || catalogueLoading || catalogueRequestLoading))) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      >
        <div className="text-center">
          <BeatLoader color="#5F22D9" size={10} />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render children if user is on correct route
  return <>{children}</>;
};