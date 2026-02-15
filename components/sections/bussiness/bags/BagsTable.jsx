"use client";
import React, { useEffect, useState } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axiosClient from "../../../../AxiosClient";
import LoadMoreButton from "../../../buttons/LoadMoreButton";
import TableUpper from "./TableUpper";
import Loader from "../../../loader/loader";
import Modal from "../../../Modal";
import { formatTime } from "../../../../utility/FormatTime";
import {
  setBagToUpdate,
  setOpenDrawer,
} from "../../../../redux/slices/editBagSlice";
import { fetchAllBags } from "../../../../redux/slices/bagsSlice";

const BagsTable = () => {
  const dispatch = useDispatch();
  const { items: bags, loading } = useSelector((state) => state.bags);

  const [visibleItems, setVisibleItems] = useState(5);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const handleDelete = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    console.log("Fetching all bags and coupons");
    dispatch(fetchAllBags());
  }, [dispatch]);

  const handleEdit = (item) => {
    dispatch(setBagToUpdate(item));
    dispatch(setOpenDrawer(true));
  };

  const handleFilterChange = (filter) => {
    console.log("Inside handle change filter");
    console.log(filter);
    setSelectedFilter(filter);
  };

  const filteredItems = selectedFilter
    ? bags.filter((item) => {
      const formattedItemType = item.item_type
        .replace(/_/g, " ")
        .toLowerCase();
      const formattedFilter = selectedFilter.toLowerCase();
      return formattedItemType.includes(formattedFilter);
    })
    : bags;

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
        dispatch(fetchAllBags());
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

  // Helper function to get servings display
  const getServingsDisplay = (item) => {
    const vegServings = item.veg_servings_current || 0;
    const nonVegServings = item.non_veg_servings_current || 0;

    return {
      veg: vegServings,
      nonVeg: nonVegServings,
      hasVeg: vegServings > 0,
      hasNonVeg: nonVegServings > 0
    };
  };

  return (
    <div className="no-scrollbar w-full overflow-y-hidden">
      <TableUpper
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
      />

      {loading ? (
        <Loader />
      ) : (
        <table className="w-full table-auto bg-white animate-fade-down">
          <thead>
            <tr className="border-b-[1px] border-grayOne border-dashed border-opacity-45 text-sm text-grayOne">
              <th className="pb-[8px] px-2 pt-[18px] text-left w-[80px]">
                IMAGE
              </th>
              <th className="pb-[8px] px-2 pt-[18px] text-left w-1/6">Type</th>
              <th className="pb-[8px] px-2 pt-[18px] text-center w-1/6">
                START TIME
              </th>
              <th className="pb-[8px] px-2 pt-[18px] text-center w-1/6">
                END TIME
              </th>
              <th className="pb-[8px] px-2 pt-[18px] text-center w-1/6">
                VEG SERVINGS LEFT
              </th>
              <th className="pb-[8px] px-2 pt-[18px] text-center w-1/6">
                NON-VEG SERVINGS LEFT
              </th>
              <th className="pb-[8px] px-2 pt-[18px] text-center w-1/6">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No bags available
                </td>
              </tr>
            ) : (
              filteredItems.slice(0, visibleItems).map((item) => {
                const servings = getServingsDisplay(item);

                return (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 text-center"
                  >
                    <td className="py-2 px-2 text-left">
                      <div className="w-[48px] h-[48px]">
                        <img
                          src={item.image_url}
                          alt="Item"
                          className="h-full w-full object-cover rounded"
                        />
                      </div>
                    </td>

                    <td className="py-2 px-2 text-left w-1/6">
                      {item.item_type.replace(/_/g, " ")}
                    </td>
                    <td className="py-2 px-2 w-1/6 whitespace-nowrap">
                      {formatTime(item.window_start_time)}
                    </td>
                    <td className="py-2 px-2 w-1/6 whitespace-nowrap">
                      {formatTime(item.window_end_time)}
                    </td>
                    <td className="py-2 px-2 w-1/6">
                      {servings.hasVeg ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${servings.veg > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {servings.veg}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">N/A</span>
                      )}
                    </td>
                    <td className="py-2 px-2 w-1/6">
                      {servings.hasNonVeg ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${servings.nonVeg > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {servings.nonVeg}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">N/A</span>
                      )}
                    </td>
                    <td className="py-2 px-2 w-1/6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => openModal(item)}>
                          <EyeIcon className="h-5 w-5 text-gray-600 hover:text-gray-900" />
                        </button>
                        <button onClick={() => handleEdit(item)}>
                          <PencilIcon className="h-5 w-5 text-blue-600 hover:text-blue-900" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(item);
                            setShowAlert(true);
                          }}
                        >
                          <TrashIcon className="h-5 w-5 text-red-600 hover:text-red-900" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
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