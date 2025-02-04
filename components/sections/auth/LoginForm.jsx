"use client";
import Link from "next/link";
import AuthPasswordField from "../../fields/AuthPasswordField";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../redux/slices/loggedInUserSlice";
import { useRouter } from "next/navigation";
import { auth } from "../../../app/firebase/config";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { whiteLoader } from "../../../svgs";
import axiosClient from "../../../AxiosClient";

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error } = useSelector((state) => state.loggedInUser);

  const [loading, setLoading] = useState(false);

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
      const response = await axiosClient.post("/v1/vendor/me/login", loginData);

      console.log(response);
      if (response.status === 200) {
        console.log("Success message ");
        localStorage.setItem("token", response.data.access_token);
        router.push("/business");
      }
    } catch (error) {
      toast.error("Invalid email or password");
      console.log(error.response.data.detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="flex flex-col w-full space-y-5"
    >
      <div className="flex flex-col space-y-3">
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
        className={`flex justify-center bg-[#5F22D9] text-white font-semibold py-2 rounded hover:bg-blueBgDarkHover2 gap-2 lg:w-[100%] ${
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
  );
};

export default LoginForm;
