"use client";

import React, { useState } from "react";
import { XMarkIcon, PhotoIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";
import BeatLoader from "react-spinners/BeatLoader";

const BackcoverImageModal = ({ isOpen, onClose, onImageSelect, onUploadSelect, uploading = false }) => {
  const [selectedTab, setSelectedTab] = useState("library");

  const backcoverImages = [
    { id: 12, url: "https://vendor-image-bucket.s3.us-east-2.amazonaws.com/vendor-images/backcover/cover12.png" },
    { id: 1, url: "https://vendor-image-bucket.s3.us-east-2.amazonaws.com/vendor-images/backcover/cover1.png" },
    { id: 2, url: "https://vendor-image-bucket.s3.us-east-2.amazonaws.com/vendor-images/backcover/cover2.png" },
    { id: 3, url: "https://vendor-image-bucket.s3.us-east-2.amazonaws.com/vendor-images/backcover/cover3.png" },
    { id: 4, url: "https://vendor-image-bucket.s3.us-east-2.amazonaws.com/vendor-images/backcover/cover4.png" },
    { id: 5, url: "https://vendor-image-bucket.s3.us-east-2.amazonaws.com/vendor-images/backcover/cover5.png" },
    { id: 6, url: "https://vendor-image-bucket.s3.us-east-2.amazonaws.com/vendor-images/backcover/cover6.png" },
    { id: 7, url: "https://vendor-image-bucket.s3.us-east-2.amazonaws.com/vendor-images/backcover/cover7.png" },
    { id: 8, url: "https://vendor-image-bucket.s3.us-east-2.amazonaws.com/vendor-images/backcover/cover8.png" },
    { id: 9, url: "https://vendor-image-bucket.s3.us-east-2.amazonaws.com/vendor-images/backcover/cover9.png" },
    { id: 10, url: "https://vendor-image-bucket.s3.us-east-2.amazonaws.com/vendor-images/backcover/cover10.png" },
    { id: 11, url: "https://vendor-image-bucket.s3.us-east-2.amazonaws.com/vendor-images/backcover/cover11.png" }
  ];

  const handleImageSelect = (image) => {
    onImageSelect(image);
  };

  const handleUploadClick = () => {
    onUploadSelect();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
      <div className="w-full max-w-3xl max-h-[85vh] rounded-lg bg-white shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-medium text-gray-900">Choose Cover Image</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 px-5">
          <button
            onClick={() => setSelectedTab("library")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              selectedTab === "library"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Library
          </button>
          <button
            onClick={() => setSelectedTab("upload")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              selectedTab === "upload"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Upload
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto relative">
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
              <div className="text-center">
                <BeatLoader color="#5F22D9" size={12} />
                <p className="text-sm text-gray-600 mt-3">Uploading image...</p>
              </div>
            </div>
          )}
          
          {selectedTab === "library" ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {backcoverImages.map((image) => (
                <div
                  key={image.id}
                  onClick={() => !uploading && handleImageSelect(image)}
                  className={`group relative rounded overflow-hidden border border-gray-200 hover:border-gray-400 transition-all hover:shadow-sm ${
                    uploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`Cover ${image.id}`}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-4">Upload your own cover image</p>
              
              <button
                onClick={handleUploadClick}
                disabled={uploading}
                className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded transition-colors ${
                  uploading 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                <CloudArrowUpIcon className="h-4 w-4" />
                Choose File
              </button>
              
              <p className="mt-4 text-xs text-gray-400">JPG, PNG, WebP • Max 5MB</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackcoverImageModal;
