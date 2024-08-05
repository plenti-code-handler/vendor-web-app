"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDrawer } from "../../redux/slices/deleteAccountSlice";
import { crossIconSvg, deleteUserSvg } from "../../svgs";
import PasswordField from "./components/PasswordField";

const DeleteAccountDrawer = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.deleteAccount.drawerOpen);

  const handleClose = () => {
    dispatch(setOpenDrawer(false));
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
              className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-5 shadow-xl">
                <DialogTitle className="flex px-4 sm:px-6 justify-between ">
                  <p className="text-blackFour font-semibold text-[18px]">
                    Delete Account
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
                  <div className="flex flex-col items-center mt-5 gap-2">
                    {deleteUserSvg}
                    <p className="text-blackFour font-semibold text-[22px]">
                      Delete Account
                    </p>
                    <p className="font-md text-[14px] text-gray-800 text-center">
                      Are you sure you want to delete your account?
                    </p>
                    <p className="font-md text-[14px] text-redOne text-center">
                      Your account will be deleted permanently.
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2 pt-3">
                    <p className="text-blackFour font-semibold text-[15px]">
                      Enter Your Password
                    </p>
                    <PasswordField />
                  </div>

                  <div className="flex gap-5 pt-5">
                    <button className="flex justify-center bg-white text-black border border-black font-md py-2  rounded hover:bg-grayTwo gap-2 lg:w-[100%]">
                      Cancel
                    </button>
                    <button className="flex justify-center bg-redOne text-white font-md py-2  rounded hover:bg-redOne-600 gap-2 lg:w-[100%]">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteAccountDrawer;
