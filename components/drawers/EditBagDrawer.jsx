"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDrawer } from "../../redux/slices/editBagSlice";
import BagTypes from "./components/BagTypes";
import BagDetails from "./components/BagDetails";
import BagsPerDay from "./components/BagsPerDay";
import DateSelection from "./components/DateSelection";
import BagPricing from "./components/BagPricing";
import { deleteSvg, recycleSvg, trashSvg } from "../../svgs";

const EditBagDrawer = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.editBag.drawerOpen);

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
              className="pointer-events-auto relative lg:w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-5 shadow-xl">
                <DialogTitle className="flex px-4 sm:px-6 justify-between ">
                  <input
                    type="text"
                    placeholder="Bag Deal Title"
                    className="placeholder-grayThree text-lg placeholder:font-bold focus:outline-none"
                  />
                  <div className="flex gap-x-2">
                    <button className="py-2 px-2 rounded hover:bg-pinkBgDark">
                      {deleteSvg}
                    </button>
                    <button className=" bg-pinkBgDark py-2 px-2 rounded hover:bg-pinkBgDarkHover">
                      {recycleSvg}
                    </button>
                  </div>
                </DialogTitle>
                <hr className="my-3 w-[90%] border-gray-300 ml-8" />
                <div className="relative mt-3 pb-3 flex-1 px-4 sm:px-6">
                  <BagTypes />
                  <BagDetails />
                  <BagsPerDay />
                  <DateSelection />

                  <div className="flex flex-col pb-5 gap-3">
                    <BagPricing />
                    <button className="flex justify-center bg-pinkBgDark text-white font-semibold py-2  rounded hover:bg-pinkBgDarkHover gap-2 lg:w-[100%]">
                      Edit Bag
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

export default EditBagDrawer;
