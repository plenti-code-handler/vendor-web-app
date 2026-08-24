"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axiosClient from "../../AxiosClient";
import { fetchCatalogue } from "../../redux/slices/catalogueSlice";
import { selectVendorData } from "../../redux/slices/vendorSlice";
import { getAvailableCategories, getDescriptionsForDropdown } from "../../utility/bagDrawerUtils";
import { useBackToClose } from "../../hooks/useBackToCloseModal";
import ItemTypeFilter from "../dropdowns/ItemTypeFilter";
import InfoIcon from "../common/InfoIcon";
import BagBottomSheet from "./components/BagBottomSheet";
import DrawerHeader from "./components/DrawerHeader";
import AllergensSection from "./components/AllergensSection";
import DescriptionSection from "./components/DescriptionSection";
import TimingSection from "./components/TimingSection";
import PrimaryButton from "../buttons/PrimaryButton";

const CreateTemplateDrawer = ({ open, onClose, onCreated }) => {
  const dispatch = useDispatch();
  const [selectedBag, setSelectedBag] = useState("");
  const [selectedPricingId, setSelectedPricingId] = useState("default");
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [description, setDescription] = useState("");
  const [windowDuration, setWindowDuration] = useState(60);
  const [bestBeforeDuration, setBestBeforeDuration] = useState(60);
  const [loading, setLoading] = useState(false);

  const vendorData = useSelector(selectVendorData);
  const pricing = useSelector((state) => state.catalogue.pricing);
  const availableDescriptions = vendorData?.item_descriptions || [];
  const availableCategories = getAvailableCategories(pricing);
  const dummyStart = useMemo(() => new Date(), []);
  const dummyEnd = useMemo(
    () => new Date(dummyStart.getTime() + windowDuration * 60000),
    [dummyStart, windowDuration]
  );
  const dummyBestBefore = useMemo(
    () => new Date(dummyEnd.getTime() + bestBeforeDuration * 60000),
    [dummyEnd, bestBeforeDuration]
  );

  const descriptionsForDropdown = useMemo(
    () => getDescriptionsForDropdown(selectedPricingId, selectedBag, pricing, availableDescriptions),
    [selectedPricingId, selectedBag, pricing, availableDescriptions]
  );

  useEffect(() => {
    if (open) dispatch(fetchCatalogue());
  }, [dispatch, open]);

  useEffect(() => {
    if (availableCategories.length > 0 && !selectedBag) {
      setSelectedBag(availableCategories[0]);
    }
  }, [availableCategories, selectedBag]);

  const handlePricingChange = useCallback((pricingId) => {
    setSelectedPricingId(pricingId);
    setDescription("");
  }, []);

  const resetForm = () => {
    setSelectedBag(availableCategories[0] || "");
    setSelectedPricingId("default");
    setSelectedAllergens([]);
    setDescription("");
    setWindowDuration(60);
    setBestBeforeDuration(60);
  };

  const handleClose = useCallback(() => {
    setLoading(false);
    onClose?.();
  }, [onClose]);

  useBackToClose(open, handleClose);

  const handleSubmit = async () => {
    if (!selectedBag) {
      toast.error("Please select an item type.");
      return;
    }
    if (!description?.trim()) {
      toast.error("Please fill the description.");
      return;
    }
    if (!windowDuration || windowDuration <= 0) {
      toast.error("Please set a pickup window duration.");
      return;
    }

    try {
      setLoading(true);
      await axiosClient.post("/v2/vendor/item/template", {
        description: description.trim(),
        item_type: selectedBag,
        pricing_id: selectedPricingId || "default",
        window_duration: windowDuration,
        best_before_duration: bestBeforeDuration || 0,
        allergens: selectedAllergens || [],
      });
      toast.success("Template created successfully");
      resetForm();
      handleClose();
      onCreated?.();
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to create template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BagBottomSheet open={open} onClose={handleClose}>
      <div className="shrink-0 px-4">
        <DrawerHeader
          title="Create template"
          subtitle="Save a bag setup you can go live with in two clicks"
          onClose={handleClose}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-6 bg-gradient-to-br from-gray-50 to-white">
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
          windowStartTime={dummyStart}
          windowEndTime={dummyEnd}
          bestBeforeTime={dummyBestBefore}
          handleStartTimeChange={() => {}}
          windowDuration={windowDuration}
          setWindowDuration={setWindowDuration}
          bestBeforeDuration={bestBeforeDuration}
          setBestBeforeDuration={setBestBeforeDuration}
          showStartTime={false}
        />

        <DescriptionSection
          description={description}
          setDescription={setDescription}
          availableDescriptions={descriptionsForDropdown}
          pricingId={selectedPricingId}
        />

        <div className="mt-8 mb-2">
          <PrimaryButton
            loading={loading}
            disabled={availableCategories.length === 0}
            onClick={handleSubmit}
            loadingText="Saving template..."
            fullWidth
            className="w-full"
          >
            Save template
          </PrimaryButton>
        </div>
      </div>
    </BagBottomSheet>
  );
};

export default CreateTemplateDrawer;
