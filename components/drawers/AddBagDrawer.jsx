"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setOpenDrawer } from "../../redux/slices/addBagSlice";
import ItemTypeFilter from "../dropdowns/ItemTypeFilter";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useBackToClose } from "../../hooks/useBackToCloseModal";
import axiosClient from "../../AxiosClient";
import { toast } from "sonner";
import { fetchAllBags } from "../../redux/slices/bagsSlice";
import { fetchCatalogue } from "../../redux/slices/catalogueSlice";
import { fetchDineinCoupons } from "../../redux/slices/dineinCouponSlice";
import InfoIcon from '../common/InfoIcon';
import { selectVendorData } from '../../redux/slices/vendorSlice';
import {
  getRequiredFields,
  validateTimeConstraints,
  handleStartTimeChange as handleStartTimeChangeUtil,
  handleEndTimeChange as handleEndTimeChangeUtil,
  handleBestBeforeTimeChange as handleBestBeforeTimeChangeUtil,
  getResetFormValues,
  getAvailableCategories,
  getDescriptionsForDropdown,
  isPickupEndOutsideStoreHours,
  PICKUP_OUTSIDE_HOURS_MESSAGE,
} from '../../utility/bagDrawerUtils';

// Import reusable components
import DrawerHeader from './components/DrawerHeader';
import AllergensSection from './components/AllergensSection';
import DescriptionSection from './components/DescriptionSection';
import TimingSection from './components/TimingSection';
import ServingsSection from './components/ServingsSection';
import PrimaryButton from '../buttons/PrimaryButton';
import StatusResultModal from '../modals/StatusResultModal';

function DineinCouponBanner({ activeCoupon, onEdit }) {
  if (activeCoupon) {
    const discountLabel =
      activeCoupon.discount_value === Math.floor(activeCoupon.discount_value)
        ? Math.floor(activeCoupon.discount_value)
        : activeCoupon.discount_value;

    return (
      <button
        type="button"
        onClick={onEdit}
        className="mb-6 flex w-full items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-3.5 py-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-emerald-900">
            {discountLabel}% dine-in coupon active with this bag
          </p>
          <p className="mt-0.5 text-xs text-emerald-800/70">
            Customers earn this offer on their next walk-in after purchase.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-emerald-800">
          Edit
          <ChevronRightIcon className="h-4 w-4" />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onEdit}
      className="mb-6 flex w-full items-center gap-3 rounded-xl border border-slate-200/90 bg-slate-50/90 px-3.5 py-3 text-left transition hover:border-slate-300 hover:bg-slate-100/80"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-700">
          No dine-in coupon active with this bag
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          Turn on a coupon to reward customers on their next visit.
        </p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-slate-600">
        Edit
        <ChevronRightIcon className="h-4 w-4" />
      </span>
    </button>
  );
}

const AddBagDrawer = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedBag, setSelectedBag] = useState("");
  const [selectedPricingId, setSelectedPricingId] = useState("default");
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [description, setDescription] = useState("");
  const [vegServings, setVegServings] = useState(0);
  const [nonVegServings, setNonVegServings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [windowStartTime, setWindowStartTime] = useState(new Date());
  const [windowDuration, setWindowDuration] = useState(60); // Duration in minutes
  const [bestBeforeDuration, setBestBeforeDuration] = useState(60); // Duration in minutes after window ends
  const [showHoursWarning, setShowHoursWarning] = useState(false);
  const open = useSelector((state) => state.addBag.drawerOpen);
  const dineinCoupons = useSelector((state) => state.dineinCoupons.coupons);
  const activeDineinCoupon = useMemo(
    () => dineinCoupons.find((coupon) => coupon.is_active) ?? null,
    [dineinCoupons]
  );


  // Get vendor data and catalogue from Redux
  const vendorData = useSelector(selectVendorData);
  const pricing = useSelector((state) => state.catalogue.pricing);
  const availableDescriptions = vendorData?.item_descriptions || [];

  // Calculate end times
  const windowEndTime = new Date(windowStartTime.getTime() + windowDuration * 60000);
  const bestBeforeTime = new Date(windowEndTime.getTime() + bestBeforeDuration * 60000);
  const pickupEndOutsideStoreHours = useMemo(
    () => isPickupEndOutsideStoreHours(windowEndTime, vendorData?.opening_hours),
    [windowEndTime, vendorData?.opening_hours]
  );

  const availableCategories = getAvailableCategories(pricing);

  const descriptionsForDropdown = useMemo(
    () => getDescriptionsForDropdown(selectedPricingId, selectedBag, pricing, availableDescriptions),
    [selectedPricingId, selectedBag, pricing, availableDescriptions]
  );

  // Fetch catalogue and dine-in coupons when drawer opens
  useEffect(() => {
    if (open) {
      dispatch(fetchCatalogue());
      dispatch(fetchDineinCoupons({ skip: 0, limit: 20 }));
    }
  }, [dispatch, open]);

  // Set default selected bag when drawer opens and categories are available
  useEffect(() => {
    if (availableCategories.length > 0 && !selectedBag) {
      setSelectedBag(availableCategories[0]);
    }
  }, [availableCategories, selectedBag]);

  // Time change handlers using utility functions
  const handleStartTimeChange = (date) => {
    setWindowStartTime(date);
  };

  const handlePricingChange = useCallback((pricingId) => {
    setSelectedPricingId(pricingId);
    setDescription("");
  }, []);

  const resetForm = () => {
    const resetValues = getResetFormValues();
    setSelectedBag(resetValues.selectedBag);
    setSelectedPricingId("default");
    setSelectedAllergens(resetValues.selectedAllergens);
    setDescription(resetValues.description);
    setVegServings(resetValues.vegServings);
    setNonVegServings(resetValues.nonVegServings);
    setWindowStartTime(resetValues.windowStartTime);
    setWindowDuration(60);
    setBestBeforeDuration(60);
  };

  const handleSubmitBag = async () => {
    try {
      setLoading(true);

      if (pickupEndOutsideStoreHours) {
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

      const newItem = {
        item_type: selectedBag,
        pricing_id: selectedPricingId || "default",
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

      if (activeDineinCoupon?.id) {
        newItem.dinein_coupon_id = activeDineinCoupon.id;
      }

      const response = await axiosClient.post(
        "/v1/vendor/item/create",
        newItem
      );
      console.log("bag creation response ->", response);
      if (response.status === 200) {
        toast.success("Item Created Successfully!");
        resetForm();
        dispatch(setOpenDrawer(false));
        dispatch(fetchAllBags({ active: true }));
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

  // Set window start time to 10 minutes from now when drawer opens
  useEffect(() => {
    if (open) {
      const tenMinutesFromNow = new Date(Date.now() + 10 * 60000);
      setWindowStartTime(tenMinutesFromNow);
    }
  }, [open]);

  const handleClose = useCallback(() => {
    setLoading(false);
    dispatch(setOpenDrawer(false));
  }, [dispatch]);

  const handleEditDineinCoupons = useCallback(() => {
    // handleClose();
    handleClose();
    setTimeout(() => {
      router.push("/business/coupons");
    }, 500);
  }, [handleClose, router]);

  useBackToClose(open, handleClose);

  return (
    <>
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

                  <DineinCouponBanner
                    activeCoupon={activeDineinCoupon}
                    onEdit={handleEditDineinCoupons}
                  />

                  {/* Item Type Section */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Choose Item Type</h3>
                      <InfoIcon content="Select the category of food item you're creating" />
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                      <ItemTypeFilter
                        selectedFilter={selectedBag}
                        onFilterChange={setSelectedBag}
                        selectedPricingId={selectedPricingId}
                        onPricingChange={handlePricingChange}
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
                    availableDescriptions={descriptionsForDropdown}
                    pricingId={selectedPricingId}
                  />

                  <ServingsSection
                    vegServings={vegServings}
                    setVegServings={setVegServings}
                    nonVegServings={nonVegServings}
                    setNonVegServings={setNonVegServings}
                    isEdit={false}
                  />

                  <div className="mt-8 mb-6">
                    <PrimaryButton
                      loading={loading}
                      disabled={availableCategories.length === 0}
                      onClick={handleSubmitBag}
                      loadingText="Creating Item..."
                      fullWidth
                      className="w-full"
                    >
                      Create Item
                    </PrimaryButton>
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
    <StatusResultModal
      open={showHoursWarning}
      onClose={() => setShowHoursWarning(false)}
      variant="confirm"
      title="Outside store hours"
      message={PICKUP_OUTSIDE_HOURS_MESSAGE}
      className="relative z-[10000000]"
    />
  </>
  );
};

export default AddBagDrawer;
