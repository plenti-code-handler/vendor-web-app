"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCatalogue, requestCatalogueUpdate, clearCatalogueError } from '../../../../redux/slices/catalogueSlice';
import { toast } from 'sonner';
import { 
  CurrencyDollarIcon, 
  ArrowPathIcon,
  ChevronDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import PriceRow from "./PriceRow";
import PricingInfo from "./PricingInfo";

const Pricing = () => {
  const dispatch = useDispatch();
  const { items, loading, error, updateLoading, updateError, lastUpdated } = useSelector((state) => state.catalogue);

  const allItemTypes = ['MEAL', 'SNACKS_AND_DESSERT', 'BAKED_GOODS'];
  const bagSizes = ['SMALL', 'MEDIUM', 'LARGE'];
  const availableItemTypes = Object.keys(items);

  const [selectedItemType, setSelectedItemType] = useState('');
  const [editingPrices, setEditingPrices] = useState({});
  const [tempPrices, setTempPrices] = useState({});
  const [addedPrices, setAddedPrices] = useState({});
  const [localItems, setLocalItems] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!lastUpdated && !loading) {
      dispatch(fetchCatalogue());
    }
  }, [dispatch, lastUpdated, loading]);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  useEffect(() => {
    if (!selectedItemType) {
      setSelectedItemType(availableItemTypes[0] || allItemTypes[0]);
    }
  }, [availableItemTypes, selectedItemType]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearCatalogueError());
    }
    if (updateError) {
      toast.error(updateError);
      dispatch(clearCatalogueError());
    }
  }, [error, updateError, dispatch]);

  const handleEditPrice = (itemType, bagSize) => {
    const currentPrice = localItems[itemType]?.[bagSize] || '';
    setEditingPrices(prev => ({ ...prev, [`${itemType}-${bagSize}`]: true }));
    setTempPrices(prev => ({ ...prev, [`${itemType}-${bagSize}`]: currentPrice }));
  };

  const handleSavePrice = (itemType, bagSize) => {
    const newPrice = tempPrices[`${itemType}-${bagSize}`];
    if (newPrice && newPrice > 0) {
      setEditingPrices(prev => ({ ...prev, [`${itemType}-${bagSize}`]: false }));
      setLocalItems(prev => ({
        ...prev,
        [itemType]: {
          ...prev[itemType],
          [bagSize]: newPrice
        }
      }));
    }
  };

  const handleCancelEdit = (itemType, bagSize) => {
    setEditingPrices(prev => ({ ...prev, [`${itemType}-${bagSize}`]: false }));
    setTempPrices(prev => ({ ...prev, [`${itemType}-${bagSize}`]: undefined }));
  };

  const handleAddPrice = (itemType, bagSize) => {
    setAddedPrices(prev => ({
      ...prev,
      [`${itemType}-${bagSize}`]: true
    }));
    setTempPrices(prev => ({
      ...prev,
      [`${itemType}-${bagSize}`]: ''
    }));
  };

  const handleSaveAddedPrice = (itemType, bagSize) => {
    const newPrice = tempPrices[`${itemType}-${bagSize}`];
    if (newPrice && newPrice > 0) {
      setLocalItems(prev => ({
        ...prev,
        [itemType]: {
          ...prev[itemType],
          [bagSize]: newPrice
        }
      }));
      setAddedPrices(prev => ({ ...prev, [`${itemType}-${bagSize}`]: false }));
    }
  };

  const handleCancelAddedPrice = (itemType, bagSize) => {
    setAddedPrices(prev => ({ ...prev, [`${itemType}-${bagSize}`]: false }));
    setTempPrices(prev => ({ ...prev, [`${itemType}-${bagSize}`]: undefined }));
  };

  const handleRequestUpdate = async () => {
    try {
      const updateData = [];
      allItemTypes.forEach(itemType => {
        bagSizes.forEach(bagSize => {
          const price = localItems[itemType]?.[bagSize];
          if (price && price > 0) {
            updateData.push({
              item_type: itemType,
              bag_size: bagSize,
              price: price
            });
          }
        });
      });

      if (updateData.length === 0) {
        toast.error('Please set at least one price before requesting an update.');
        return;
      }

      await dispatch(requestCatalogueUpdate(updateData)).unwrap();
      toast.success('Pricing update request submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit pricing update request');
    }
  };

  const getCurrentPrices = () => {
    if (!selectedItemType || !localItems[selectedItemType]) return {};
    return localItems[selectedItemType];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <ArrowPathIcon className="w-5 h-5 animate-spin text-[#5F22D9]" />
          </div>
          <span className="text-sm text-gray-600 font-medium">Loading pricing information...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#5F22D9] rounded-lg flex items-center justify-center">
            <CurrencyDollarIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">Pricing Management</h1>
        </div>
        <p className="text-sm text-gray-600">
          Set and manage your pricing for different item types and bag sizes
        </p>
      </div>

      {/* Item Type Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Select Item Type
        </label>
        <div className="relative w-full max-w-xs">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent transition-all duration-200 hover:border-gray-400"
          >
            <span className="text-sm text-gray-900">
              {selectedItemType ? selectedItemType.replace(/_/g, ' ') : 'Select an item type'}
            </span>
            <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {allItemTypes.map((itemType) => (
                <button
                  key={itemType}
                  onClick={() => {
                    setSelectedItemType(itemType);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-200 text-sm ${
                    selectedItemType === itemType ? 'bg-[#5F22D9]/10 text-[#5F22D9]' : 'text-gray-900'
                  }`}
                >
                  {itemType.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pricing Table */}
      {selectedItemType && (
        <div className="w-full">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <SparklesIcon className="w-4 h-4 text-[#5F22D9]" />
                <h3 className="text-base font-semibold text-gray-900">
                  {selectedItemType.replace(/_/g, ' ')} Pricing
                </h3>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {bagSizes.map((bagSize) => (
                <PriceRow
                  key={bagSize}
                  bagSize={bagSize}
                  itemType={selectedItemType}
                  isEditing={editingPrices[`${selectedItemType}-${bagSize}`]}
                  isAdding={addedPrices[`${selectedItemType}-${bagSize}`]}
                  currentPrice={localItems[selectedItemType]?.[bagSize]}
                  tempPrice={tempPrices[`${selectedItemType}-${bagSize}`]}
                  onEdit={handleEditPrice}
                  onSave={handleSavePrice}
                  onCancel={handleCancelEdit}
                  onAdd={handleAddPrice}
                  onSaveAdd={handleSaveAddedPrice}
                  onCancelAdd={handleCancelAddedPrice}
                  setTempPrices={setTempPrices}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Request Update Button */}
      <div className="pt-4">
        <button
          onClick={handleRequestUpdate}
          disabled={updateLoading}
          className="flex items-center space-x-2 bg-[#5F22D9] hover:bg-[#4A1BB8] disabled:bg-[#8B5CF6] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl text-sm"
        >
          {updateLoading && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
          <span>{updateLoading ? 'Submitting...' : 'Request Price Update'}</span>
        </button>
      </div>

      {/* Info Section */}
      <div className="w-full">
        <PricingInfo />
      </div>
    </div>
  );
};

export default Pricing;