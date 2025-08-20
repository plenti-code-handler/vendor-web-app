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
import InfoIcon from '../common/InfoIcon';
import { selectVendorData } from '../../redux/slices/vendorSlice';

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
  const [bestBeforeTime, setBestBeforeTime] = useState(new Date());
  const [showCustomDescription, setShowCustomDescription] = useState(false);
  const { bagToEdit } = useSelector((state) => state.editBag);
  const { itemTypes } = useSelector((state) => state.catalogue);
  const vendorData = useSelector(selectVendorData);
  const availableDescriptions = vendorData?.item_descriptions || [];



  useEffect(() => {
    if (bagToEdit) {
      setSelectedTags(bagToEdit.tags || []);
      setSelectedBag(bagToEdit.item_type);
      setDescription(bagToEdit.description || "");
      setVegServings(bagToEdit.veg_servings_current || 0);
      setNonVegServings(bagToEdit.non_veg_servings_current || 0);
      setWindowStartTime(bagToEdit.window_start_time ? new Date(bagToEdit.window_start_time * 1000) : new Date());
      setWindowEndTime(bagToEdit.window_end_time ? new Date(bagToEdit.window_end_time * 1000) : new Date());
      setBestBeforeTime(bagToEdit.best_before_time ? new Date(bagToEdit.best_before_time * 1000) : new Date());
      
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
    // Set best before time to 1 hour after window end time
    const newBestBeforeTime = new Date(newEndTime.getTime() + 60 * 60000);
    setBestBeforeTime(newBestBeforeTime);
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
    // Update best before time to 1 hour after new end time
    const newBestBeforeTime = new Date(date.getTime() + 60 * 60000);
    setBestBeforeTime(newBestBeforeTime);
  };

  const resetForm = () => {
    setSelectedBag("MEAL");
    setSelectedTags([]);
    setDescription("");
    setVegServings(0);
    setNonVegServings(0);
    setWindowStartTime(new Date());
    setWindowEndTime(new Date());
    setBestBeforeTime(new Date());
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
        best_before_time: Math.floor(bestBeforeTime.getTime() / 1000),
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
              <div className="flex h-full flex-col overflow-y-scroll bg-gradient-to-br from-gray-50 to-white py-6 shadow-2xl">
                <div className="relative flex-1 px-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Edit Item</h2>
                      <p className="text-sm text-gray-500 mt-1">Update your food item details</p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
                    >
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Item Type Section */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Choose Item Type</h3>
                      <InfoIcon content="Select the category of food item you're editing" />
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <ItemTypeFilter
                        selectedFilter={selectedBag}
                        onFilterChange={setSelectedBag}
                      />
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Item Tags</h3>
                      <InfoIcon content="Add relevant tags to help customers find your item" />
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <ItemTagsFilter
                        selectedFilter={selectedTags}
                        onFilterChange={setSelectedTags}
                      />
                    </div>
                  </div>

                  {/* Timing Section */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Timing & Availability</h3>
                      <InfoIcon content="Set when customers can pick up and when food expires" />
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Window Start Time</label>
                        <DatePicker
                          selected={windowStartTime}
                          onChange={handleStartTimeChange}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="MMM d, yyyy h:mm aa"
                          minDate={new Date()}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Window End Time</label>
                        <DatePicker
                          selected={windowEndTime}
                          onChange={handleEndTimeChange}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="MMM d, yyyy h:mm aa"
                          minDate={windowStartTime}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Best Before Time</label>
                        <DatePicker
                          selected={bestBeforeTime}
                          onChange={(date) => setBestBeforeTime(date)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="MMM d, yyyy h:mm aa"
                          minDate={windowEndTime}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Item Description</h3>
                      <InfoIcon content="Describe your item to attract customers" />
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                      {!showCustomDescription && availableDescriptions.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-3">Choose from existing descriptions:</p>
                          <div className="space-y-2 mb-4">
                            {availableDescriptions.map((desc, index) => (
                              <button
                                key={index}
                                onClick={() => setDescription(desc)}
                                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                                  description === desc
                                    ? 'border-[#5F22D9] bg-[#5F22D9]/5 shadow-sm'
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                }`}
                              >
                                <p className="text-sm text-gray-700">{desc}</p>
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setShowCustomDescription(true)}
                            className="text-[#5F22D9] text-sm font-medium hover:underline transition-colors duration-200"
                          >
                            + Add custom description
                          </button>
                        </div>
                      )}

                      {showCustomDescription && (
                        <div>
                          <Textarea
                            className="block w-full resize-none rounded-lg border border-gray-200 py-3 px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
                            rows={4}
                            placeholder="Enter your custom description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                          {availableDescriptions.length > 0 && (
                            <button
                              onClick={() => setShowCustomDescription(false)}
                              className="mt-3 text-[#5F22D9] text-sm font-medium hover:underline transition-colors duration-200"
                            >
                              ← Choose from existing descriptions
                            </button>
                          )}
                        </div>
                      )}

                      {availableDescriptions.length === 0 && (
                        <Textarea
                          className="block w-full resize-none rounded-lg border border-gray-200 py-3 px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
                          rows={4}
                          placeholder="Enter item description..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      )}
                    </div>
                  </div>

                  {/* Diet Selection */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Diet Options</h3>
                      <InfoIcon content="Choose dietary preferences for your item" />
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center space-x-8">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={isVeg}
                            onChange={() => setIsVeg(!isVeg)}
                            className="w-5 h-5 text-[#5F22D9] bg-gray-100 border-gray-300 rounded focus:ring-[#5F22D9] focus:ring-2"
                          />
                          <span className="text-sm font-medium text-gray-700">Vegetarian</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={isNonVeg}
                            onChange={() => setIsNonVeg(!isNonVeg)}
                            className="w-5 h-5 text-[#5F22D9] bg-gray-100 border-gray-300 rounded focus:ring-[#5F22D9] focus:ring-2"
                          />
                          <span className="text-sm font-medium text-gray-700">Non-Vegetarian</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Servings Section */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Current Servings</h3>
                      <InfoIcon content="Set the current number of servings available for each diet type" />
                    </div>
                    <div className="space-y-4">
                      {isVeg && (
                        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vegetarian Servings (Current)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={vegServings}
                            onChange={(e) => setVegServings(parseInt(e.target.value) || 0)}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
                            placeholder="Enter current vegetarian servings"
                          />
                        </div>
                      )}

                      {isNonVeg && (
                        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Non-Vegetarian Servings (Current)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={nonVegServings}
                            onChange={(e) => setNonVegServings(parseInt(e.target.value) || 0)}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200"
                            placeholder="Enter current non-vegetarian servings"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-8 mb-6">
                    <button
                      disabled={availableCategories.length === 0 || loading}
                      onClick={handleEditBag}
                      className={`flex justify-center items-center bg-gradient-to-r from-[#5F22D9] to-[#7C3AED] text-white font-semibold py-4 rounded-xl hover:from-[#4A1BB8] hover:to-[#6B21A8] gap-3 w-full transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl ${
                        availableCategories.length === 0 || loading ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer"
                      }`}
                    >
                      {loading && (
                        <div className="animate-spin flex items-center justify-center">
                          {whiteLoader}
                        </div>
                      )}
                      {loading ? "Updating Item..." : "Update Item"}
                    </button>
                    
                    {availableCategories.length === 0 && (
                      <p className="text-center text-sm text-gray-500 mt-3">
                        No item types available. Please contact support.
                      </p>
                    )}
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