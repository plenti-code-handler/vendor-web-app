import React, { useEffect, useState } from "react";
import AuthPasswordField from "../../fields/AuthPasswordField";
// import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../../../app/firebase/config";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handlePasswordReset = async (data) => {};

  return (
    <form
      onSubmit={handleSubmit(handlePasswordReset)}
      className="flex flex-col w-[390px] space-y-7"
    >
      <div className="flex flex-col space-y-3">
        <p className="text-black font-semibold text-[28px]">Set Password</p>
        <p className="text-[#A1A5B7] text-sm font-medium">
          For your account{" "}
          <span className="font-bold text-blackTwo">{email}</span>
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
        <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
      )}
      <button
        type="submit"
        className="flex justify-center bg-blueBgDark text-white font-semibold py-2  rounded hover:bg-blueBgDarkHover2 gap-2 lg:w-[100%]"
      >
        Continue
      </button>
    </form>
  );
};

export default ResetPasswordForm;
