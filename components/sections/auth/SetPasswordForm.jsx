import React, { useEffect, useState } from "react";
import AuthPasswordField from "../../fields/AuthPasswordField";
import { useDispatch, useSelector } from "react-redux";
import { setRegisterPassword } from "../../../redux/slices/registerUserSlice";
import { useRouter } from "next/navigation";

const SetPasswordForm = () => {
  const email = useSelector((state) => state.registerUser.email);

  useEffect(() => {
    if (!email) router.push("/register");
  }, []);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (password === confirmPassword) {
      dispatch(setRegisterPassword(password));
      router.push("/setup_profile");
    }
  };

  return (
    <div className="flex flex-col w-[390px] space-y-7">
      <div className="flex flex-col space-y-3">
        <p className="text-black font-semibold text-[28px]">Set Password</p>
        <p className="text-[#A1A5B7] text-[14px] font-medium">
          For your account{" "}
          <span className="font-bold text-blackTwo">{email}</span>
        </p>
      </div>
      <AuthPasswordField
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <AuthPasswordField
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder={"Confirm Password"}
      />
      <button
        onClick={handleSubmit}
        className="flex justify-center bg-pinkBgDark text-white font-semibold py-2  rounded hover:bg-pinkBgDarkHover2 gap-2 lg:w-[100%]"
      >
        Continue
      </button>
    </div>
  );
};

export default SetPasswordForm;
