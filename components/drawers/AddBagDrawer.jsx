"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDrawer } from "../../redux/slices/addBagSlice";
import ItemTypeFilter from "../dropdowns/ItemTypeFilter";
import { useEffect, useState } from "react";
import axiosClient from "../../AxiosClient";
import { toast } from "sonner";
import { fetchAllBags } from "../../redux/slices/bagsSlice";
import { fetchCatalogue } from "../../redux/slices/catalogueSlice";
import InfoIcon from '../common/InfoIcon';
import { selectVendorData } from '../../redux/slices/vendorSlice';
import { 
  getRequiredFields, 
  validateTimeConstraints, 
  handleStartTimeChange as handleStartTimeChangeUtil,
  handleEndTimeChange as handleEndTimeChangeUtil,
  handleBestBeforeTimeChange as handleBestBeforeTimeChangeUtil,
  getResetFormValues,
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

const AddBagDrawer = () => {
  const dispatch = useDispatch();
  const [selectedBag, setSelectedBag] = useState("");
  const [selectedAllergens, setSelectedAllergens] = useState([]);
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
  const [currentStep, setCurrentStep] = useState(1);
  
  // Get vendor data and catalogue from Redux
  const vendorData = useSelector(selectVendorData);
  const { itemTypes } = useSelector((state) => state.catalogue);
  const availableDescriptions = vendorData?.item_descriptions || [];

  // Fetch catalogue data
  useEffect(() => {
    dispatch(fetchCatalogue());
  }, [dispatch]);

  // Initialize time values
  useEffect(() => {
    const initialEndTime = new Date(windowStartTime.getTime() + 30 * 60000);
    setWindowEndTime(initialEndTime);
    const initialBestBeforeTime = new Date(initialEndTime.getTime() + 60 * 60000);
    setBestBeforeTime(initialBestBeforeTime);
  }, []);

  // Time change handlers using utility functions
  const handleStartTimeChange = (date) => {
    handleStartTimeChangeUtil(date, setWindowStartTime, setWindowEndTime, setBestBeforeTime);
  };

  const handleEndTimeChange = (date) => {
    handleEndTimeChangeUtil(date, windowStartTime, setWindowEndTime, setBestBeforeTime, toast);
  };

  const handleBestBeforeTimeChange = (date) => {
    handleBestBeforeTimeChangeUtil(date, windowEndTime, setBestBeforeTime, toast);
  };

  const availableCategories = getAvailableCategories(itemTypes);

  const resetForm = () => {
    const resetValues = getResetFormValues();
    setSelectedBag(resetValues.selectedBag);
    setSelectedAllergens(resetValues.selectedAllergens);
    setDescription(resetValues.description);
    setVegServings(resetValues.vegServings);
    setNonVegServings(resetValues.nonVegServings);
    setWindowStartTime(resetValues.windowStartTime);
    setWindowEndTime(resetValues.windowEndTime);
    setBestBeforeTime(resetValues.bestBeforeTime);
    setIsVeg(resetValues.isVeg);
    setIsNonVeg(resetValues.isNonVeg);
    setShowCustomDescription(resetValues.showCustomDescription);
    setCurrentStep(resetValues.currentStep);
  };

  const handleSubmitBag = async () => {
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

      const newItem = {
        item_type: selectedBag,
        window_start_time: Math.floor(windowStartTime.getTime() / 1000),
        window_end_time: Math.floor(windowEndTime.getTime() / 1000),
        best_before_time: Math.floor(bestBeforeTime.getTime() / 1000),
        description: description,
        veg: isVeg,
        non_veg: isNonVeg,
        veg_servings_start: vegServings,
        non_veg_servings_start: nonVegServings,
        allergens: selectedAllergens || [],
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
              <div className="flex h-full flex-col overflow-y-scroll bg-gradient-to-br from-gray-50 to-white py-6 shadow-2xl">
                <div className="relative flex-1 px-6">
                  <DrawerHeader 
                    title="Add New Item"
                    subtitle="Create a new food item for your customers"
                    onClose={handleClose}
                  />

                  {/* Item Type Section */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Choose Item Type</h3>
                      <InfoIcon content="Select the category of food item you're creating" />
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
                    setWindowStartTime={setWindowStartTime}
                    windowEndTime={windowEndTime}
                    setWindowEndTime={setWindowEndTime}
                    bestBeforeTime={bestBeforeTime}
                    setBestBeforeTime={setBestBeforeTime}
                    handleStartTimeChange={handleStartTimeChange}
                    handleEndTimeChange={handleEndTimeChange}
                    handleBestBeforeTimeChange={handleBestBeforeTimeChange}
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
                    isEdit={false}
                  />

                  <SubmitButton 
                    loading={loading}
                    disabled={false}
                    onClick={handleSubmitBag}
                    loadingText="Creating Item..."
                    buttonText="Create Item"
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

export default AddBagDrawer;
