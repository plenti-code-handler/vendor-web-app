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
import { useState } from "react";

const EditBagDrawer = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.editBag.drawerOpen);

  const [selectedBag, setSelectedBag] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [numberOfBags, setNumberOfBags] = useState(0);
  const [pricing, setPricing] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [dealTitle, setDealTitle] = useState("");
  const [user, setUser] = useState({});

  const resetForm = () => {
    setSelectedBag({});
    setSelectedTags([]);
    setSelectedCategories([]);
    setSelectedDates([]);
    setDescription("");
    setNumberOfBags(0);
    setPricing("");
    setOriginalPrice("");
    setStartTime("");
    setEndTime("");
    setDealTitle("");
    setStock("");
  };

  const handleSubmitBag = async () => {
    try {
      // Reference to the 'bags' collection
      const bagsCollectionRef = collection(db, "bags");

      // Data to be added
      const newBag = {
        bagaday: numberOfBags,
        date: selectedDates,
        desc: description,
        img: selectedBag.img,
        loc: user.loc,
        type: selectedBag.type,
        tags: selectedTags,
        resname: user.name,
        resimg: user.img,
        title: dealTitle,
        stock: Number(stock),
        resuid: user.uid,
        // categories: selectedCategories,
        price: Number(pricing),
        // originalPrice: originalPrice,
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
                    value={dealTitle}
                    onChange={(e) => setDealTitle(e.target.value)}
                    className="placeholder-grayThree text-lg placeholder:font-bold focus:outline-none"
                  />
                  <div className="flex gap-x-2">
                    <button className="py-2 px-2 rounded hover:bg-pinkBgDark">
                      {deleteSvg}
                    </button>
                    <button className=" bg-pinkBgDark py-2 px-2 rounded hover:bg-pinkBgDarkHover2">
                      {recycleSvg}
                    </button>
                  </div>
                </DialogTitle>
                <hr className="my-3 w-[90%] border-gray-300 ml-8" />
                <div className="relative mt-3 pb-3 flex-1 px-4 sm:px-6">
                  <BagTypes
                    selectedBag={selectedBag}
                    setSelectedBag={setSelectedBag}
                  />
                  <BagDetails
                    description={description}
                    setDescription={setDescription}
                    selectedTags={selectedTags}
                    selectedCategories={selectedCategories}
                    setSelectedTags={setSelectedTags}
                    setSelectedCategories={setSelectedCategories}
                  />
                  <BagsPerDay
                    numberOfBags={numberOfBags}
                    setNumberOfBags={setNumberOfBags}
                  />
                  <DateSelection
                    selectedDates={selectedDates}
                    setSelectedDates={setSelectedDates}
                  />

                  <div className="flex flex-col pb-5 gap-3">
                    <BagPricing
                      originalPrice={originalPrice}
                      setOriginalPrice={setOriginalPrice}
                      pricing={pricing}
                      setPricing={setPricing}
                    />
                    <button className="flex justify-center bg-pinkBgDark text-white font-semibold py-2 rounded hover:bg-pinkBgDarkHover2 gap-2 lg:w-[100%]">
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
