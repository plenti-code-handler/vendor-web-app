"use client";
import React, { useEffect, useState } from "react";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axiosClient from "../../../../AxiosClient";
import LoadMoreButton from "../../../buttons/LoadMoreButton";
import TableUpper from "./TableUpper";
import Loader from "../../../loader/loader";
import Modal from "../../../Modal";
import DietIcon from "../../../common/DietIcon";
import { formatDateTime, formatTime } from "../../../../utility/FormatTime";
import {
  setBagToUpdate,
  setOpenDrawer,
} from "../../../../redux/slices/editBagSlice";
import { fetchAllBags } from "../../../../redux/slices/bagsSlice";
import { ITEM_TYPE_DISPLAY_NAMES } from "../../../../constants/itemTypes";


const BagsTable = () => {
  const dispatch = useDispatch();
  const { items: bags, loading } = useSelector((state) => state.bags);

  const [visibleItems, setVisibleItems] = useState(5);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("active");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    console.log("Fetching all bags and coupons");
    dispatch(fetchAllBags({ active: selectedFilter === "active" }));
    setVisibleItems(5);
  }, [dispatch, selectedFilter]);

  const handleEdit = (item) => {
    dispatch(setBagToUpdate(item));
    dispatch(setOpenDrawer(true));
  };

  const handleFilterChange = (filter) => {
    console.log("Inside handle change filter");
    console.log(filter);
    setSelectedFilter(filter);
  };

  const nowTs = Math.floor(Date.now() / 1000);
  const isExpiredItem = (item) => (item?.window_end_time ?? 0) <= nowTs;

  const filteredItems =
    selectedFilter === "expired"
      ? bags.filter((item) => isExpiredItem(item))
      : bags.filter((item) => !isExpiredItem(item));

  const handleLoadMore = () => {
    setVisibleItems((prev) => Math.min(prev + 5, filteredItems.length));
    console.log(filteredItems.length, "filteredItems.length");
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const DeleteBag = async () => {
    if (!itemToDelete) return;

    try {
      const response = await axiosClient.delete(
        `/v1/vendor/item/items/delete?item_id=${itemToDelete.id}&vendor_id=${itemToDelete.vendor_id}`
      );

      if (response.status === 200) {
        dispatch(fetchAllBags({ active: selectedFilter === "active" }));
        toast.success("Bag deleted successfully");
        setShowAlert(false);
        setSelectedItem(null);
      } else {
        toast.error("Failed to delete bag");
      }
    } catch (error) {
      console.error("Error deleting bag:", error);
      toast.error("An error occurred while deleting the bag");
    }
  };


  const servingsLabel = (current, start) => {
    const safeCurrent = typeof current === "number" ? current : 0;
    const safeStart = typeof start === "number" ? start : 0;
    return (
      <span>
        <span className="text-sm font-extrabold">{safeCurrent}</span>
        <span className="mx-1 text-gray-500">out of</span>
        <span className="text-xs text-gray-500">{safeStart}</span>
      </span>
    );
  };

  const actionBtnBase =
    "h-9 w-9 inline-flex items-center justify-center rounded-full border border-gray-200 bg-white/80 backdrop-blur text-gray-700 shadow-sm hover:shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10";

  return (
    <div className="no-scrollbar w-full overflow-y-hidden">
      <TableUpper
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
      />

      {loading ? (
        <Loader />
      ) : (
        <div className="animate-fade-down">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
              No bags available
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3 px-2 sm:px-4">
              {filteredItems.slice(0, visibleItems).map((item) => {
                const isSoldOut =
                  (item.veg_servings_current ?? 0) === 0 &&
                  (item.non_veg_servings_current ?? 0) === 0;
                const isExpired = isExpiredItem(item);
                const isDimmed = isExpired || isSoldOut;

                return (
                  <div
                    key={item.id}
                    className={`group rounded-2xl border transition-all overflow-hidden cursor-pointer ${
                      isDimmed
                        ? "bg-gray-50 border-gray-200 opacity-70"
                        : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => openModal(item)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") openModal(item);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex gap-3 p-3">
                      <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={ITEM_TYPE_DISPLAY_NAMES[item.item_type]}
                            className={`h-full w-full object-cover ${
                              isDimmed ? "grayscale" : ""
                            }`}
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs font-semibold text-gray-500">
                            NO IMAGE
                          </div>
                        )}
                      </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-gray-500 truncate">
                            {ITEM_TYPE_DISPLAY_NAMES[item.item_type]} Bag
                          </p>
                          <p className="mt-0.5 text-sm font-semibold text-gray-900 line-clamp-2">
                            {item.description || "—"}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openModal(item)}
                            className={`${actionBtnBase} hover:bg-gray-50`}
                            aria-label="View"
                            title="View"
                          >
                            <EyeIcon className="h-[18px] w-[18px]" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                            className={`${actionBtnBase} hover:bg-blue-50 hover:border-blue-200 text-blue-700`}
                            aria-label="Edit"
                            title="Edit"
                          >
                            <PencilSquareIcon className="h-[18px] w-[18px]" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setItemToDelete(item);
                              setShowAlert(true);
                            }}
                            className={`${actionBtnBase} hover:bg-red-50 hover:border-red-200 text-red-700`}
                            aria-label="Delete"
                            title="Delete"
                          >
                            <TrashIcon className="h-[18px] w-[18px]" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-1 gap-1.5 text-xs">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-gray-500">Pickup window</span>
                          <span className="font-medium text-gray-900 whitespace-nowrap">
                            {formatTime(item.window_start_time)} –{" "}
                            {formatTime(item.window_end_time)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3 bg-green-50 p-1 border border-green-200 rounded-md">
                          <span className="inline-flex items-center gap-2 text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <DietIcon diet="veg" size="xs" />
                              Veg
                            </span>
                            <span className="text-gray-400">servings left</span>
                          </span>
                          <span className="whitespace-nowrap rounded-full text-green-900">
                            {servingsLabel(
                              item.veg_servings_current,
                              item.veg_servings_start
                            )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3 bg-red-50 p-1 border border-red-200 rounded-md">
                          <span className="inline-flex items-center gap-2 text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <DietIcon diet="non-veg" size="xs" />
                              Non‑veg
                            </span>
                            <span className="text-gray-400">servings left</span>
                          </span>
                          <span className="whitespace-nowrap rounded-full  text-red-900">
                            {servingsLabel(
                              item.non_veg_servings_current,
                              item.non_veg_servings_start
                            )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-gray-500">Best before</span>
                          <span className="font-medium text-gray-900 whitespace-nowrap">
                            {item.best_before_time
                              ? formatDateTime(item.best_before_time)
                              : "N/A"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-gray-500">Created</span>
                          <span className="font-medium text-gray-900 whitespace-nowrap">
                            {formatDateTime(item.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {filteredItems.length > visibleItems && (
        <LoadMoreButton loadMore={handleLoadMore} isLoading={loading} />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        item={selectedItem}
      />

      {showAlert && (
        <div className="fixed top-0 left-0 w-full flex justify-center z-50 animate-slide-down">
          <div className="bg-white border border-gray-300 shadow-lg rounded-md mt-4 p-4 w-[90%] max-w-md">
            <p className="text-gray-800 mb-4 font-medium text-center">
              Are you sure you want to delete this bag?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowAlert(false)}
                className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => DeleteBag()}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BagsTable;