"use client";
import { useDispatch, useSelector } from "react-redux";
import ItemTypeFilter from "../dropdowns/ItemTypeFilter";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useBackToClose } from "../../hooks/useBackToCloseModal";
import axiosClient from "../../AxiosClient";
import { toast } from "sonner";
import { setOpenDrawer } from "../../redux/slices/editBagSlice";
import { fetchAllBags } from "../../redux/slices/bagsSlice";
import InfoIcon from '../common/InfoIcon';
import { selectVendorData } from '../../redux/slices/vendorSlice';
import {
  getRequiredFields,
  validateTimeConstraints,
  getAvailableCategories,
  getDescriptionsForDropdown,
  isPickupEndOutsideStoreHours,
  PICKUP_OUTSIDE_HOURS_MESSAGE,
} from '../../utility/bagDrawerUtils';

// Import reusable components
import BagBottomSheet from './components/BagBottomSheet';
import DrawerHeader from './components/DrawerHeader';
import AllergensSection from './components/AllergensSection';
import DescriptionSection from './components/DescriptionSection';
import TimingSection from './components/TimingSection';
import ServingsSection from './components/ServingsSection';
import PrimaryButton from '../buttons/PrimaryButton';
import StatusResultModal from '../modals/StatusResultModal';

const EditBagDrawer = () => {
  const [selectedBag, setSelectedBag] = useState();
  const [selectedPricingId, setSelectedPricingId] = useState("default");
  const dispatch = useDispatch();
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [description, setDescription] = useState("");
  const [vegServings, setVegServings] = useState(0);
  const [nonVegServings, setNonVegServings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [windowStartTime, setWindowStartTime] = useState(new Date());
  const [windowDuration, setWindowDuration] = useState(60); // Add this
  const [bestBeforeDuration, setBestBeforeDuration] = useState(60); // Add this
  const [showHoursWarning, setShowHoursWarning] = useState(false);
  const { bagToEdit, templateItem } = useSelector((state) => state.editBag);
  const open = useSelector((state) => state.editBag.drawerOpen);
  const pricing = useSelector((state) => state.catalogue.pricing);
  const vendorData = useSelector(selectVendorData);
  const availableDescriptions = vendorData?.item_descriptions || [];

  const descriptionsForDropdown = useMemo(
    () => getDescriptionsForDropdown(selectedPricingId, selectedBag, pricing, availableDescriptions),
    [selectedPricingId, selectedBag, pricing, availableDescriptions]
  );

  // Calculate end times from durations
  const windowEndTime = new Date(windowStartTime.getTime() + windowDuration * 60000);
  const bestBeforeTime = new Date(windowEndTime.getTime() + bestBeforeDuration * 60000);
  const pickupEndOutsideStoreHours = useMemo(
    () => isPickupEndOutsideStoreHours(windowEndTime, vendorData?.opening_hours),
    [windowEndTime, vendorData?.opening_hours]
  );

  useEffect(() => {
    if (bagToEdit) {
      setSelectedAllergens(bagToEdit.allergens || []);
      setSelectedBag(bagToEdit.item_type);
      setSelectedPricingId(bagToEdit.pricing_id ?? "default");
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
    } else if (templateItem) {
      // Logic for creating from template
      setSelectedAllergens(templateItem.allergens || []);
      setSelectedBag(templateItem.item_type);
      setSelectedPricingId(templateItem.pricing_id ?? "default");
      setDescription(templateItem.description || "");
      setVegServings(templateItem.veg_servings_start || 0);
      setNonVegServings(templateItem.non_veg_servings_start || 0);

      // Reset times for new item creation
      const tenMinutesFromNow = new Date(Date.now() + 10 * 60000);
      setWindowStartTime(tenMinutesFromNow);
      setWindowDuration(60);
      setBestBeforeDuration(60);
    }
  }, [bagToEdit, templateItem]);

  const availableCategories = getAvailableCategories(pricing);

  // Simplified time change handler
  const handleStartTimeChange = (date) => {
    setWindowStartTime(date);
  };

  const handlePricingChange = useCallback((pricingId) => {
    setSelectedPricingId(pricingId);
    setDescription("");
  }, []);

  const submitBag = async ({ skipHoursCheck = false } = {}) => {
    try {
      setLoading(true);

      if (!skipHoursCheck && pickupEndOutsideStoreHours) {
        setShowHoursWarning(true);
        setLoading(false);
        return;
      }

      const timeError = validateTimeConstraints(
        windowStartTime,
        windowEndTime,
        bestBeforeTime
      );
      if (timeError) {
        toast.error(timeError);
        setLoading(false);
        return;
      }

      // Derive isVeg and isNonVeg from servings
      const isVeg = vegServings > 0;
      const isNonVeg = nonVegServings > 0;

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
        pricing_id: selectedPricingId || "default",
        description: description,
        window_start_time: Math.floor(windowStartTime.getTime() / 1000),
        window_end_time: Math.floor(windowEndTime.getTime() / 1000),
        best_before_time: Math.floor(bestBeforeTime.getTime() / 1000),
        veg: isVeg,
        non_veg: isNonVeg,
        allergens: selectedAllergens || [],
      };

      if (bagToEdit?.id) {
        // Update existing item
        payload.veg_servings_current = vegServings;
        payload.non_veg_servings_current = nonVegServings;

        const response = await axiosClient.patch(
          `/v1/vendor/item/update?item_id=${bagToEdit.id}`,
          payload
        );

        if (response.status === 200) {
          toast.success("Item updated successfully!");
          setShowHoursWarning(false);
          dispatch(setOpenDrawer(false));
          dispatch(fetchAllBags({ active: true }));
        }
      } else {
        // Create new item (from template)
        payload.veg_servings_start = vegServings;
        payload.non_veg_servings_start = nonVegServings;

        const response = await axiosClient.post(
          "/v1/vendor/item/create",
          payload
        );

        if (response.status === 200) {
          toast.success("Item created successfully!");
          setShowHoursWarning(false);
          dispatch(setOpenDrawer(false));
          dispatch(fetchAllBags({ active: true }));
        }
      }

    } catch (error) {
      toast.error(bagToEdit?.id ? "Failed to update item!" : "Failed to create item!");
      console.error("Error submitting item: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => submitBag();

  const handleConfirmOutsideHours = () => submitBag({ skipHoursCheck: true });

  const handleClose = useCallback(() => {
    dispatch(setOpenDrawer(false));
  }, [dispatch]);

  useBackToClose(open, handleClose);

  return (
    <>
      <BagBottomSheet open={open} onClose={handleClose}>
        <div className="shrink-0 px-4">
          <DrawerHeader
            title="Edit Item"
            subtitle={bagToEdit?.id ? "Update your food item details" : "Create a new item based on this template"}
            onClose={handleClose}
          />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-6 bg-gradient-to-br from-gray-50 to-white">
          {/* Item Type Section — read-only in edit drawer */}
          <fieldset
            disabled
            className="mb-8 border-0 p-0 m-0 min-w-0 opacity-60 pointer-events-none"
          >
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Choose Item Type</h3>
              <InfoIcon content="Select the category of food item you're editing" />
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <ItemTypeFilter
                selectedFilter={selectedBag}
                onFilterChange={setSelectedBag}
                selectedPricingId={selectedPricingId}
                onPricingChange={handlePricingChange}
              />
            </div>
          </fieldset>

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

          <fieldset
            disabled
            className="border-0 p-0 m-0 min-w-0 opacity-60 pointer-events-none"
          >
            <DescriptionSection
              description={description}
              setDescription={setDescription}
              availableDescriptions={descriptionsForDropdown}
              pricingId={selectedPricingId}
            />
          </fieldset>

          <ServingsSection
            vegServings={vegServings}
            setVegServings={setVegServings}
            nonVegServings={nonVegServings}
            setNonVegServings={setNonVegServings}
            isEdit={!!bagToEdit?.id}
          />

          <div className="mt-8 mb-2">
            <PrimaryButton
              loading={loading}
              disabled={availableCategories.length === 0}
              onClick={handleSubmit}
              loadingText={bagToEdit?.id ? "Updating Item..." : "Creating Item..."}
              fullWidth
              className="w-full"
            >
              {bagToEdit?.id ? "Update Item" : "Create Item"}
            </PrimaryButton>
            {availableCategories.length === 0 && (
              <p className="text-center text-sm text-gray-500 mt-3">
                No item types available. Please contact support.
              </p>
            )}
          </div>
        </div>
      </BagBottomSheet>

      <StatusResultModal
        open={showHoursWarning}
        onClose={() => !loading && setShowHoursWarning(false)}
        variant="confirm"
        title="Outside store hours"
        message={PICKUP_OUTSIDE_HOURS_MESSAGE}
        onConfirm={handleConfirmOutsideHours}
        confirmLabel="Continue"
        cancelLabel="Cancel"
        confirmLoading={loading}
        enableBackToClose={false}
        className="relative z-[10000000]"
      />
    </>
  );
};

export default EditBagDrawer;