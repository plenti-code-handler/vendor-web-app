"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Textarea,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDrawer } from "../../redux/slices/addBagSlice";
import ItemTypeFilter from "../dropdowns/ItemTypeFilter";
import ItemTagsFilter from "../dropdowns/ItemTagsFilter";
import { useEffect, useState } from "react";
import axiosClient from "../../AxiosClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "sonner";
import { whiteLoader } from "../../svgs";
import { fetchAllBags } from "../../redux/slices/bagsSlice";

const AddBagDrawer = () => {
  const [selectedBag, setSelectedBag] = useState("MEAL");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isVeg, setIsVeg] = useState(true);
  const [isNonVeg, setIsNonVeg] = useState(false);
  const [description, setDescription] = useState("");
  const [vegServings, setVegServings] = useState(0);
  const [nonVegServings, setNonVegServings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [windowStartTime, setWindowStartTime] = useState(new Date());
  const [windowEndTime, setWindowEndTime] = useState(new Date());
  const [showCustomDescription, setShowCustomDescription] = useState(false);
  const [availableDescriptions, setAvailableDescriptions] = useState([]);

  // Get available descriptions from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.item_descriptions && Array.isArray(user.item_descriptions)) {
          setAvailableDescriptions(user.item_descriptions);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleStartTimeChange = (date) => {
    setWindowStartTime(date);
    const newEndTime = new Date(date.getTime() + 30 * 60000);
    setWindowEndTime(newEndTime);
  };

  const handleEndTimeChange = (date) => {
    if (date < new Date()) {
      toast.error("End time cannot be in the past!");
      return;
    }

    if (date < windowStartTime) {
      toast.error("End time cannot be before start time!");
      return;
    }

    setWindowEndTime(date);
  };

  useEffect(() => {
    const initialEndTime = new Date(windowStartTime.getTime() + 30 * 60000);
    setWindowEndTime(initialEndTime);
  }, []);

  const resetForm = () => {
    setSelectedBag("MEAL");
    setSelectedTags([]);
    setDescription("");
    setVegServings(0);
    setNonVegServings(0);
    setWindowStartTime(new Date());
    setWindowEndTime(new Date());
    setIsVeg(true);
    setIsNonVeg(false);
    setShowCustomDescription(false);
  };

  const handleSubmitBag = async () => {
    try {
      setLoading(true);

      if (windowEndTime < windowStartTime) {
        toast.error("End time must be after start time!");
        setLoading(false);
        return;
      }

      // Validation
      const requiredFields = [
        {
          field: selectedBag,
          name: "selectedBag",
          message: "Please select an item type.",
          validate: (field) => field && field.trim() !== "",
        },
        {
          field: selectedTags,
          name: "selectedTags",
          message: "Please select item tags.",
          validate: (field) => Array.isArray(field) && field.length > 0,
        },
        {
          field: description,
          name: "description",
          message: "Please fill the description.",
          validate: (field) => field && field.trim() !== "",
        },
        {
          field: isVeg || isNonVeg,
          name: "diet",
          message: "Please select at least one diet option (Veg/Non-Veg).",
          validate: (field) => field === true,
        },
        {
          field: vegServings + nonVegServings,
          name: "servings",
          message: "Please provide at least one serving count.",
          validate: (field) => field > 0,
        },
      ];

      for (const { field, name, message, validate } of requiredFields) {
        if (!validate(field)) {
          console.log(`Field '${name}' is missing or empty.`);
          toast.error(message);
          setLoading(false);
          return;
        }
      }

      const newItem = {
        item_type: selectedBag,
        window_start_time: Math.floor(windowStartTime.getTime() / 1000),
        window_end_time: Math.floor(windowEndTime.getTime() / 1000),
        description: description,
        veg: isVeg,
        non_veg: isNonVeg,
        veg_servings_start: vegServings,
        non_veg_servings_start: nonVegServings,
        tags: selectedTags,
      };

      const response = await axiosClient.post(
        "/v1/vendor/item/create",
        newItem
      );

      if (response.status === 200) {
        toast.success("Item Created Successfully!");
        resetForm();
        dispatch(setOpenDrawer(false));
        dispatch(fetchAllBags());
      }
    } catch (error) {
      const errorDetail = error?.response?.data?.detail;

      if (Array.isArray(errorDetail)) {
        const windowTimeError = errorDetail.find(
          (err) =>
            err?.msg &&
            typeof err.msg === "string" &&
            err.msg.includes("Window start time cannot be in the past")
        );

        if (windowTimeError) {
          toast.error("Window time cannot be in the past");
          setLoading(false);
          return;
        }
      }

      setLoading(false);
      toast.error("Failed to create a bag");
      console.error("Error adding document: ", error);
    } finally {
      setLoading(false);
    }
  };

  const dispatch = useDispatch();
  const open = useSelector((state) => state.addBag.drawerOpen);

  const handleClose = () => {
    setLoading(false);
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
                  <div className="flex flex-row justify-between pb-5">
                    <p className="text-black font-bold text-xl">
                      Choose Item Type
                    </p>
                    <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  </div>
                  <ItemTypeFilter
                    selectedFilter={selectedBag}
                    onFilterChange={setSelectedBag}
                  />

                  <ItemTagsFilter
                    selectedFilter={selectedTags}
                    onFilterChange={setSelectedTags}
                  />

                  {/* Window Time Section */}
                  <div>
                    <div className="flex flex-col pb-5 mt-5">
                      <p className="text-black font-bold text-xl">
                        Window Start Time
                      </p>
                      <DatePicker
                        selected={windowStartTime}
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
                        selected={windowEndTime}
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

                  {/* Description Section */}
                  <div className="flex flex-col pb-5 mt-5">
                    <p className="text-black font-bold text-xl">
                      Item Description
                    </p>
                    
                    {!showCustomDescription && availableDescriptions.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Choose from existing descriptions:</p>
                        <div className="space-y-2">
                          {availableDescriptions.map((desc, index) => (
                            <button
                              key={index}
                              onClick={() => setDescription(desc)}
                              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                description === desc
                                  ? 'border-[#5F22D9] bg-[#5F22D9]/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <p className="text-sm text-gray-700">{desc}</p>
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setShowCustomDescription(true)}
                          className="mt-3 text-[#5F22D9] text-sm font-medium hover:underline"
                        >
                          + Add custom description
                        </button>
                      </div>
                    )}

                    {showCustomDescription && (
                      <div>
                        <Textarea
                          className="block w-full placeholder:font-bold resize-none rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5F22D9]"
                          rows={4}
                          placeholder="Enter your custom description..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                        {availableDescriptions.length > 0 && (
                          <button
                            onClick={() => setShowCustomDescription(false)}
                            className="mt-2 text-[#5F22D9] text-sm font-medium hover:underline"
                          >
                            ← Choose from existing descriptions
                          </button>
                        )}
                      </div>
                    )}

                    {availableDescriptions.length === 0 && (
                      <Textarea
                        className="block w-full placeholder:font-bold resize-none rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5F22D9]"
                        rows={4}
                        placeholder="Enter item description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    )}
                  </div>

                  {/* Diet Selection */}
                  <div className="flex justify-between items-center mt-4 w-full">
                    <span className="text-lg font-semibold min-w-36">
                      Diet Options:
                    </span>
                    <div className="flex w-full justify-end items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isVeg}
                          onChange={() => setIsVeg(!isVeg)}
                          className="w-5 h-5 text-[#5F22D9] bg-gray-200 border-gray-400 rounded focus:ring-[#5F22D9]"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Veg
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isNonVeg}
                          onChange={() => setIsNonVeg(!isNonVeg)}
                          className="w-5 h-5 text-[#5F22D9] bg-gray-200 border-gray-400 rounded focus:ring-[#5F22D9]"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Non-Veg
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Servings Section */}
                  <div className="mt-6 space-y-4">
                    <p className="text-black font-bold text-xl">
                      Servings Left
                    </p>
                    
                    {isVeg && (
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-2">
                          Veg Servings
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={vegServings}
                          onChange={(e) => setVegServings(parseInt(e.target.value) || 0)}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5F22D9]"
                          placeholder="Enter veg servings count"
                        />
                      </div>
                    )}

                    {isNonVeg && (
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-2">
                          Non-Veg Servings
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={nonVegServings}
                          onChange={(e) => setNonVegServings(parseInt(e.target.value) || 0)}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5F22D9]"
                          placeholder="Enter non-veg servings count"
                        />
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6">
                    <button
                      onClick={handleSubmitBag}
                      className="flex justify-center bg-[#5F22D9] text-white font-semibold py-3 rounded-lg hover:bg-[#4A1BB8] gap-2 w-full transition-colors"
                    >
                      {loading && (
                        <div className="animate-spin flex items-center justify-center">
                          {whiteLoader}
                        </div>
                      )}
                      {loading ? "Adding..." : "Add Item"}
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
