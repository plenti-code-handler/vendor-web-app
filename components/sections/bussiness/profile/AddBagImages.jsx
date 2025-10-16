import React, { useState, useEffect, useRef } from "react";
import { PhotoIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../../../../AxiosClient";
import { ALL_ITEM_TYPES, ITEM_TYPE_DISPLAY_NAMES } from "../../../../constants/itemTypes";
import { fetchItemImages, updateItemImage } from "../../../../redux/slices/itemImageSlice";
import ItemImageModal from "../../../modals/ItemImageModal";

const AddBagImages = () => {
  const dispatch = useDispatch();
  const { itemTypes, loading: fetchLoading } = useSelector((state) => state.itemImage);
  const { itemTypes: catalogueItemTypes } = useSelector((state) => state.catalogue);
  const fileInputRef = useRef(null);
  
  // Get available item types from catalogue
  const availableItemTypes = Object.keys(catalogueItemTypes || {});
  
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [itemType, setItemType] = useState(availableItemTypes[0] || ALL_ITEM_TYPES[0]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Fetch item images on mount
  useEffect(() => {
    dispatch(fetchItemImages());
  }, [dispatch]);
  
  // Update selected item type if it's not in available types
  useEffect(() => {
    if (availableItemTypes.length > 0 && !availableItemTypes.includes(itemType)) {
      setItemType(availableItemTypes[0]);
    }
  }, [availableItemTypes, itemType]);
  
  // Get current image for selected item type with cache busting
  const getCurrentImageUrl = (type) => {
    const imageUrl = itemTypes[type]?.image_url;
    if (!imageUrl) return null;
    // Add timestamp to bust browser cache
    return `${imageUrl}?t=${Date.now()}`;
  };
  
  const currentImage = getCurrentImageUrl(itemType);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      handleUploadCustomImage(file);
    }
  };

  const handleLibraryImageSelect = async (imageUrl) => {
    setLoading(true);
    setModalOpen(false);

    try {
      // Send the library image URL to backend as form data
      const formData = new FormData();
      formData.append("image_url", imageUrl);
      
      const response = await axiosClient.post(
        `/v1/vendor/item/image/upload?item_type=${itemType}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      toast.success("Image selected successfully");
      
      // Refresh all item images from backend
      await dispatch(fetchItemImages()).unwrap();
    } catch (error) {
      toast.error("Failed to select image");
      console.error("Library image selection error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCustomImage = async (file) => {
    if (!file) {
      toast.error("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setModalOpen(false);

    try {
      const response = await axiosClient.post(
        `/v1/vendor/item/image/upload?item_type=${itemType}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      toast.success("Image uploaded successfully");
      setPreview(null);
      setImage(null);
      
      // Refresh all item images from backend
      await dispatch(fetchItemImages()).unwrap();
    } catch (error) {
      toast.error("Image upload failed");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSelectFromModal = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Upload Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Image</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <div className="relative">
              <select
                value={itemType}
                onChange={(e) => {
                  setItemType(e.target.value);
                  setPreview(null);
                  setImage(null);
                }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
              >
                {availableItemTypes.length > 0 ? (
                  availableItemTypes.map((type) => (
                    <option key={type} value={type}>
                      {ITEM_TYPE_DISPLAY_NAMES[type]}
                    </option>
                  ))
                ) : (
                  <option value="">No categories available</option>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Choose Image Button */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Image Selection
            </label>
            <button
              onClick={() => setModalOpen(true)}
              disabled={loading}
              className={`w-full h-[42px] px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary hover:bg-hoverPrimary text-white shadow-md hover:shadow-lg active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <PhotoIcon className="h-5 w-5" />
                  <span>Choose Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Hidden file input for custom upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      
      {/* Item Image Modal */}
      <ItemImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onImageSelect={handleLibraryImageSelect}
        onUploadSelect={handleUploadSelectFromModal}
        uploading={loading}
        itemType={itemType}
      />

      {/* Uploaded Images Gallery */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Uploaded Images</h3>
        
        {fetchLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : availableItemTypes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {availableItemTypes.map((type) => {
              const imageData = itemTypes[type];
              return (
                <div
                  key={type}
                  className={`relative group rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    imageData
                      ? "border-green-300 shadow-sm hover:shadow-md"
                      : "border-gray-200 opacity-50"
                  }`}
                >
                  <div className="aspect-square bg-gray-100">
                    {imageData ? (
                      <img
                        src={getCurrentImageUrl(type)}
                        alt={ITEM_TYPE_DISPLAY_NAMES[type]}
                        className="w-full h-full object-cover"
                        key={imageData.image_url}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PhotoIcon className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-md font-medium text-white text-center truncate">
                      {ITEM_TYPE_DISPLAY_NAMES[type]}
                    </p>
                  </div>
                  
                  {/* Status Badge */}
                  {imageData && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-sm">
                      ✓
                    </div>
                  )}
                  
                  {/* Hover: Replace Button */}
                  {imageData && (
                    <button
                      onClick={() => {
                        setItemType(type);
                        setPreview(null);
                        setImage(null);
                        setModalOpen(true);
                      }}
                      className="absolute inset-0 bg-primary/90 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                    >
                      Replace
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {availableItemTypes.length === 0 
              ? "No categories available. Please set up your catalogue first."
              : "No images uploaded yet"}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBagImages;
