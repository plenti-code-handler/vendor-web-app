"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { deleteSvg, editSvg } from "../../../../svgs";
import { useDispatch } from "react-redux";
import {
  setBagToUpdate,
  setOpenDrawer,
} from "../../../../redux/slices/editBagSlice";
import LoadMoreButton from "../../../buttons/LoadMoreButton";
import { BagsContext } from "../../../../contexts/BagsContext";
import TableUpper from "./TableUpper";
import Loader from "../../../loader/loader";
import { toast } from "sonner";
import EditBagDrawer from "../../../drawers/EditBagDrawer";

const dummyBags = [
  {
    id: "1",
    title: "Travel Backpack",
    type: "Backpack",
    size: "Large",
    dailyServe: 10,
    inStock: 50,
    price: "$49.99",
    status: "active",
  },
  {
    id: "2",
    title: "Leather Handbag",
    type: "Handbag",
    size: "Medium",
    dailyServe: 5,
    inStock: 30,
    price: "$69.99",
    status: "scheduled",
  },
  {
    id: "3",
    title: "School Bag",
    type: "Backpack",
    size: "Small",
    dailyServe: 8,
    inStock: 20,
    price: "$29.99",
    status: "past",
  },
];

const BagsTable = () => {
  const dispatch = useDispatch();
  const { filteredBags, setFilteredBags } = useContext(BagsContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [onStatusChange, setOnStatusChange] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setFilteredBags(dummyBags);
  }, [setFilteredBags]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredBags(dummyBags);
    } else {
      const filtered = dummyBags.filter(
        (bag) =>
          bag.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bag.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBags(filtered);
    }
  }, [searchTerm]);

  const handleEditClick = (bag) => {
    dispatch(setBagToUpdate(bag));
    dispatch(setOpenDrawer(true));
  };

  const handleDelete = (id) => {
    setFilteredBags((prevBags) => prevBags.filter((bag) => bag.id !== id));
    toast.success("Bag Deleted Successfully");
  };

  return (
    <div className="no-scrollbar w-full overflow-y-hidden">
      <TableUpper
        selectedFilter={onStatusChange}
        onFilterChange={setOnStatusChange}
        setSearchTerm={setSearchTerm}
      />

      <table className="w-full table-auto truncate overflow-hidden bg-white">
        <thead>
          <tr className="border-b-[1px] border-grayOne border-dashed border-opacity-45 text-sm font-semibold text-grayOne">
            <th className="pb-[8px] pl-[5%] pt-[18px] text-left w-[25.00%]">
              Bag Deal Title
            </th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Size</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Daily Serve</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">In Stock</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Bag Price</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Status</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBags.length > 0 ? (
            filteredBags.map((bag) => (
              <tr key={bag.id} className="border-b border-gray-200 text-center">
                <td className="py-2 pl-[5%] text-left">{bag.title}</td>
                <td className="py-2 px-2">{bag.size}</td>
                <td className="py-2 px-2">{bag.dailyServe}</td>
                <td className="py-2 px-2">{bag.inStock}</td>
                <td className="py-2 px-2">{bag.price}</td>
                <td className="py-2 px-2">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                      bag.status.toLowerCase() === "active"
                        ? "bg-green-500"
                        : bag.status.toLowerCase() === "past"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {bag.status}
                  </span>
                </td>
                <td className="py-2 px-2 flex justify-center gap-2">
                  <button onClick={() => handleEditClick(bag)}>
                    {editSvg}
                  </button>
                  <button onClick={() => handleDelete(bag.id)}>
                    {deleteSvg}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-4 text-center">
                No Bags Available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <LoadMoreButton onClick={() => console.log("Load more clicked")} />
      <EditBagDrawer />
    </div>
  );
};

export default BagsTable;
