"use client";
import Link from "next/link";
import AuthPasswordField from "../../fields/AuthPasswordField";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../redux/slices/loggedInUserSlice";
import { useRouter } from "next/navigation";
import { auth } from "../../../app/firebase/config";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error } = useSelector((state) => state.loggedInUser);

  const handleLogin = () => {
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((user) => {
        if (user.role === "vendor") {
          router.push("/business");
        } else if (user.role === "admin") {
          router.push("/admin");
        } else {
          console.error("Unknown role:", user.role);
          // Optionally, handle unknown roles or redirect to a default page
        }
      })
      .catch((err) => {
        console.error("Login failed:", err);
        // Optionally, display the error to the user
        // e.g., set an error state or show a notification
      });
  };

  return (
    <div className="flex flex-col w-[390px] space-y-5">
      <div className="flex flex-col space-y-3">
        <p className="text-black font-semibold text-[28px]">
          Login to your account
        </p>
        <p className="text-[#404146] text-[14px] font-medium">
          Want to register your business?{" "}
          <span className="font-bold underline hover:text-black cursor-pointer">
            <Link href={"/register"}>Register</Link>
          </span>
        </p>
      </div>
      <input
        className="placeholder:font-bold rounded-md border border-gray-200 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <AuthPasswordField
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="flex justify-center bg-pinkBgDark text-white font-semibold py-2 rounded hover:bg-pinkBgDarkHover2 gap-2 lg:w-[100%]"
        onClick={handleLogin}
      >
        Login
      </button>
      {/* <Link
        href={"/forget_password"}
        className="text-[#A1A5B7] text-[14px] font-medium text-center transition-colors hover:text-gray-500 hover:underline underline-offset-4 cursor-pointer"
      >
        Forget Password
      </Link> */}
    </div>
  );
};

export default LoginForm;
