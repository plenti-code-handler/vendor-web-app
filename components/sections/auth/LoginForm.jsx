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

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error } = useSelector((state) => state.loggedInUser);

  const [loading, setLoading] = useState(false); // Initialize loading state to false

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = (data) => {
    setLoading(true); // Set loading to true when login starts
    const { email, password } = data;

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((user) => {
        if (user == null) {
          setLoading(false); // Set loading to false after failed login
          return;
        }

        if (user.role === "vendor") {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                console.log("Geolocation successful:", position);
                localStorage.setItem("position", JSON.stringify(position));

                const { latitude, longitude } = position.coords;

                fetch(
                  `https://api.opencagedata.com/geocode/v1/json?q=${String(
                    latitude
                  )}+${String(longitude)}&key=70109102439c46daae9f710983faf57d`
                )
                  .then((geocodeResponse) => {
                    if (!geocodeResponse.ok) {
                      throw new Error(
                        `HTTP error! status: ${geocodeResponse.status}`
                      );
                    }
                    return geocodeResponse.json();
                  })
                  .then((geocodeData) => {
                    if (!geocodeData || geocodeData.results.length === 0) {
                      throw new Error("No geocode data found.");
                    }

                    const countryCode =
                      geocodeData.results[0].annotations.currency.iso_code;
                    localStorage.setItem(
                      "countryCode",
                      JSON.stringify(countryCode)
                    );
                    console.log(`Country code: ${countryCode}`);

                    // Redirect to the business route after successful geolocation and fetch
                    router.push("/business");
                    setLoading(false); // Set loading to false after successful geolocation and fetch
                  })
                  .catch((error) => {
                    console.error("Error fetching geolocation data:", error);
                    setLoading(false); // Set loading to false after failed geolocation fetch
                  });
              },
              (error) => {
                console.error("Geolocation error:", error);
                toast.error(
                  "Geolocation permission is required to access the business area."
                );
                setLoading(false); // Set loading to false if geolocation fails
              }
            );
          } else {
            console.log("Geolocation is not supported by this browser");
            setLoading(false); // Set loading to false if geolocation is not supported
          }
        } else {
          console.error("Unknown role:", user.role);
          setLoading(false); // Set loading to false for unknown role
        }
      })
      .catch((err) => {
        toast.error("Login Failed");
        setLoading(false); // Set loading to false after failed login
      });
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
            <Link href={"/register"}>Register</Link>
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
        disabled={loading} // Disable button when loading
        className={`flex justify-center bg-blueBgDark text-white font-semibold py-2 rounded hover:bg-blueBgDarkHover2 gap-2 lg:w-[100%] ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`} // Add styling for disabled state
      >
        {loading && (
          <div className="animate-spin flex items-center justify-center">
            {whiteLoader}
          </div>
        )}
        {loading ? "Logging in.." : "Login"} {/* Show loader text */}
      </button>

      <Link
        href={"/forget_password"}
        className="text-[#A1A5B7] text-sm font-medium text-center transition-colors hover:text-gray-500 hover:underline underline-offset-4 cursor-pointer"
      >
        Forget Password
      </Link>
    </form>
  );
};

export default LoginForm;
