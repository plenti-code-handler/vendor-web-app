"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDrawer } from "../../redux/slices/addBagSlice";
import DrawerHeader from "./components/DrawerHeader";
import BagTypes from "./components/BagTypes";
import BagDetails from "./components/BagDetails";
import BagsPerDay from "./components/BagsPerDay";
import DateSelection from "./components/DateSelection";
import BagPricing from "./components/BagPricing";
import { useState } from "react";
import { db } from "../../app/firebase/config";
import { addDoc, collection } from "firebase/firestore";

const AddBagDrawer = () => {
  const [selectedBagType, setSelectedBagType] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [stock, setStock] = useState(null);
  const [description, setDescription] = useState("");
  const [numberOfBags, setNumberOfBags] = useState(0);
  const [pricing, setPricing] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);

  console.log(selectedDates);

  const resetForm = () => {
    setSelectedBagType(null);
    setSelectedTags([]);
    setSelectedCategories([]);
    setSelectedDates([]);
    setDescription("");
    setNumberOfBags(0);
    setPricing("");
    setOriginalPrice("");
    setStartTime("");
    setEndTime("");
  };

  const handleSubmitBag = async () => {
    try {
      // Reference to the 'bags' collection
      const bagsCollectionRef = collection(db, "bags");

      // Data to be added
      const newBag = {
        type: selectedBagType,
        tags: selectedTags,
        // categories: selectedCategories,
        desc: description,
        bagaday: numberOfBags,
        pricing: pricing,
        originalPrice: originalPrice,
        dates: selectedDates,
        // createdAt: new Date(), // Optionally add a timestamp
      };

      // Add the document to Firestore
      const docRef = await addDoc(bagsCollectionRef, newBag);

      console.log("Document written with ID: ", docRef.id);

      // Optionally, reset the form state after successful submission
      resetForm();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  const dispatch = useDispatch();
  const open = useSelector((state) => state.addBag.drawerOpen);

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
              className="pointer-events-auto relative lg:w-screen max-w-[29rem] transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-5 shadow-xl">
                <DialogTitle className="flex px-4 sm:px-6 justify-between ">
                  <DrawerHeader />
                </DialogTitle>
                <hr className="my-3 w-[90%] border-gray-300 ml-8" />
                <div className="relative mt-3 pb-3 flex-1 px-4 sm:px-6">
                  <BagTypes
                    selectedBagType={selectedBagType}
                    setSelectedBagType={setSelectedBagType}
                  />
                  <BagDetails
                    description={description}
                    setDescription={setDescription}
                    selectedTags={selectedTags}
                    selectedCategories={selectedCategories}
                    setSelectedTags={setSelectedTags}
                    setSelectedCategories={setSelectedCategories}
                    stock={stock}
                    setStock={setStock}
                  />
                  <BagsPerDay
                    numberOfBags={numberOfBags}
                    setNumberOfBags={setNumberOfBags}
                  />
                  <DateSelection
                    selectedDates={selectedDates}
                    setSelectedDates={setSelectedDates}
                  />

                  <div className="flex flex-col gap-3">
                    <BagPricing
                      originalPrice={originalPrice}
                      setOriginalPrice={setOriginalPrice}
                      pricing={pricing}
                      setPricing={setPricing}
                    />
                    <button
                      onClick={handleSubmitBag}
                      className="flex justify-center bg-pinkBgDark text-white font-semibold py-2  rounded hover:bg-pinkBgDarkHover2 gap-2 lg:w-[100%]"
                    >
                      Add Bag
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

export default AddBagDrawer;
