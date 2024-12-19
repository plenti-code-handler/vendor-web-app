import React, { useEffect, useState } from "react";
import AuthPasswordField from "../../fields/AuthPasswordField";
import { useDispatch, useSelector } from "react-redux";
import { setRegisterPassword } from "../../../redux/slices/registerUserSlice";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SetPasswordForm = () => {
  const email = useSelector((state) => state.registerUser.email);

  useEffect(() => {
    if (!email) router.push("/register");
  }, []);

  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const dispatch = useDispatch();

  const handlePassword = (data) => {
    const { password, confirmPassword } = data;
    if (password === confirmPassword) {
      dispatch(setRegisterPassword(password));
      router.push("/setup_profile");
    } else {
      toast.error("Passwords do not match");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handlePassword)}
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
        placeholder="Confirm Password"
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

export default SetPasswordForm;
