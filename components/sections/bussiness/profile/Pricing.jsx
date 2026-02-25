"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCatalogue, clearCatalogueError } from '../../../../redux/slices/catalogueSlice';
import { toast } from 'sonner';
import axiosClient from '../../../../AxiosClient';
import { ALL_ITEM_TYPES, ITEM_TYPE_DISPLAY_NAMES } from '../../../../constants/itemTypes';
import { ArrowPathIcon, SparklesIcon, CurrencyRupeeIcon, PencilIcon, ClockIcon } from '@heroicons/react/24/outline';
import PricingInfo from "./PricingInfo";
import SecondaryButton from "../../../buttons/SecondaryButton";
import PrimaryButton from "../../../buttons/PrimaryButton";
import AddPricingModal from "../../../modals/AddPricingModal";
import {
  entryKey,
  getEntriesForItemType,
  canAddPricing,
  PRICING_LIMIT_REACHED_MESSAGE,
} from '../../../../utility/catalogueUtils';

const SIZE_CONFIG = {
  SMALL:  { bg: 'bg-blue-100', text: 'text-blue-800', icon: '👜' },
  MEDIUM: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🛍️' },
  LARGE:  { bg: 'bg-green-100', text: 'text-green-800', icon: '🛒' },
};

const Pricing = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { pricing = [], payout, loading, error, lastUpdated } = useSelector((state) => state.catalogue);

  const [localPricing, setLocalPricing] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingRequests, setPendingRequests] = useState({});
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [pricingModalItemType, setPricingModalItemType] = useState(null);
  const [pricingModalEditEntry, setPricingModalEditEntry] = useState(null);

  const bagSizes = ['SMALL', 'MEDIUM', 'LARGE'];

  useEffect(() => {
    if (!lastUpdated && !loading) dispatch(fetchCatalogue());
  }, [dispatch, lastUpdated, loading]);

  useEffect(() => {
    if (pricing.length > 0) setLocalPricing(pricing);
  }, [pricing]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await axiosClient.get('/v1/vendor/catalogue/get_request');
        const reqPricing = data?.pricing || [];
        const pending = {};
        
        localPricing.forEach((entry) => {
          const key = entryKey(entry);
          const req = reqPricing.find(p => entryKey(p) === key);
          if (req?.asp != null && entry?.asp !== req.asp) pending[key] = req.asp;
        });
        setPendingRequests(pending);
      } catch (err) {
        setPendingRequests({});
      }
    };
    if (localPricing.length > 0) fetchRequests();
  }, [pricing, localPricing.length]);

  useEffect(() => {
    if (error) {
      const msg = typeof error === 'string' ? error : 
                  error?.detail?.[0]?.msg || error?.detail || error?.message || 'An error occurred';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
      dispatch(clearCatalogueError());
    }
  }, [error, dispatch]);

  const handleRequestUpdate = async () => {
    try {
      setIsSubmitting(true);
      const { status } = await axiosClient.post('/v1/vendor/catalogue/request', { 
        pricing: localPricing, 
        ...(payout && { payout }) 
      });
      if (status === 200) {
        toast.success('Update request submitted!');
        dispatch(fetchCatalogue());
      }
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px] space-x-3">
      <ArrowPathIcon className="w-5 h-5 animate-spin text-[#5F22D9]" />
      <span className="text-sm text-gray-600 font-medium">Loading pricing...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#5F22D9] rounded-lg flex items-center justify-center">
            <CurrencyRupeeIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Pricing Management</h1>
            <p className="text-sm text-gray-600">Edit item pricing and bag sizes</p>
          </div>
        </div>
        <div className="flex gap-3">
          <SecondaryButton onClick={() => dispatch(fetchCatalogue())}>
            <ArrowPathIcon className="h-5 w-5 text-purple-600" />
          </SecondaryButton>
          <PrimaryButton
            onClick={() => router.push('/price-decision')}
          >
            Go to Pricing Page
          </PrimaryButton>
        </div>
      </header>

      {payout?.threshold && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-green-900 flex items-center gap-2">
            <CurrencyRupeeIcon className="w-4 h-4" /> Payout: ₹{payout.threshold}
          </h3>
          <p className="text-xs text-green-700">Maintain this balance for unlimited payouts</p>
        </div>
      )}

      <div className="space-y-6">
        {ALL_ITEM_TYPES.map((type) => {
          const entries = getEntriesForItemType(localPricing, type);
          if (!entries.length) return null;

          const openAddPricingModal = () => {
            if (!canAddPricing(type, entries.length)) {
              toast.error(PRICING_LIMIT_REACHED_MESSAGE);
              return;
            }
            setPricingModalItemType(type);
            setPricingModalEditEntry(null);
            setPricingModalOpen(true);
          };

          return (
            <div key={type} className="bg-white rounded-xl border overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 text-[#5F22D9]" />
                  <h3 className="font-semibold">{ITEM_TYPE_DISPLAY_NAMES[type]}</h3>
                </div>
                <SecondaryButton
                  type="button"
                  className="py-2 px-4 text-xs shrink-0"
                  onClick={openAddPricingModal}
                >
                  Add new Pricing +
                </SecondaryButton>
              </div>
              <div className="overflow-x-auto">
                <table className="text-sm w-full min-w-[320px]">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="sticky left-0 bg-gray-50 p-3 border-r-2 border-gray-300 w-24">Size</th>
                      {entries.map(entry => {
                        const key = entryKey(entry);
                        const isDefault = (entry.id ?? 'default') === 'default';
                        return (
                          <th key={key} className={`p-3 text-left min-w-[160px] border-r-2 border-gray-200 ${isDefault ? 'bg-blue-50' : ''}`}>
                            <div className="capitalize font-bold text-center">{String(entry.name || 'Default').replace(/_/g, ' ')}</div>
                            <div className="flex items-center gap-1 justify-center text-xs text-gray-500 mt-1">
                              <span>ASP: ₹{entry.asp}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setPricingModalItemType(entry.item_type);
                                  setPricingModalEditEntry(entry);
                                  setPricingModalOpen(true);
                                }}
                                className="p-0.5 rounded hover:bg-gray-200"
                                aria-label="Edit pricing"
                              >
                                <PencilIcon className="w-3 h-3 cursor-pointer" />
                              </button>
                            </div>
                            {pendingRequests[key] && <div className="text-[10px] text-center text-indigo-600">Pending: ₹{pendingRequests[key]}</div>}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {bagSizes.map(size => {
                      const sizeStyle = SIZE_CONFIG[size] || SIZE_CONFIG.SMALL;
                      return (
                      <tr key={size} className="border-b hover:bg-gray-50">
                        <td className={`sticky left-0 p-3 border-r-2 border-gray-300 font-medium capitalize ${sizeStyle.bg} ${sizeStyle.text}`}>
                          <span className="inline-flex items-center gap-1.5">
                            <span>{sizeStyle.icon}</span>
                            <span>{size.toLowerCase()}</span>
                          </span>
                        </td>
                        {entries.map(entry => {
                          const price = entry?.bags?.[size];
                          const cut = entry?.cuts?.[size] || 0;
                          return (
                            <td key={entryKey(entry)} className={`p-3 border-r-2 border-gray-100 ${(entry.id ?? 'default') === 'default' ? 'bg-blue-50/30' : ''}`}>
                              {price ? (
                                <div className="flex flex-col">
                                  <span className="font-semibold">You get: ₹{(price - cut).toFixed(2)}</span>
                                  <span className="text-[10px] text-gray-400">Price: ₹{Number(price).toFixed(2)}</span>
                                </div>
                              ) : '—'}
                            </td>
                          );
                        })}
                      </tr>
                    );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      <PrimaryButton
        onClick={handleRequestUpdate}
        disabled={isSubmitting}
      >
        {isSubmitting && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
        {isSubmitting ? 'Submitting...' : 'Request Pricing Update'}
      </PrimaryButton>

      <PricingInfo />

      <AddPricingModal
        open={pricingModalOpen}
        onClose={() => {
          setPricingModalOpen(false);
          setPricingModalEditEntry(null);
        }}
        itemType={pricingModalItemType}
        editEntry={pricingModalEditEntry}
        existingEntriesForItemType={getEntriesForItemType(localPricing, pricingModalItemType)}
        onSave={(entry, editEntry) => {
          if (editEntry) {
            setLocalPricing((prev) =>
              prev.map((p) => (entryKey(p) === entryKey(editEntry) ? entry : p))
            );
          } else {
            setLocalPricing((prev) => [...prev, entry]);
          }
          setPricingModalOpen(false);
          setPricingModalEditEntry(null);
        }}
      />
    </div>
  );
};

export default Pricing;