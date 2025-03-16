"use client";
import React, { useEffect, useState } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import axiosClient from "../../../../AxiosClient";
import LoadMoreButton from "../../../buttons/LoadMoreButton";
import TableUpper from "./TableUpper";
import { toast } from "sonner";
import Loader from "../../../loader/loader";
import { formatTime } from "../../../../utility/FormateTime";
import Modal from "../../../Modal";

const BagsTable = () => {
  const [items, setItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState(5);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(
          "/v1/vendor/item/get/all?active=true"
        );
        if (response.status === 200) {
          setItems(response.data || []);
        }
      } catch (error) {
        toast.error("Failed to fetch items");
        console.error("Error fetching items:", error);
      }
      setLoading(false);
    };

    fetchItems();
  }, []);

  useEffect(() => {
    setVisibleItems(5);
  }, [items]);

  const handleLoadMore = () => {
    setVisibleItems((prev) => Math.min(prev + 5, filteredItems.length));
    console.log("Load More Clicked, Visible Items:", visibleItems);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const filteredItems = selectedFilter
    ? items.filter((item) => {
        const formattedItemType = item.item_type
          .replace(/_/g, " ")
          .toLowerCase();
        const formattedFilter = selectedFilter.toLowerCase();

        return (
          formattedItemType === formattedFilter ||
          (formattedItemType.includes("snacks") &&
            formattedItemType.includes("desserts") &&
            formattedFilter === "snacks and desserts")
        );
      })
    : items;

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
            {filteredItems.slice(0, visibleItems).map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 text-center"
              >
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
                  <button onClick={() => openModal(item)}>
                    <EyeIcon className="h-5 w-5 text-gray-600 hover:text-gray-900" />
                  </button>
                </td>
              </tr>
            ))}
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
    </div>
  );
};

export default BagsTable;
