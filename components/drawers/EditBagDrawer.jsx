"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Textarea,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
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
import { ALL_ITEM_TYPES, ITEM_TYPE_DISPLAY_NAMES, ITEM_TYPE_ICONS, ITEM_TYPE_DESCRIPTIONS } from '../../constants/itemTypes';

const EditBagDrawer = () => {
  const [selectedBag, setSelectedBag] = useState();
  const dispatch = useDispatch();
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
  const { bagToEdit } = useSelector((state) => state.editBag);
  const { itemTypes } = useSelector((state) => state.catalogue);

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

  useEffect(() => {
    if (bagToEdit) {
      setSelectedTags(bagToEdit.tags || []);
      setSelectedBag(bagToEdit.item_type);
      setDescription(bagToEdit.description || "");
      setVegServings(bagToEdit.veg_servings_current || 0);
      setNonVegServings(bagToEdit.non_veg_servings_current || 0);
      setWindowStartTime(bagToEdit.window_start_time ? new Date(bagToEdit.window_start_time * 1000) : new Date());
      setWindowEndTime(bagToEdit.window_end_time ? new Date(bagToEdit.window_end_time * 1000) : new Date());
      
      // Set diet options based on existing data
      setIsVeg(bagToEdit.veg || false);
      setIsNonVeg(bagToEdit.non_veg || false);
    }
  }, [bagToEdit]);

  const getAvailableCategories = () => {
    return ALL_ITEM_TYPES.filter(itemType => {
      const catalogueItem = itemTypes[itemType];
      console.log(catalogueItem);
      return catalogueItem && catalogueItem.bags && Object.keys(catalogueItem.bags).length > 0;
    });
  };

  const availableCategories = getAvailableCategories();

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

  const handleEditBag = async () => {
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

      const payload = {
        item_type: selectedBag,
        description: description,
        window_start_time: Math.floor(windowStartTime.getTime() / 1000),
        window_end_time: Math.floor(windowEndTime.getTime() / 1000),
        veg: isVeg,
        non_veg: isNonVeg,
        veg_servings_current: vegServings,
        non_veg_servings_current: nonVegServings,
        tags: selectedTags,
      };

      console.log(payload);

      const response = await axiosClient.patch(
        `/v1/vendor/item/update?item_id=${bagToEdit.id}`,
        payload
      );

      if (response.status === 200) {
        toast.success("Item updated successfully!");
        dispatch(setOpenDrawer(false));
        dispatch(fetchAllBags());
      }

      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update item!");
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
                      Current Servings
                    </p>
                    
                    {isVeg && (
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-2">
                          Veg Servings (Current)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={vegServings}
                          onChange={(e) => setVegServings(parseInt(e.target.value) || 0)}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5F22D9]"
                          placeholder="Enter current veg servings count"
                        />
                      </div>
                    )}

                    {isNonVeg && (
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-2">
                          Non-Veg Servings (Current)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={nonVegServings}
                          onChange={(e) => setNonVegServings(parseInt(e.target.value) || 0)}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5F22D9]"
                          placeholder="Enter current non-veg servings count"
                        />
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6">
                    <button
                      disabled={availableCategories.length === 0}
                      onClick={handleEditBag}
                      className={`flex justify-center bg-[#5F22D9] text-white font-semibold py-3 rounded-lg hover:bg-[#4A1BB8] gap-2 w-full transition-colors 
                        ${availableCategories.length === 0 ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer"}`}
                    >
                      {loading && (
                        <div className="animate-spin flex items-center justify-center">
                          {whiteLoader}
                        </div>
                      )}
                      {loading ? "Updating..." : "Update Item"}
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