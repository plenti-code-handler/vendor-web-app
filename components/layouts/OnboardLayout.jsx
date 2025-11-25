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
import BeatLoader from "react-spinners/BeatLoader";

export const OnboardLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const vendorData = useSelector(selectVendorData);
  const vendorLoading = useSelector(selectVendorLoading);
  const [isChecking, setIsChecking] = useState(true);

  // Routes that don't require token
  const publicOnboardRoutes = ["/", "/verify_email", "/verify_otp"];

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

    // Token exists - fetch vendor data if not already loaded
    const fetchData = async () => {
      try {
        if (!vendorData) {
          await dispatch(fetchVendorDetails(token)).unwrap();
        }
      } catch (error) {
        console.error("Error fetching vendor details:", error);
        // If fetch fails, clear token and redirect to login
        localStorage.removeItem("token");
        router.push("/");
        setIsChecking(false);
        return;
      }
    };

    fetchData();
  }, [dispatch, router, vendorData, isPublicOnboardRoute]);

  // Handle routing based on vendor data state
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Only proceed if we have a token and vendor data is loaded
    if (!token || vendorLoading || !vendorData) {
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
      toast.success("Please wait for your account to be approved");
      targetRoute = "/business";
    }
    else if ((!hasPhoneNumber || !hasVendorName) || !hasAddress) {
      toast.info("Please fill up your profile details");
      targetRoute = "/complete_profile";
    }
    // Has all profile data but not active -> accountProcessing
    else if (!vendorData.is_active) {
      toast.info("Please wait for your account to be approved");
      targetRoute = "/accountProcessing";
    }
    // Active user -> business
    else {
      toast.success("Welcome to Plenti");
      targetRoute = "/business";
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
      // Allow access to complete_profile if that's where they should be
      if (targetRoute === "/complete_profile" && pathname === "/complete_profile") {
        setIsChecking(false);
        return;
      }
      // Allow access to accountProcessing if that's where they should be
      if (targetRoute === "/accountProcessing" && pathname === "/accountProcessing") {
        setIsChecking(false);
        return;
      }
      // Redirect to correct route
      router.push(targetRoute);
      setIsChecking(false);
      return;
    }

    // User is on correct route
    setIsChecking(false);
  }, [vendorData, vendorLoading, pathname, router]);

  // Show loading state while checking
  if (isChecking || (localStorage.getItem("token") && vendorLoading)) {
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