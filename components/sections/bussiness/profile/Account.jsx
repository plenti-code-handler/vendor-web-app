import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "../../../fields/TextField";
import { tickSvg } from "../../../../svgs";
import { Textarea } from "@headlessui/react";
import { useLoadScript } from "@react-google-maps/api";
import { removeDuplicateWords } from "../../../../utility/removeDuplicate";
import { toast } from "sonner";
import { 
  selectVendorData, 
  selectVendorLoading, 
  selectVendorError,
  fetchVendorDetails,
  updateVendorDetails,
  uploadVendorDocument,
} from "../../../../redux/slices/vendorSlice";
import {
  processPlaceForVendor,
  resolveOpeningHoursForPlace,
} from "../../../../utility/googlePlacesUtils";
import {
  STORE_CLOSE_TIME_OPTIONS,
  STORE_OPEN_TIME_OPTIONS,
  timeSelectOptionsIncludingValue,
} from "../../../../utility/openingHoursTimeOptions";
import PrimaryButton from "../../../buttons/PrimaryButton";
import SecondaryButton from "../../../buttons/SecondaryButton";
import UpdateEmailModal from "../../../modals/UpdateEmailModal";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const libraries = ["places"]; // Define as constant outside component
const MAX_DOCUMENT_SIZE_KB = 10000;

const Account = () => {
  const dispatch = useDispatch();
  const vendorData = useSelector(selectVendorData);
  const loading = useSelector(selectVendorLoading);
  const error = useSelector(selectVendorError);
  
  const [originalData, setOriginalData] = useState(null); // Store original data for discard
  const [isUpdating, setIsUpdating] = useState(false); // Add loading state for update button
  const [formData, setFormData] = useState({
    vendor_name: "",
    username: "",
    owner_name: "", 
    store_manager_name: "", // Add store_manager_name field
    vendor_type: "",
    gst_number: "",
    fssai_number: "",
    pan_number: "",
    description: "",
    latitude: null,
    longitude: null,
    address_url: "",
    address: "", // Add address field
    phone_number: "",
    service_location: "",  // Add service_location field
    openTime: "",
    closeTime: "",
  });

  const [mapUrl, setMapUrl] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState(""); // Add state for Google Maps URL
  const [updateEmailOpen, setUpdateEmailOpen] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(null);

  const autoCompleteRef = useRef(null);
  const autocompleteInstanceRef = useRef(null);
  const gstFileInputRef = useRef(null);
  const fssaiFileInputRef = useRef(null);

  // Fetch vendor data if not already loaded
  useEffect(() => {
    if (!vendorData) {
      dispatch(fetchVendorDetails());
    }
  }, [dispatch, vendorData]);

  // Update form data when vendor data is loaded
  useEffect(() => {
    if (vendorData) {
      setOriginalData(vendorData);
      setFormData({
        vendor_name: vendorData.vendor_name || "",
        username: vendorData.username || "",
        owner_name: vendorData.owner_name || "", // Add owner_name
        store_manager_name: vendorData.store_manager_name || "", // Add store_manager_name
        vendor_type: vendorData.vendor_type || "",
        gst_number: vendorData.gst_number || "",
        fssai_number: vendorData.fssai_number || "",
        pan_number: vendorData.pan_number || "",
        description: vendorData.description || "",
        latitude: vendorData.latitude || null,
        longitude: vendorData.longitude || null,
        address_url: removeDuplicateWords(vendorData.address_url || ""), // Add fallback
        address: vendorData.address || "", // Add address
        phone_number: vendorData.phone_number || "", // Keep as string for form input
        service_location: vendorData.service_location || "",  // Add service_location
        openTime: vendorData.opening_hours?.openTime || "",
        closeTime: vendorData.opening_hours?.closeTime || "",
      });

      if (vendorData.latitude && vendorData.longitude) {
        setMapUrl(
          `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${vendorData.latitude},${vendorData.longitude}&zoom=14`
        );
      }
    }
  }, [vendorData]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: libraries,
  });

  // Debug Google Maps loading
  useEffect(() => {
    console.log("Google Maps API Status:", {
      isLoaded,
      loadError,
      apiKey: apiKey ? "Present" : "Missing",
      libraries
    });
    
    if (loadError) {
      console.error("Google Maps API Error:", loadError);
      toast.error("Failed to load Google Maps API");
    }
  }, [isLoaded, loadError, apiKey]);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    console.log("isLoaded", isLoaded);
    if (!isLoaded || !autoCompleteRef.current) return;

    try {
      // Clean up previous instance
      if (autocompleteInstanceRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteInstanceRef.current);
      }

      // Create new autocomplete instance
      autocompleteInstanceRef.current = new window.google.maps.places.Autocomplete(
        autoCompleteRef.current,
        { 
          types: ["geocode", "establishment"],
          componentRestrictions: { country: "IN" }, // Restrict to India
          fields: [
            "formatted_address", 
            "geometry", 
            "place_id", 
            "name",
            "url",                   
            "website",               
            "business_status",       
            "types",
            "address_components",
            "opening_hours",
            "utc_offset_minutes",
          ]
        }
      );

      console.log("Autocomplete initialized:", autocompleteInstanceRef.current);

      // Add place_changed listener
      autocompleteInstanceRef.current.addListener("place_changed", () => {
        const place = autocompleteInstanceRef.current.getPlace();
        const applySelection = async () => {
          const processedPlace = processPlaceForVendor(place, apiKey);

          if (!processedPlace) {
            toast.error("Please select a valid address from the suggestions");
            return;
          }

          let hoursPayload = null;
          try {
            hoursPayload = await resolveOpeningHoursForPlace(place);
          } catch (err) {
            console.error("Opening hours resolution failed:", err);
          }

          setGoogleMapsUrl(processedPlace.googleMapsUrl);

          setFormData((prev) => ({
            ...prev,
            address_url: processedPlace.googleMapsUrl,
            address: processedPlace.formattedAddress,
            latitude: processedPlace.latitude,
            longitude: processedPlace.longitude,
            service_location: processedPlace.serviceLocation,
            ...(hoursPayload?.openTime
              ? { openTime: hoursPayload.openTime }
              : {}),
            ...(hoursPayload?.closeTime
              ? { closeTime: hoursPayload.closeTime }
              : {}),
          }));

          setMapUrl(processedPlace.mapEmbedUrl);

          toast.success("Address selected successfully!");
        };

        void applySelection();
      });

    } catch (error) {
      console.error("Error initializing autocomplete:", error);
      toast.error("Failed to initialize address autocomplete");
    }

    // Cleanup function
    return () => {
      if (autocompleteInstanceRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteInstanceRef.current);
        autocompleteInstanceRef.current = null;
      }
    };
  }, [isLoaded]);

  // Discard changes
  const handleDiscardChanges = () => {
    setFormData({
      vendor_name: originalData.vendor_name || "",
      username: originalData.username || "",
      owner_name: originalData.owner_name || "", // Add owner_name
      store_manager_name: originalData.store_manager_name || "", // Add store_manager_name
      vendor_type: originalData.vendor_type || "",
      gst_number: originalData.gst_number || "",
      fssai_number: originalData.fssai_number || "",
      pan_number: originalData.pan_number || "",
      description: originalData.description || "",
      latitude: originalData.latitude || null,
      longitude: originalData.longitude || null,
      address_url: removeDuplicateWords(originalData.address_url || ""), // Add fallback
      address: originalData.address || "", // Add address
      phone_number: originalData.phone_number || "", // Keep as string for form input
      service_location: originalData.service_location || "",  // Add service_location
      openTime:
        originalData.openTime || originalData.opening_hours?.openTime || "",
      closeTime:
        originalData.closeTime || originalData.opening_hours?.closeTime || "",
    });
  };

  // Update API call
  const handleUpdate = async () => {
    try {
      setIsUpdating(true); // Start loading
      
      // Format service_location - ensure it's uppercase and properly formatted
      let formattedServiceLocation = null;
      if (formData.service_location && formData.service_location.trim() !== "") {
        formattedServiceLocation = formData.service_location.trim().toUpperCase();
      }

      const opening_hours =
        formData.openTime?.trim() && formData.closeTime?.trim()
          ? {
              openTime: formData.openTime.trim(),
              closeTime: formData.closeTime.trim(),
            }
          : null;

      const {
        openTime: _openTime,
        closeTime: _closeTime,
        ...formFields
      } = formData;

      // Prepare data for API call - convert empty strings to null for phone_number
      const apiData = {
        ...formFields,
        username: formData.username.trim() === "" ? null : formData.username.trim(),
        phone_number: formData.phone_number.trim() === "" ? null : formData.phone_number.trim(),
        owner_name: formData.owner_name.trim() === "" ? null : formData.owner_name.trim(),
        store_manager_name: formData.store_manager_name.trim() === "" ? null : formData.store_manager_name.trim(),
        gst_number: formData.gst_number.trim() === "" ? null : formData.gst_number.trim(),
        fssai_number: formData.fssai_number.trim() === "" ? null : formData.fssai_number.trim(),
        pan_number: formData.pan_number.trim() === "" ? null : formData.pan_number.trim(),
        description: formData.description.trim() === "" ? null : formData.description.trim(),
        service_location: formattedServiceLocation,
        opening_hours,
      };
      
      const result = await dispatch(updateVendorDetails(apiData)).unwrap();
      console.log("Profile update console", result);
      toast.success("Profile updated successfully!");
      dispatch(fetchVendorDetails());
    } catch (err) {
      console.error("Error updating vendor data:", err);
      toast.error("Failed to update profile.");
    } finally {
      setIsUpdating(false); // Stop loading
    }
  };

  const isFieldMissing = (fieldValue) => {
    return !fieldValue || fieldValue.toString().trim() === "";
  };

  const isDocumentMissing = (documentUrl) =>
    !documentUrl || String(documentUrl).trim() === "";

  const handleDocumentSelect = async (documentType, event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.size > MAX_DOCUMENT_SIZE_KB * 1024) {
      toast.error(`File must be under ${MAX_DOCUMENT_SIZE_KB}KB`);
      return;
    }

    setUploadingDocument(documentType);
    try {
      await dispatch(uploadVendorDocument({ documentType, file })).unwrap();
      toast.success(`${documentType} document uploaded successfully`);
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.detail || `Failed to upload ${documentType} document`;
      toast.error(message);
    } finally {
      setUploadingDocument(null);
    }
  };

  const renderDocumentUploadControl = (documentUrl, documentType, inputRef) => {
      return (
        <div className="flex gap-3 items-center shrink-0">
          {!isDocumentMissing(documentUrl) && (
            <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#5F22D9] underline ml-1">
              View
            </a>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.pdf,application/pdf"
            className="hidden"
            onChange={(e) => handleDocumentSelect(documentType, e)}
          />
          <SecondaryButton
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploadingDocument === documentType}
            className="!px-3 !py-2 text-xs whitespace-nowrap"
          >
            {uploadingDocument === documentType ? "Uploading..." : "Upload"}
          </SecondaryButton>
        </div>
      );
  };

  // Badge component for missing fields
  const MissingBadge = () => (
    <span className="inline-block h-2 w-2 bg-red-500 rounded-full ml-1"></span>
  );

  return (
    <div className="flex flex-col gap-4 pt-6 pb-6">
      <div>
        <h3 className="font-medium ml-1 mb-1 flex items-center">
          Store name
          {isFieldMissing(formData.vendor_name) && <MissingBadge />}
        </h3>
        <TextField
          placeholder="Store Name"
          name="vendor_name"
          value={formData.vendor_name}
          onChange={handleChange}
        />
        <p className="text-xs text-gray-500 mt-1 ml-1">
          This will be displayed name on the Plenti app
        </p>
      </div>

      <div>
        <h3 className="font-medium ml-1 mb-1 flex items-center">
          Username
          {isFieldMissing(formData.username) && <MissingBadge />}
        </h3>
        <TextField
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>
      
      {/* Add Owner Name field */}
      <div>
        <h3 className="font-medium ml-1 mb-1 flex items-center">
          Owner Name
          {isFieldMissing(formData.owner_name) && <MissingBadge />}
        </h3>
        <TextField
          placeholder="Owner Name"
          name="owner_name"
          value={formData.owner_name}
          onChange={handleChange}
        />
      </div>
      
      {/* Add Store Manager Name field */}
      <div>
        <h3 className="font-medium ml-1 mb-1 flex items-center">
          Store Manager Name
          {isFieldMissing(formData.store_manager_name) && <MissingBadge />}
        </h3>
        <TextField
          placeholder="Store Manager Name"
          name="store_manager_name"
          value={formData.store_manager_name}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <h3 className="font-medium ml-1 mb-1">Email</h3>
        <div className="flex justify-between items-center gap-2 w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-3 text-sm text-black min-h-[48px]">
          <p className="font-semibold truncate min-w-0 flex-1">
            {loading ? "Loading..." : vendorData?.email}
          </p>
          <div className="flex gap-2 items-center shrink-0">
            {vendorData?.email_verified && (
              <div className="flex gap-1 items-center">
                <p className="text-primary font-semibold text-xs">Verified</p>
                {tickSvg}
              </div>
            )}
            <SecondaryButton
              type="button"
              onClick={() => setUpdateEmailOpen(true)}
              className="!px-3 !py-2 text-xs whitespace-nowrap"
            >
              Update email
            </SecondaryButton>
          </div>
        </div>
      </div>

      <div className="w-full">
        <h3 className="font-medium ml-1 mb-1 flex items-center">
          Store Type
          {isFieldMissing(formData.vendor_type) && <MissingBadge />}
        </h3>
        <select
          className="rounded-md w-full border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          name="vendor_type"
          value={formData.vendor_type}
          onChange={handleChange}
        >
          <option value="RESTAURANT">Restaurant</option>
          <option value="SUPERMARKET">Super Market</option>
          <option value="BAKERY">Bakery</option>
          <option value="EVENTS">Events</option>
        </select>
      </div>

      <div>
        <h3 className="font-medium ml-1 mb-1 flex items-center">
          GST Number
          {isFieldMissing(formData.gst_number) && <MissingBadge />}
          {isDocumentMissing(vendorData?.gst_document) && <MissingBadge />}
        </h3>
        <div className="flex justify-between items-center gap-2 w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-3 text-sm text-black min-h-[48px]">
          <input
            type="text"
            name="gst_number"
            value={formData.gst_number}
            onChange={handleChange}
            placeholder="GST Number"
            className="font-semibold truncate min-w-0 flex-1 bg-transparent border-0 outline-none focus:ring-0 p-0 text-sm text-black placeholder:text-gray-400"
          />
          <div className="flex gap-2 items-center shrink-0">
            {renderDocumentUploadControl(
              vendorData?.gst_document,
              "GST",
              gstFileInputRef
            )}
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-medium ml-1 mb-1 flex items-center">
          FSSAI Number
          {isFieldMissing(formData.fssai_number) && <MissingBadge />}
          {isDocumentMissing(vendorData?.fssai_document) && <MissingBadge />}
        </h3>
        <div className="flex justify-between items-center gap-2 w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-3 text-sm text-black min-h-[48px]">
          <input
            type="text"
            name="fssai_number"
            value={formData.fssai_number}
            onChange={handleChange}
            placeholder="FSSAI Number"
            className="font-semibold truncate min-w-0 flex-1 bg-transparent border-0 outline-none focus:ring-0 p-0 text-sm text-black placeholder:text-gray-400"
          />
          <div className="flex gap-2 items-center shrink-0">
            {renderDocumentUploadControl(
              vendorData?.fssai_document,
              "FSSAI",
              fssaiFileInputRef
            )}
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-medium ml-1 mb-1 flex items-center">
          PAN Number
          {isFieldMissing(formData.pan_number) && <MissingBadge />}
        </h3>
        <TextField
          placeholder="PAN Number"
          name="pan_number"
          value={formData.pan_number}
          onChange={handleChange}
        />
      </div>
      <div>
        <h3 className="font-medium ml-1 mb-1 flex items-center">
          Phone Number
          {isFieldMissing(formData.phone_number) && <MissingBadge />}
        </h3>
        <TextField
          placeholder="Phone Number"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
        />
      </div>

      <div className="w-full flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <h3 className="font-medium ml-1 mb-1 flex items-center">
            Opening time
            {isFieldMissing(formData.openTime) && <MissingBadge />}
          </h3>
          <select
            className="rounded-md w-full border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
            name="openTime"
            value={formData.openTime}
            onChange={handleChange}
          >
            <option value="">Select open time</option>
            {timeSelectOptionsIncludingValue(
              formData.openTime,
              STORE_OPEN_TIME_OPTIONS
            ).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <h3 className="font-medium ml-1 mb-1 flex items-center">
            Closing time
            {isFieldMissing(formData.closeTime) && <MissingBadge />}
          </h3>
          <select
            className="rounded-md w-full border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
            name="closeTime"
            value={formData.closeTime}
            onChange={handleChange}
          >
            <option value="">Select close time</option>
            {timeSelectOptionsIncludingValue(
              formData.closeTime,
              STORE_CLOSE_TIME_OPTIONS
            ).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-xs text-gray-500 -mt-1 ml-1">
        Filled from Google when you pick an address with hours; editable (hourly).
      </p>

      <div className="w-full">
        <h3 className="font-medium ml-1 mb-1 flex items-center">
          Store Address
          {isFieldMissing(formData.address) && <MissingBadge />}
        </h3>
        <div className="relative">
          <input
            type="text"
            ref={autoCompleteRef}
            className="rounded-md w-full border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
            placeholder={isLoaded ? "Search your business address" : "Loading address search..."}
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={!isLoaded}
          />
          {!isLoaded && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            </div>
          )}
        </div>
        {!isLoaded && (
          <p className="text-xs text-gray-500 mt-1">Loading Google Places API...</p>
        )}
        {isLoaded && (
          <p className="text-xs text-gray-500 mt-1">Start typing to see address suggestions</p>
        )}
      </div>

      {mapUrl && (
        <iframe
          src={mapUrl}  
          width="450"
          height="250"
          className="w-full rounded-lg"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      )}

      <div className="flex gap-5 pt-2">
        <SecondaryButton
          type="button"
          onClick={handleDiscardChanges}
          disabled={isUpdating} // Disable discard button while updating
          className="w-[100%] bg-white text-black border border-black "
        >
          Discard Changes
        </SecondaryButton>
        <PrimaryButton
          type="button"
          onClick={handleUpdate}
          disabled={isUpdating}
          loading={isUpdating}
          loadingText="Updating..."
          className="w-[100%]"
        >
          Update
        </PrimaryButton>
      </div>
      <div className="flex items-center gap-2">
        <MissingBadge />
        <p className="text-red-500 text-sm">Please fill all the fields to complete your profile</p>
      </div>

      <UpdateEmailModal
        open={updateEmailOpen}
        onClose={() => setUpdateEmailOpen(false)}
        vendorId={vendorData?.vendor_id}
        onSuccess={() => dispatch(fetchVendorDetails())}
      />
    </div>
  );
};

export default Account;
