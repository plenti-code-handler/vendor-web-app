import React, { useState } from "react";
import { PhotoIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";
import axiosClient from "../../../../AxiosClient";
import { ALL_ITEM_TYPES, ITEM_TYPE_DISPLAY_NAMES } from "../../../../constants/itemTypes";

const AddBagImages = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [itemType, setItemType] = useState(ALL_ITEM_TYPES[0]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) {
      toast.error("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    setLoading(true);

    try {
      const response = await axiosClient.post(
        `/v1/vendor/item/image/upload?item_type=${itemType}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Image uploaded successfully");
      setPreview(null);
      setImage(null);
    } catch (error) {
      toast.error("Image upload failed");
      console.error("Upload error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <label className="block text-gray-700 font-semibold mb-2">
        Upload Image
      </label>
      <div className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg relative cursor-pointer">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <PhotoIcon className="h-12 w-12 text-gray-400" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>

      <label className="block text-gray-700 font-semibold mt-4 mb-2">
        Select Category
      </label>
      <div className="relative">
        <select
          value={itemType}
          onChange={(e) => setItemType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent"
        >
          {ALL_ITEM_TYPES.map((type) => (
            <option key={type} value={type}>
              {ITEM_TYPE_DISPLAY_NAMES[type]}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-6 w-full bg-primary hover:bg-hoverPrimary    text-white font-semibold py-2 px-4 rounded transition-all"
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
};

export default AddBagImages;
