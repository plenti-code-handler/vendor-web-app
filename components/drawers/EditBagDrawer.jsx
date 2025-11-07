"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import ItemTypeFilter from "../dropdowns/ItemTypeFilter";
import { useEffect, useState } from "react";
import axiosClient from "../../AxiosClient";
import { toast } from "sonner";
import { setOpenDrawer } from "../../redux/slices/editBagSlice";
import { fetchAllBags } from "../../redux/slices/bagsSlice";
import InfoIcon from '../common/InfoIcon';
import { selectVendorData } from '../../redux/slices/vendorSlice';
import { 
  getRequiredFields, 
  validateTimeConstraints, 
  handleStartTimeChange as handleStartTimeChangeUtil,
  handleEndTimeChange as handleEndTimeChangeUtil,
  handleBestBeforeTimeChange as handleBestBeforeTimeChangeUtil,
  getAvailableCategories
} from '../../utility/bagDrawerUtils';

// Import reusable components
import DrawerHeader from './components/DrawerHeader';
import AllergensSection from './components/AllergensSection';
import DescriptionSection from './components/DescriptionSection';
import TimingSection from './components/TimingSection';
import DietSection from './components/DietSection';
import ServingsSection from './components/ServingsSection';
import SubmitButton from './components/SubmitButton';

const EditBagDrawer = () => {
  const [selectedBag, setSelectedBag] = useState();
  const dispatch = useDispatch();
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [isVeg, setIsVeg] = useState(true);
  const [isNonVeg, setIsNonVeg] = useState(false);
  const [description, setDescription] = useState("");
  const [vegServings, setVegServings] = useState(0);
  const [nonVegServings, setNonVegServings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [windowStartTime, setWindowStartTime] = useState(new Date());
  const [windowDuration, setWindowDuration] = useState(60); // Add this
  const [bestBeforeDuration, setBestBeforeDuration] = useState(60); // Add this
  const [showCustomDescription, setShowCustomDescription] = useState(false);
  const { bagToEdit } = useSelector((state) => state.editBag);
  const { itemTypes } = useSelector((state) => state.catalogue);
  const vendorData = useSelector(selectVendorData);
  const availableDescriptions = vendorData?.item_descriptions || [];

  // Calculate end times from durations
  const windowEndTime = new Date(windowStartTime.getTime() + windowDuration * 60000);
  const bestBeforeTime = new Date(windowEndTime.getTime() + bestBeforeDuration * 60000);

  useEffect(() => {
    if (bagToEdit) {
      setSelectedAllergens(bagToEdit.allergens || []);
      setSelectedBag(bagToEdit.item_type);
      setDescription(bagToEdit.description || "");
      setVegServings(bagToEdit.veg_servings_current || 0);
      setNonVegServings(bagToEdit.non_veg_servings_current || 0);
      
      // Calculate durations from existing times
      const startTime = bagToEdit.window_start_time ? new Date(bagToEdit.window_start_time * 1000) : new Date();
      const endTime = bagToEdit.window_end_time ? new Date(bagToEdit.window_end_time * 1000) : new Date();
      const beforeTime = bagToEdit.best_before_time ? new Date(bagToEdit.best_before_time * 1000) : new Date();
      
      setWindowStartTime(startTime);
      
      // Calculate durations in minutes
      const calculatedWindowDuration = Math.round((endTime - startTime) / 60000);
      const calculatedBestBeforeDuration = Math.round((beforeTime - endTime) / 60000);
      
      setWindowDuration(calculatedWindowDuration > 0 ? calculatedWindowDuration : 60);
      setBestBeforeDuration(calculatedBestBeforeDuration > 0 ? calculatedBestBeforeDuration : 60);
      
      // Set diet options based on existing data
      setIsVeg(bagToEdit.veg || false);
      setIsNonVeg(bagToEdit.non_veg || false);
    }
  }, [bagToEdit]);

  const availableCategories = getAvailableCategories(itemTypes);

  // Simplified time change handler
  const handleStartTimeChange = (date) => {
    setWindowStartTime(date);
  };

  const handleEditBag = async () => {
    try {
      setLoading(true);

      const timeError = validateTimeConstraints(windowStartTime, windowEndTime, bestBeforeTime);
      if (timeError) {
        toast.error(timeError);
        setLoading(false);
        return;
      }

      // Validation using utility function
      const requiredFields = getRequiredFields(selectedBag, description, isVeg, isNonVeg, vegServings, nonVegServings);

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
        allergens: selectedAllergens || [],
      };

      const response = await axiosClient.patch(
        `/v1/vendor/item/update?item_id=${bagToEdit.id}`,
        payload
      );

      if (response.status === 200) {
        toast.success("Item updated successfully!");
        dispatch(setOpenDrawer(false));
        dispatch(fetchAllBags());
      }

    } catch (error) {
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
                  <DrawerHeader 
                    title="Edit Item"
                    subtitle="Update your food item details"
                    onClose={handleClose}
                  />

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

                  <AllergensSection 
                    selectedAllergens={selectedAllergens}
                    setSelectedAllergens={setSelectedAllergens}
                  />

                  <TimingSection 
                    windowStartTime={windowStartTime}
                    windowEndTime={windowEndTime}
                    bestBeforeTime={bestBeforeTime}
                    handleStartTimeChange={handleStartTimeChange}
                    windowDuration={windowDuration}
                    setWindowDuration={setWindowDuration}
                    bestBeforeDuration={bestBeforeDuration}
                    setBestBeforeDuration={setBestBeforeDuration}
                  />

                  <DescriptionSection 
                    description={description}
                    setDescription={setDescription}
                    showCustomDescription={showCustomDescription}
                    setShowCustomDescription={setShowCustomDescription}
                    availableDescriptions={availableDescriptions}
                  />

                  <DietSection 
                    isVeg={isVeg}
                    setIsVeg={setIsVeg}
                    isNonVeg={isNonVeg}
                    setIsNonVeg={setIsNonVeg}
                  />

                  <ServingsSection 
                    isVeg={isVeg}
                    isNonVeg={isNonVeg}
                    vegServings={vegServings}
                    setVegServings={setVegServings}
                    nonVegServings={nonVegServings}
                    setNonVegServings={setNonVegServings}
                    isEdit={true}
                  />

                  <SubmitButton 
                    loading={loading}
                    disabled={false}
                    onClick={handleEditBag}
                    loadingText="Updating Item..."
                    buttonText="Update Item"
                    availableCategories={availableCategories}
                  />
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