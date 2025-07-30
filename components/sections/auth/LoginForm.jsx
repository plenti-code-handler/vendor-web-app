"use client";
import Link from "next/link";
import AuthPasswordField from "../../fields/AuthPasswordField";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { whiteLoader } from "../../../svgs";
import axiosClient from "../../../AxiosClient";
import { loginUser } from "../../../redux/slices/loggedInUserSlice";
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";
import { fetchCatalogue } from "../../../redux/slices/catalogueSlice";
const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user: stateUser } = useSelector((state) => state.loggedInUser);

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const email = watch("email");
  const password = watch("password");

  const handleLogin = async (data, event) => {
    console.log("Inside handle login");
    event?.preventDefault();
    setLoading(true);

    const loginData = {
      email: data.email,
      password: data.password,
    };

    try {
      // Step 1: Login and get token
      const response = await axiosClient.post("/v1/vendor/me/login", loginData);

      console.log(response);
      if (response.status === 200) {
        console.log("Success message ");
        const { access_token } = response.data;
        localStorage.setItem("token", access_token);
        dispatch(fetchCatalogue());

        // Step 2: Get vendor details to check is_active
        try {
          const vendorResponse = await axiosClient.get("/v1/vendor/me/get", {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          const vendorData = vendorResponse.data;
          console.log("Vendor data:", vendorData);

          // Step 3: Check is_active and route accordingly
          if (!vendorData.is_active) {
            console.log("Vendor account is not active, redirecting to processing page");
            toast.info("Your account is under review. You'll be notified once approved.");
            router.push("/accountProcessing");
            return;
          }

          // Step 4: Store user data and redirect to business dashboard
          localStorage.setItem("user", JSON.stringify(vendorData));
          localStorage.setItem("logo", vendorData.logo_url);
          
          // Update Redux state if needed
          dispatch(loginUser(vendorData));
          
          toast.success("Login successful!");
          router.push("/business");
        } catch (vendorError) {
          console.error("Error fetching vendor details:", vendorError);
          toast.error("Failed to verify account status. Please try again.");
        }
      }
    } catch (error) {
      setShowAlert(true);
      
      console.log(error);
      
      // Better error handling
      if (error.response?.status === 401) {
        toast.error("Invalid email or password");
      } else if (error.response?.status === 403) {
        toast.error("Account is deactivated. Please contact support.");
      } else if (error.response?.status === 422) {
        toast.error("Invalid credentials. Please check your email and password.");
      } else {
        toast.error("Login failed. Please try again.");
      }
      
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="flex flex-col w-full space-y-6 mt-10"
      >
        {/* Header Section */}
        <div className="space-y-3">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back
            </h1>
            <p className="text-gray-600 text-sm">
              Sign in to your business account
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">New to Plenti?</span>
            <Link 
              href="/verify_email"
              className="text-[#5F22D9] font-medium hover:text-[#4A1BB8] transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Create account
            </Link>
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon className={`h-5 w-5 transition-colors duration-200 ${
                focusedField === 'email' ? 'text-[#5F22D9]' : 'text-gray-400'
              }`} />
            </div>
            <input
              className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5F22D9]/20 focus:border-[#5F22D9] ${
                errors.email 
                  ? 'border-red-300 bg-red-50' 
                  : focusedField === 'email'
                  ? 'border-[#5F22D9] bg-white'
                  : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
              }`}
              placeholder="Enter your email"
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {email && !errors.email && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            )}
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs flex items-center space-x-1">
              <span>⚠</span>
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className={`h-5 w-5 transition-colors duration-200 ${
                focusedField === 'password' ? 'text-[#5F22D9]' : 'text-gray-400'
              }`} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className={`w-full pl-10 pr-12 py-3 border rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5F22D9]/20 focus:border-[#5F22D9] ${
                errors.password 
                  ? 'border-red-300 bg-red-50' 
                  : focusedField === 'password'
                  ? 'border-[#5F22D9] bg-white'
                  : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
              }`}
              placeholder="Enter your password"
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              {...register("password", {
                required: "Password is required",
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs flex items-center space-x-1">
              <span>⚠</span>
              <span>{errors.password.message}</span>
            </p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            href="/forgetPassword"
            className="text-sm text-[#5F22D9] hover:text-[#4A1BB8] transition-colors duration-200 underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`group relative w-full flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5F22D9] ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#5F22D9] hover:bg-[#4A1BB8] shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Signing in...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Sign in</span>
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          )}
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Alternative Actions */}
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            Need help?{" "}
            <Link 
              href="/contact" 
              className="text-[#5F22D9] hover:text-[#4A1BB8] transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Contact support
            </Link>
          </p>
        </div>
      </form>

      {/* Alert Toast */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <span>⚠</span>
            <span className="text-sm font-medium">Invalid email or password</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { 
            transform: translateX(100%); 
            opacity: 0; 
          }
          to { 
            transform: translateX(0); 
            opacity: 1; 
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default LoginForm;