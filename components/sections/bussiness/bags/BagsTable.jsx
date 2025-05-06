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
import { formatTime } from "../../../../utility/FormateTime";
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

  const [showAlert, setShowAlert] = useState(false);

  const handleDelete = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    dispatch(fetchAllBags());
  }, [dispatch]);

  const handleEdit = (item) => {
    dispatch(setBagToUpdate(item));
    dispatch(setOpenDrawer(true));
  };

  // const handleDelete = async (item_id, vendor_id) => {
  //   try {
  //     await axiosClient.delete(
  //       `/v1/vendor/item/items/delete?item_id=${item_id}&vendor_id=${vendor_id}`
  //     );
  //     toast.success("Item deleted successfully");
  //     dispatch(fetchAllBags());
  //   } catch (error) {
  //     toast.error("Failed to delete item");
  //   }
  // };

  const handleFilterChange = (filter) => {
    console.log("Inside handle change filter");
    console.log(filter);
    setSelectedFilter(filter);
  };

  const filteredItems = selectedFilter
    ? bags.filter((item) => {
        const formattedItemType = item.item_type
          .replace(/_/g, " ")
          .toLowerCase(); // Make sure formatting is consistent (lowercase + spaces instead of underscores)
        const formattedFilter = selectedFilter.toLowerCase(); // Ensure case-insensitive comparison
        return formattedItemType.includes(formattedFilter); // Change equality check to 'includes' to allow partial matches
      })
    : bags;

  const handleLoadMore = () => {
    setVisibleItems((prev) => Math.min(prev + 5, filteredItems.length));
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
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
        <table className="w-full table-auto bg-white">
          <thead>
            <tr className="border-b-[1px] border-grayOne border-dashed border-opacity-45 text-sm font-semibold text-grayOne">
              <th className="pb-[8px] px-2 pt-[18px] text-left w-[80px]">
                Image
              </th>
              <th className="pb-[8px] px-2 pt-[18px] text-left w-1/6">Type</th>
              <th className="pb-[8px] px-2 pt-[18px] text-center w-1/6">
                Start Time
              </th>
              <th className="pb-[8px] px-2 pt-[18px] text-center w-1/6">
                End Time
              </th>
              <th className="pb-[8px] px-2 pt-[18px] text-center w-1/6">
                Stock
              </th>
              <th className="pb-[8px] px-2 pt-[18px] text-center w-1/6">
                Price
              </th>
              <th className="pb-[8px] px-2 pt-[18px] text-center w-1/6">
                Actions
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
              filteredItems.slice(0, visibleItems).map((item) => (
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
                  <td className="py-2 px-2 w-1/6">{item.quantity}</td>
                  <td className="py-2 px-2 w-1/6">${item.price}</td>
                  <td className="py-2 px-2 w-1/6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button onClick={() => openModal(item)}>
                        <EyeIcon className="h-5 w-5 text-gray-600 hover:text-gray-900" />
                      </button>
                      <button onClick={() => handleEdit(item)}>
                        <PencilIcon className="h-5 w-5 text-blue-600 hover:text-blue-900" />
                      </button>
                      <button onClick={() => setShowAlert(true)}>
                        <TrashIcon className="h-5 w-5 text-red-600 hover:text-red-900" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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
                onClick={handleDelete}
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
