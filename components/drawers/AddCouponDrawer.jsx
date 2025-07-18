// vendor-web-app/components/drawers/AddCouponDrawer.jsx
"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Textarea,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import axiosClient from "../../AxiosClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "sonner";
import { whiteLoader } from "../../svgs";
import { setOpenDrawer } from "../../redux/slices/addCouponSlice";
import { fetchActiveCoupons, fetchInactiveCoupons } from "../../redux/slices/couponSlice";

const AddCouponDrawer = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("0");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [validFrom, setValidFrom] = useState(new Date());
  const [validUntil, setValidUntil] = useState(new Date());
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const open = useSelector((state) => state.addCoupon.drawerOpen);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("File selected:", file); // Debug log
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file!");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB!");
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      console.log("Preview URL created:", url); // Debug log
      setPreviewUrl(url);
      
      toast.success("Image uploaded successfully!");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleValidFromChange = (date) => {
    setValidFrom(date);
    if (validUntil && date > validUntil) {
      setValidUntil(date);
    }
  };

  const handleValidUntilChange = (date) => {
    if (date < validFrom) {
      toast.error("Valid until cannot be before valid from!");
      return;
    }
    setValidUntil(date);
  };

  const resetForm = () => {
    setCode("");
    setName("");
    setDiscountType("PERCENTAGE");
    setDiscountValue("");
    setMinOrderValue("0");
    setMaxDiscount("");
    setUsageLimit("");
    setValidFrom(new Date());
    setValidUntil(new Date());
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // Clean up the URL
    }
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handleCreateCoupon = async () => {
    try {
      if (!selectedFile) {
        toast.error("Please select a coupon image!");
        return;
      }

      if (!code || !name || !discountValue) {
        toast.error("Please fill all required fields!");
        return;
      }

      setLoading(true);

      const data = {
        code: code.toUpperCase(),
        name,
        discount_type: discountType,
        discount_value: Number(discountValue),
        min_order_value: Number(minOrderValue),
        max_discount: maxDiscount ? Number(maxDiscount) : null,
        usage_limit: usageLimit ? Number(usageLimit) : null,
        valid_from: Math.floor(validFrom.getTime() / 1000),
        valid_until: Math.floor(validUntil.getTime() / 1000),
      };

      console.log(data, "data");

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("data", JSON.stringify(data));

      console.log("FormData created:", formData); // Debug log

      const response = await axiosClient.post("/v1/vendor/coupon/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Coupon created successfully!");
        dispatch(setOpenDrawer(false));
        resetForm();
        // Refresh both active and inactive coupons
        dispatch(fetchActiveCoupons());
        dispatch(fetchInactiveCoupons());
      }
    } catch (error) {
      console.log("Error creating coupon:", error);
      toast.error(error.response?.data?.message || "Failed to create coupon!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(setOpenDrawer(false));
    resetForm();
  };

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
                  <div className="flex flex-col pb-5">
                    <p className="text-black font-bold text-xl">Create New Coupon</p>
                  </div>

                  {/* Coupon Image Upload */}
                  <div className="mb-6">
                    <p className="text-black font-bold text-lg mb-3">Coupon Image *</p>
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200"
                      onClick={handleImageClick}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {previewUrl ? (
                        <div className="space-y-2">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-32 h-32 mx-auto rounded-lg object-cover border border-gray-200"
                          />
                          <p className="text-sm text-gray-600">Click to change image</p>
                          <p className="text-xs text-gray-500">
                            {selectedFile?.name} ({(selectedFile?.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600">Click to upload coupon image</p>
                          <p className="text-xs text-gray-500">Supports: JPG, PNG, GIF (Max 5MB)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rest of the form remains the same */}
                  {/* Coupon Code */}
                  <div className="mb-4">
                    <p className="text-black font-bold text-lg mb-2">Coupon Code *</p>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="e.g., STARBUCKS50"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Coupon Name */}
                  <div className="mb-4">
                    <p className="text-black font-bold text-lg mb-2">Coupon Name *</p>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Starbucks 30% off"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Discount Type */}
                  <div className="mb-4">
                    <p className="text-black font-bold text-lg mb-2">Discount Type</p>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PERCENTAGE">Percentage</option>
                      <option value="FIXED">Fixed Amount</option>
                    </select>
                  </div>

                  {/* Discount Value */}
                  <div className="mb-4">
                    <p className="text-black font-bold text-lg mb-2">Discount Value *</p>
                    <input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      placeholder={discountType === "PERCENTAGE" ? "e.g., 30" : "e.g., 100"}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Min Order Value */}
                  <div className="mb-4">
                    <p className="text-black font-bold text-lg mb-2">Minimum Order Value</p>
                    <input
                      type="number"
                      value={minOrderValue}
                      onChange={(e) => setMinOrderValue(e.target.value)}
                      placeholder="e.g., 0"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Max Discount */}
                  <div className="mb-4">
                    <p className="text-black font-bold text-lg mb-2">Maximum Discount (Optional)</p>
                    <input
                      type="number"
                      value={maxDiscount}
                      onChange={(e) => setMaxDiscount(e.target.value)}
                      placeholder="e.g., 100"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Usage Limit */}
                  <div className="mb-4">
                    <p className="text-black font-bold text-lg mb-2">Usage Limit (Optional)</p>
                    <input
                      type="number"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(e.target.value)}
                      placeholder="e.g., 10"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Valid From */}
                  <div className="mb-4">
                    <p className="text-black font-bold text-lg mb-2">Valid From</p>
                    <DatePicker
                      selected={validFrom}
                      onChange={handleValidFromChange}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      minDate={new Date()}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Valid Until */}
                  <div className="mb-6">
                    <p className="text-black font-bold text-lg mb-2">Valid Until</p>
                    <DatePicker
                      selected={validUntil}
                      onChange={handleValidUntilChange}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      minDate={validFrom}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Create Button */}
                  <button
                    onClick={handleCreateCoupon}
                    className="flex justify-center bg-blueBgDark text-white font-semibold py-3 rounded-lg hover:bg-blueBgDarkHover2 gap-2 w-full"
                  >
                    {loading && (
                      <div className="animate-spin flex items-center justify-center">
                        {whiteLoader}
                      </div>
                    )}
                    {loading ? "Creating..." : "Create Coupon"}
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddCouponDrawer;