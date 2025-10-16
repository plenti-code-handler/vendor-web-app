"use client";

import React, { useState } from "react";
import { XMarkIcon, PhotoIcon, CloudArrowUpIcon, FolderIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import BeatLoader from "react-spinners/BeatLoader";
import { ITEM_IMAGES } from "../../constants/itemImages";
import { ITEM_TYPE_DISPLAY_NAMES } from "../../constants/itemTypes";

const ItemImageModal = ({ isOpen, onClose, onImageSelect, onUploadSelect, uploading = false, itemType }) => {
  const [selectedTab, setSelectedTab] = useState("library");
  const [selectedFolder, setSelectedFolder] = useState(null);

  if (!isOpen) return null;

  // Get images for the selected item type
  const itemTypeData = ITEM_IMAGES[itemType];
  const hasFolders = itemTypeData && typeof itemTypeData === 'object' && !itemTypeData.urls;
  
  // Get folders or direct URLs
  const folders = hasFolders ? Object.keys(itemTypeData) : [];
  const directUrls = !hasFolders && itemTypeData?.urls ? itemTypeData.urls : [];

  const handleImageSelect = (imageUrl) => {
    onImageSelect(imageUrl);
  };

  const handleUploadClick = () => {
    onUploadSelect();
  };

  const handleBack = () => {
    setSelectedFolder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Choose {ITEM_TYPE_DISPLAY_NAMES[itemType]} Image
            </h2>
            {selectedFolder && (
              <p className="text-sm text-gray-500 mt-0.5">
                {ITEM_TYPE_DISPLAY_NAMES[itemType]} › {selectedFolder}
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 px-6 bg-white">
          <button
            onClick={() => {
              setSelectedTab("library");
              setSelectedFolder(null);
            }}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              selectedTab === "library"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Library
            {selectedTab === "library" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            onClick={() => {
              setSelectedTab("upload");
              setSelectedFolder(null);
            }}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              selectedTab === "upload"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Upload Custom
            {selectedTab === "upload" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto relative bg-gray-50">
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-10">
              <div className="text-center">
                <BeatLoader color="#5F22D9" size={12} />
                <p className="text-sm text-gray-600 mt-3 font-medium">Uploading image...</p>
              </div>
            </div>
          )}
          
          {selectedTab === "library" ? (
            <div className="space-y-4">
              {/* Back Button */}
              {selectedFolder && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ChevronRightIcon className="h-4 w-4 rotate-180" />
                  <span>Back to folders</span>
                </button>
              )}

              {/* Folder View */}
              {!selectedFolder && hasFolders && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {folders.map((folder) => (
                    <button
                      key={folder}
                      onClick={() => setSelectedFolder(folder)}
                      className="group relative p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <FolderIcon className="h-12 w-12 text-gray-400 group-hover:text-primary transition-colors" />
                        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          {folder.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {itemTypeData[folder].urls.length} images
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Images Grid - For folders */}
              {selectedFolder && hasFolders && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {itemTypeData[selectedFolder].urls.map((imageUrl, index) => (
                    <div
                      key={index}
                      onClick={() => !uploading && handleImageSelect(imageUrl)}
                      className={`group relative rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary transition-all hover:shadow-md ${
                        uploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      }`}
                    >
                      <div className="aspect-square bg-gray-100">
                        <img
                          src={imageUrl}
                          alt={`${selectedFolder} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-primary/20 transition-colors" />
                      
                      {/* Image number badge */}
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Images Grid - For direct URLs (no folders) */}
              {!hasFolders && directUrls.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {directUrls.map((imageUrl, index) => (
                    <div
                      key={index}
                      onClick={() => !uploading && handleImageSelect(imageUrl)}
                      className={`group relative rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary transition-all hover:shadow-md ${
                        uploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      }`}
                    >
                      <div className="aspect-square bg-gray-100">
                        <img
                          src={imageUrl}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-primary/20 transition-colors" />
                      
                      {/* Image number badge */}
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No images available */}
              {!hasFolders && directUrls.length === 0 && (
                <div className="text-center py-12">
                  <PhotoIcon className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No library images available for this category</p>
                  <p className="text-sm text-gray-400 mt-2">Try uploading a custom image instead</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-16">
              <div className="text-center max-w-sm">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-50 mb-4">
                  <CloudArrowUpIcon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Custom Image</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Upload your own image for {ITEM_TYPE_DISPLAY_NAMES[itemType]}
                </p>
                
                <button
                  onClick={handleUploadClick}
                  disabled={uploading}
                  className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-all ${
                    uploading 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-primary text-white hover:bg-hoverPrimary shadow-md hover:shadow-lg active:scale-95'
                  }`}
                >
                  <CloudArrowUpIcon className="h-5 w-5" />
                  Choose File
                </button>
                
                <p className="mt-4 text-xs text-gray-400">PNG, JPG, WebP • Max 5MB</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemImageModal;

