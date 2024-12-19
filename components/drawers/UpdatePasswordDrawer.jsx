"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDrawer } from "../../redux/slices/updatePasswordSlice";
import { crossIconSvg } from "../../svgs";
import PasswordField from "./components/PasswordField";
import { useState } from "react";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword as updateFirebasePassword,
} from "firebase/auth";
import { db } from "../../app/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { logoutUser } from "../../redux/slices/loggedInUserSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const UpdatePasswordDrawer = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.updatePassword.drawerOpen);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showFields, setShowFields] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  const handleClose = () => {
    dispatch(setOpenDrawer(false));
  };

  const router = useRouter();

  const handleContinue = async () => {
    if (!user) {
      setError("No user is logged in.");
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, oldPassword);

    try {
      await reauthenticateWithCredential(user, credential);
      // Password is correct, proceed to the next step
      setShowFields(true);
    } catch (error) {
      toast.error("Incorrect password.");
    }
  };

  const updatePassword = async () => {
    if (newPassword === confirmNewPassword) {
      try {
        // Update password in Firebase Authentication
        await updateFirebasePassword(user, newPassword);
        console.log("Password updated successfully in Firebase Auth.");

        // Update the password in the Firestore 'users' collection
        const userDocRef = doc(db, "users", user.uid); // Assuming the user document ID is the user's UID
        await updateDoc(userDocRef, {
          pass: newPassword,
        });

        setOldPassword("");
        setShowFields(false);
        setNewPassword("");
        setConfirmNewPassword("");

        toast.success("Password updated successfully.");
        dispatch(setOpenDrawer(false));
        await auth.signOut();
        dispatch(logoutUser());
        router.push("/");
      } catch (error) {
        if (error.code === "auth/weak-password") {
          toast.success("Weak password. Please use a stronger password.");
        }
        console.error("Error updating password:", error);
      }
    } else {
      toast.error("Passwords do not match");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-999999">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 overflow-hidden rounded-md">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-4">
            <DialogPanel
              transition
              className="pointer-events-auto relative lg:w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-5 shadow-xl">
                <DialogTitle className="flex px-4 sm:px-6 justify-between ">
                  <p className="text-blackFour font-semibold text-lg">
                    Update Password
                  </p>
                  <button
                    className="p-2 hover:bg-gray-200 rounded"
                    onClick={() => handleClose()}
                  >
                    {crossIconSvg}
                  </button>
                </DialogTitle>
                <hr className="my-3 w-[90%] border-gray-300 ml-8" />
                <div className="relative mt-3 pb-3 flex-1 px-4 sm:px-6 space-y-4">
                  {!showFields ? (
                    <>
                      <p className="font-md text-sm text-gray-800 text-center">
                        Please enter your old password for verification.
                      </p>
                      <div className="flex flex-col pb-5 gap-3">
                        <div className="flex flex-col space-y-2">
                          <p className="text-blackFour font-semibold text-[15px]">
                            Old Password
                          </p>
                          <PasswordField
                            value={oldPassword}
                            onChange={setOldPassword}
                          />
                        </div>
                        <button
                          onClick={handleContinue}
                          className="flex justify-center bg-blueBgDark text-white font-md py-2  rounded hover:bg-blueBgDarkHover2 gap-2 lg:w-[100%] mt-5"
                        >
                          Continue
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col space-y-2">
                        <p className="text-blackFour font-semibold text-[15px]">
                          New Password
                        </p>
                        <PasswordField
                          value={newPassword}
                          onChange={setNewPassword}
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <p className="text-blackFour font-semibold text-[15px]">
                          Confirm New Password
                        </p>
                        <PasswordField
                          value={confirmNewPassword}
                          onChange={setConfirmNewPassword}
                        />
                      </div>
                      <div className="flex gap-5 pt-5">
                        <button
                          onClick={() => {
                            setOldPassword("");
                            setShowFields(false);
                            setNewPassword("");
                            setConfirmNewPassword("");
                          }}
                          className="flex justify-center bg-white text-black border border-black font-md py-2  rounded hover:bg-grayTwo gap-2 w-[100%]"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={updatePassword}
                          className="flex justify-center bg-blueBgDark text-white font-md py-2  rounded hover:bg-blueBgDarkHover2 gap-2 w-[100%]"
                        >
                          Update
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default UpdatePasswordDrawer;
