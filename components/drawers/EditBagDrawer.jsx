"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Textarea,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";

import BagsPerDay from "./components/BagsPerDay";
import BagPricing from "./components/BagPricing";
import ItemTypeFilter from "../dropdowns/ItemTypeFilter";
import ItemTagsFilter from "../dropdowns/ItemTagsFilter";
import { useEffect, useState } from "react";
import axiosClient from "../../AxiosClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { toast } from "sonner";
import { whiteLoader } from "../../svgs";
import { setOpenDrawer } from "../../redux/slices/editBagSlice";
import { fetchAllBags } from "../../redux/slices/bagsSlice";

const EditBagDrawer = () => {
  const [selectedBag, setSelectedBag] = useState();
  const dispatch = useDispatch();
  const [selectedTags, setSelectedTags] = useState([]);
  const [isVeg, setIsVeg] = useState(true);
  const [description, setDescription] = useState("");
  const [numberOfBags, setNumberOfBags] = useState(0);
  const [pricing, setPricing] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [windowStartTime, setWindowStartTime] = useState(new Date());
  const [windowEndTime, setWindowEndTime] = useState(new Date());
  const { bagToEdit } = useSelector((state) => state.editBag);

  useEffect(() => {
    if (bagToEdit) {
      setSelectedTags(bagToEdit.tags);
      setOriginalPrice(bagToEdit.actual_price);
      setSelectedBag(bagToEdit.item_type);
      setDescription(bagToEdit.description);
      setNumberOfBags(bagToEdit.quantity);
      setPricing(bagToEdit.price);
      setWindowStartTime(bagToEdit.window_start_time);
      setWindowEndTime(bagToEdit.window_end_time);
    }
  }, [bagToEdit]);

  const handleStartTimeChange = (date) => {
    const timestamp = Math.floor(date.getTime() / 1000);
    setWindowStartTime(timestamp);

    if (windowEndTime && timestamp > windowEndTime) {
      setWindowEndTime(timestamp);
    }
  };

  const handleEndTimeChange = (date) => {
    const timestamp = Math.floor(date.getTime() / 1000);

    if (timestamp < windowStartTime) {
      toast.error("End time cannot be before start time!");
      return;
    }

    setWindowEndTime(timestamp);
  };

  const resetForm = () => {
    setSelectedBag({});
    setSelectedTags([]);
    setDescription("");
    setNumberOfBags(0);
    setWindowStartTime(new Date());
    setWindowEndTime(new Date());
    setPricing("");
    setOriginalPrice("");
    setIsVeg(true);
  };

  const handleEditBag = async () => {
    try {
      setLoading(true);

      console.log("Data before API hit");

      const payload = {
        item_id: bagToEdit.id,
        vendor_id: bagToEdit.vendor_id,
        item_type: selectedBag,
        description: description,
        quantity: numberOfBags,
        price: pricing,
        actual_price: originalPrice,
        tags: selectedTags,
        veg: isVeg,
        non_veg: !isVeg,
        window_start_time: windowStartTime,
        window_end_time: windowEndTime,
      };

      console.log(payload);

      const response = await axiosClient.patch(
        `/v1/vendor/item/update?item_id=${bagToEdit.id}`,
        payload
      );

      if (response.status === 200) {
        toast.success("Bag updated successfully!");
        dispatch(setOpenDrawer(false));
        dispatch(fetchAllBags());
      }

      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update product!");
    } finally {
      setLoading(false);
    }
  };

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
              className="pointer-events-auto relative lg:w-screen max-w-[29rem] transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-5 shadow-xl">
                <div className="relative mt-3 pb-3 flex-1 px-4 sm:px-6">
                  <div className="flex flex-col pb-5">
                    <p className="text-black font-bold text-xl">
                      Choose Item Type
                    </p>
                  </div>
                  <ItemTypeFilter
                    selectedFilter={selectedBag}
                    onFilterChange={setSelectedBag}
                  />

                  <ItemTagsFilter
                    selectedFilter={selectedTags}
                    onFilterChange={setSelectedTags}
                  />

                  <div>
                    <div className="flex flex-col pb-5 mt-5">
                      <p className="text-black font-bold text-xl">
                        Window Start Time
                      </p>
                      <DatePicker
                        selected={
                          windowStartTime
                            ? new Date(windowStartTime * 1000)
                            : null
                        }
                        onChange={handleStartTimeChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        minDate={new Date()}
                        className="border border-gray-300 w-full p-2 rounded"
                      />
                    </div>

                    <div className="flex flex-col pb-5 mt-5">
                      <p className="text-black font-bold text-xl">
                        Window End Time
                      </p>
                      <DatePicker
                        selected={
                          windowStartTime
                            ? new Date(windowEndTime * 1000)
                            : null
                        }
                        onChange={handleEndTimeChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        minDate={windowStartTime}
                        className="border border-gray-300 w-full p-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col pb-5 mt-5 ">
                    <p className="text-black font-bold text-xl">
                      Item Description
                    </p>
                  </div>
                  <Textarea
                    className="block w-full  placeholder:font-bold resize-none rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                    rows={6}
                    placeholder="Description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="flex justify-between items-center mt-4 w-full">
                    <span className="text-lg font-semibold min-w-36 ">
                      Select Type:
                    </span>
                    <div className="flex w-full justify-end items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value="non-veg"
                          checked={!isVeg}
                          onChange={() => setIsVeg(false)}
                          className="w-5 h-5 text-gray-600 bg-gray-200 border-gray-400 rounded focus:ring-gray-600"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Non-Veg
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value="veg"
                          checked={isVeg}
                          onChange={() => setIsVeg(true)}
                          className="w-5 h-5 text-gray-600 bg-gray-200 border-gray-400 rounded focus:ring-gray-600"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Veg
                        </span>
                      </label>
                    </div>
                  </div>

                  <BagsPerDay
                    numberOfBags={numberOfBags}
                    setNumberOfBags={setNumberOfBags}
                  />

                  <div className="flex flex-col gap-3">
                    <BagPricing
                      originalPrice={originalPrice}
                      setOriginalPrice={setOriginalPrice}
                      pricing={pricing}
                      setPricing={setPricing}
                    />
                    <button
                      onClick={handleEditBag}
                      className="flex justify-center bg-blueBgDark text-white font-semibold py-2  rounded hover:bg-blueBgDarkHover2 gap-2 lg:w-[100%]"
                    >
                      {loading && (
                        <div className="animate-spin flex items-center justify-center">
                          {whiteLoader}
                        </div>
                      )}
                      {loading ? "Updating..." : "Update Bag"}
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
