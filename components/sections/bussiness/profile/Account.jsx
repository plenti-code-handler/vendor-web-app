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
  updateVendorDetails 
} from "../../../../redux/slices/vendorSlice";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const libraries = ["places"]; // Define as constant outside component

const Account = () => {
  const dispatch = useDispatch();
  const vendorData = useSelector(selectVendorData);
  const loading = useSelector(selectVendorLoading);
  const error = useSelector(selectVendorError);
  
  const [originalData, setOriginalData] = useState(null); // Store original data for discard
  const [isUpdating, setIsUpdating] = useState(false); // Add loading state for update button
  const [formData, setFormData] = useState({
    vendor_name: "",
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
    pincode: "",
    phone_number: "",
  });

  const [mapUrl, setMapUrl] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState(""); // Add state for Google Maps URL

  const autoCompleteRef = useRef(null);
  const autocompleteInstanceRef = useRef(null);

  // Fetch vendor data if not already loaded
  useEffect(() => {
    if (!vendorData) {
      dispatch(fetchVendorDetails());
    }
  }, [dispatch, vendorData]);

  // Update form data when vendor data is loaded
  useEffect(() => {
    if (vendorData) {
      console.log("Vendor details");
      console.log(vendorData);
      setOriginalData(vendorData);
      setFormData({
        vendor_name: vendorData.vendor_name || "",
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
        pincode: vendorData.pincode || "",
        phone_number: vendorData.phone_number || "", // Keep as string for form input
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
          fields: ["formatted_address", "geometry", "place_id", "name"]
        }
      );

      console.log("Autocomplete initialized:", autocompleteInstanceRef.current);

      // Add place_changed listener
      autocompleteInstanceRef.current.addListener("place_changed", () => {
        const place = autocompleteInstanceRef.current.getPlace();
        console.log("Selected place:", place);
        
        if (place.geometry && place.formatted_address) {
          const formattedAddress = place.formatted_address;
          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();
          
          // Generate Google Maps URL for address_url
          const googleMapsUrl = `https://www.google.com/maps/place/${encodeURIComponent(formattedAddress)}/@${latitude},${longitude},15z`;
          setGoogleMapsUrl(googleMapsUrl);
          
          setFormData((prev) => ({
            ...prev,
            address_url: googleMapsUrl, // Use Google Maps URL
            address: formattedAddress, // Store formatted address
            latitude: latitude,
            longitude: longitude,
          }));

          setMapUrl(
            `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=15`
          );
          
          console.log("Google Maps URL:", googleMapsUrl);
          console.log("Embed URL:", mapUrl);
          
          toast.success("Address selected successfully!");
        } else {
          toast.error("Please select a valid address from the suggestions");
        }
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
      pincode: originalData.pincode || "",
      phone_number: originalData.phone_number || "", // Keep as string for form input
    });
  };

  // Update API call
  const handleUpdate = async () => {
    try {
      setIsUpdating(true); // Start loading
      
      // Prepare data for API call - convert empty strings to null for phone_number
      const apiData = {
        ...formData,
        phone_number: formData.phone_number.trim() === "" ? null : formData.phone_number.trim(),
        // Also handle other fields that might need null conversion
        owner_name: formData.owner_name.trim() === "" ? null : formData.owner_name.trim(),
        store_manager_name: formData.store_manager_name.trim() === "" ? null : formData.store_manager_name.trim(),
        gst_number: formData.gst_number.trim() === "" ? null : formData.gst_number.trim(),
        fssai_number: formData.fssai_number.trim() === "" ? null : formData.fssai_number.trim(),
        pan_number: formData.pan_number.trim() === "" ? null : formData.pan_number.trim(),
        description: formData.description.trim() === "" ? null : formData.description.trim(),
        pincode: formData.pincode.trim() === "" ? null : formData.pincode.trim(),
      };

      console.log("Form data", formData);
      console.log("API data", apiData);
      
      const result = await dispatch(updateVendorDetails(apiData)).unwrap();
      console.log("Profile update console");
      console.log(result);
      toast.success("Profile updated successfully!");
      setOriginalData(formData);
    } catch (err) {
      console.error("Error updating vendor data:", err);
      toast.error("Failed to update profile.");
    } finally {
      setIsUpdating(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col gap-4 pt-6 pb-6">
      <div>
        <h3 className="font-medium ml-1 mb-1">Store name</h3>
        <TextField
          placeholder="Store Name"
          name="vendor_name"
          value={formData.vendor_name}
          onChange={handleChange}
        />
      </div>
      
      {/* Add Owner Name field */}
      <div>
        <h3 className="font-medium ml-1 mb-1">Owner Name</h3>
        <TextField
          placeholder="Owner Name"
          name="owner_name"
          value={formData.owner_name}
          onChange={handleChange}
        />
      </div>
      
      {/* Add Store Manager Name field */}
      <div>
        <h3 className="font-medium ml-1 mb-1">Store Manager Name</h3>
        <TextField
          placeholder="Store Manager Name"
          name="store_manager_name"
          value={formData.store_manager_name}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <h3 className="font-medium ml-1 mb-1">Email</h3>
        <div className="flex justify-between w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-3 text-sm text-black">
          <p className="font-semibold">
            {loading ? "Loading..." : vendorData?.email}
          </p>
          {vendorData?.email_verified && (
            <div className="flex gap-1 items-center">
              <p className="text-primary font-semibold">Verified</p>
              {tickSvg}
            </div>
          )}
        </div>
      </div>

      <div className="w-full">
        <h3 className="font-medium ml-1 mb-1">Store Type</h3>
        <select
          className="rounded-md w-full border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          name="vendor_type"
          value={formData.vendor_type}
          onChange={handleChange}
        >
          <option value="RESTAURANT">Restaurant</option>
          <option value="SUPERMARKET">Super Market</option>
          <option value="BAKERY">Bakery</option>
        </select>
      </div>

      <div>
        <h3 className="font-medium ml-1 mb-1">GST Number</h3>
        <TextField
          placeholder="GST Number"
          name="gst_number"
          value={formData.gst_number}
          onChange={handleChange}
        />
      </div>
      <div>
        <h3 className="font-medium ml-1 mb-1">FSSAI Number</h3>
        <TextField
          placeholder="FSSAI Number"
          name="fssai_number"
          value={formData.fssai_number}
          onChange={handleChange}
        />
      </div>
      <div>
        <h3 className="font-medium ml-1 mb-1">PAN Number</h3>
        <TextField
          placeholder="PAN Number"
          name="pan_number"
          value={formData.pan_number}
          onChange={handleChange}
        />
      </div>
      <div>
        <h3 className="font-medium ml-1 mb-1">Phone Number</h3>
        <TextField
          placeholder="Phone Number"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
        />
      </div>

      <div className="w-full">
        <h3 className="font-medium ml-1 mb-1">Store Address</h3>
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
        <button
          className="flex justify-center bg-white text-black border border-black font-md py-2 rounded hover:bg-grayTwo gap-2 w-[100%]"
          onClick={handleDiscardChanges}
          disabled={isUpdating} // Disable discard button while updating
        >
          Discard Changes
        </button>
        <button
          className={`flex justify-center font-md py-2 rounded gap-2 w-[100%] ${
            isUpdating 
              ? "bg-gray-400 text-white cursor-not-allowed" 
              : "bg-[#5F22D9] text-white hover:bg-[#7e45ee]"
          }`}
          onClick={handleUpdate}
          disabled={isUpdating} // Disable button while updating
        >
          {isUpdating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Updating...
            </>
          ) : (
            "Update"
          )}
        </button>
      </div>
    </div>
  );
};

export default Account;