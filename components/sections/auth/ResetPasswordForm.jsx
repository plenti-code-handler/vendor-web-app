import React, { useEffect, useState } from "react";
import AuthPasswordField from "../../fields/AuthPasswordField";
import { useDispatch, useSelector } from "react-redux";
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

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const oobCode = searchParams.get("oobCode");
  const continueUrl = searchParams.get("continueUrl");

  const dispatch = useDispatch();

  useEffect(() => {
    const url = new URL(continueUrl);
    const userEmail = decodeURIComponent(url.searchParams.get("email") || "");
    setEmail(userEmail);
  }, [continueUrl]);

  const handleSubmit = async () => {
    if (password === confirmPassword) {
      try {
        // Verify the oobCode
        await verifyPasswordResetCode(auth, oobCode);
        // Confirm the new password
        await confirmPasswordReset(auth, oobCode, password);

        // Redirect the user to login or another page
        // Create a query to find the user by email
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));

        // Execute the query
        const querySnapshot = await getDocs(q);

        // Assuming email is unique and there's only one user with this email
        if (!querySnapshot.empty) {
          querySnapshot.forEach(async (document) => {
            // Get the document reference
            const userDocRef = doc(db, "users", document.id);

            // Update the pass field with the new password
            await updateDoc(userDocRef, { pass: password });

            console.log(
              "Password updated successfully for user with email:",
              email
            );
          });
        } else {
          console.log("No user found with the provided email.");
        }
        router.push("/login");
      } catch (error) {
        console.error("Failed to reset password: " + error.message);
      }
      router.push("/login");
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

export default ResetPasswordForm;
