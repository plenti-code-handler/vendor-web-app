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

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user: stateUser } = useSelector((state) => state.loggedInUser);

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
        className="flex flex-col w-full space-y-5"
      >
        <div className="flex flex-col space-y-3 mt-10">
          <p className="text-black font-semibold text-[28px]">
            Login to your account
          </p>
          <p className="text-[#404146] text-sm font-medium">
            Want to register your business?{" "}
            <span className="font-bold underline hover:text-black cursor-pointer">
              <Link href={"/verify_email"}>Register</Link>
            </span>
          </p>
        </div>
        <input
          className="placeholder:font-bold rounded-md border border-gray-200 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
        <AuthPasswordField
          name="password"
          register={register}
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`flex justify-center bg-primary hover:bg-hoverPrimary  text-white font-semibold py-2 rounded gap-2 lg:w-[100%] ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading && (
            <div className="animate-spin flex items-center justify-center">
              {whiteLoader}
            </div>
          )}
          {loading ? "Logging in.." : "Login"}
        </button>

        <Link
          href={"/forgetPassword"}
          className="text-[#A1A5B7] text-sm font-medium text-center transition-colors hover:text-gray-500 hover:underline underline-offset-4 cursor-pointer"
        >
          Forget Password
        </Link>
      </form>
      {showAlert && (
        <div className="fixed top-0 left-0 w-full flex justify-center z-50 animate-slide-down">
          <div className="bg-red-400 border border-gray-300 shadow-lg rounded-md mt-4 p-4 w-[90%] max-w-sm">
            <p className="text-white  font-medium text-center">
              Invalid email or password
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default LoginForm;