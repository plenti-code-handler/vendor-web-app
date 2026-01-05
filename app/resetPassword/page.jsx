"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import HeaderStyle from "../../components/sections/auth/HeaderStyle";
import AuthPasswordField from "../../components/fields/AuthPasswordField";

function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const handlePasswordReset = async (data) => {
    router.push("/");
  };

  return (
    <div className="flex flex-col md:flex-row justify-between h-screen px-6 items-center">
      <div className="flex justify-center flex-col lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
        <a href="/">
          <img
            alt="Plenti Logo"
            src={"/Logo.png"}
            className="max-w-[180px] md:max-w-[240px] mx-auto lg:mx-0 "
          />
        </a>
        <div className="flex flex-col gap-4">
          <p className="text-[40px] font-semibold text-gray-800">
            Stop waste, save food!
          </p>
          <p className="text-sm font-medium text-[#7E8299] leading-6">
            Choose from curated meal bags small, large, or surprise prepared by
            your favorite restaurants. Fast, easy, and always delicious.
            Download the app and grab your meal today!
          </p>
        </div>
      </div>

      <div className="flex flex-col w-full md:w-[80%] lg:w-[40%] bg-white h-[90vh] max-h-[600px] rounded-[24px] justify-between shadow-lg overflow-hidden">
        <HeaderStyle />
        <div className="flex justify-center items-center flex-1 px-6 pb-16 md:pb-28 lg:p-6">
          <form
            onSubmit={handleSubmit(handlePasswordReset)}
            className="flex flex-col w-[390px] space-y-4"
          >
            <div className="flex flex-col space-y-3">
              <p className="text-black font-semibold text-[28px]">
                Set Password
              </p>
              <p className="text-[#A1A5B7] text-sm font-medium">
                For your account{" "}
                <span className="font-semibold text-blackTwo">{email}</span>
              </p>
            </div>
            <AuthPasswordField
              register={register}
              name="password"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
            <AuthPasswordField
              name="confirmPassword"
              register={register}
              placeholder={"Confirm Password"}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
            <button
              type="submit"
              className="flex justify-center bg-blueBgDark text-white font-semibold py-2 rounded hover:bg-blueBgDarkHover2 gap-2 lg:w-[100%]"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;

// "use client";

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";

// import { useSearchParams, useRouter } from "next/navigation";
// import AuthPasswordField from "../../components/fields/AuthPasswordField";

// const ResetPasswordPage = () => {

//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const handlePasswordReset = async (data) => {
//     router.push("/login");
//   };

//   return (
//     <div className="flex flex-col lg:flex-row min-h-screen">
//       {/* Left Side */}
//       <div className="flex flex-col lg:w-[45%] items-center text-center justify-center w-full lg:h-screen bg-gray-100 p-6">
//         <a href="/">
//           <img
//             alt="Plenti Logo"
//             src="/Logo.png"
//             className="max-w-[180px] md:max-w-[240px]"
//           />
//         </a>
//         <div className="flex flex-col gap-4 mt-4 lg:mt-6">
//           <p className="text-[40px] font-semibold text-gray-800">
//             Stop waste, save food!
//           </p>
//           <p className="text-sm font-medium text-[#7E8299] leading-6 px-[8%]">
//             Choose from curated meal bags small, large, or surprise prepared by
//             your favorite restaurants. Fast, easy, and always delicious.
//             Download the app and grab your meal today!
//           </p>
//         </div>
//       </div>

//       {/* Right Side: Reset Password Form */}
//       <div className="flex flex-col justify-center items-center lg:w-[55%] bg-white p-6">

//       </div>
//     </div>
//   );
// };

// export default ResetPasswordPage;
