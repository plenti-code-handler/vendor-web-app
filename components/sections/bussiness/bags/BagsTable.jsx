"use client";
import React from "react";
import Image from "next/image";
import { bags } from "../../../../lib/constant_data";
import { deleteSvg, editSvg } from "../../../../svgs";
import { useDispatch } from "react-redux";
import { setOpenDrawer } from "../../../../redux/slices/editBagSlice";

const BagsTable = () => {
  const dispatch = useDispatch();
  const decideStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-pinkBgOne text-pinkTextOne";
      case "past":
        return "bg-grayFive text-grayFour";
      case "scheduled":
        return "bg-scheduledBg text-badgeScheduled";
      default:
        break;
    }
  };

  const handleEditClick = () => {
    dispatch(setOpenDrawer(true));
  };

  return (
    <div className="no-scrollbar w-full  overflow-y-hidden">
      <table className="w-full table-auto truncate overflow-hidden bg-white">
        <thead>
          <tr className="border-b-[1px] border-grayOne border-dashed border-opacity-45 text-sm font-semibold text-grayOne">
            <th className="pb-[8px] pl-[5%] pt-[18px] text-left w-[18.00%]">
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
          {bags.map((bag, index) => (
            <tr
              key={index}
              className="cursor-pointer border-b-[1px] border-[#E4E4E4] border-dashed hover:bg-[#f8f7f7]"
            >
              <td className="truncate pl-2 lg:pl-[5%] pr-2 w-[14.28%]">
                <div className="py-3">
                  <div className="flex flex-row items-center gap-x-2">
                    <div className="flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full">
                      <Image
                        src="/User.png"
                        alt="GetSpouse Logo"
                        className="h-full w-full object-cover"
                        width={40}
                        height={40}
                        priority
                      />
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <p className="text-sm font-medium">{bag.title}</p>
                    </div>
                  </div>
                </div>
              </td>
              <td className="truncate text-center px-2">
                <p className="text-sm font-semibold text-grayThree">
                  {bag.size}
                </p>
              </td>
              <td className="truncate text-center px-2">
                <p className="text-sm font-semibold text-grayThree">
                  {bag.dailyServe}
                </p>
              </td>
              <td className="truncate text-center px-2">
                <p className="text-sm font-semibold text-grayThree">
                  {bag.inStock}
                </p>
              </td>
              <td className="truncate text-center px-2">
                <p className="text-sm font-semibold text-grayThree">
                  € {bag.bagPrice}
                </p>
              </td>
              <td className="truncate text-center px-2">
                <div
                  className={`mx-auto ${decideStyle(
                    bag.status.toLowerCase()
                  )} font-semibold rounded-[4px] text-[12px] w-[77px] h-[26px] p-1`}
                >
                  <p>{bag.status}</p>
                </div>
              </td>
              <td className="truncate text-center">
                <div className="flex flex-row justify-center">
                  <button
                    onClick={() => handleEditClick()}
                    className="rounded-md bg-tableButtonBackground p-2 hover:bg-gray-200 hover:p-2"
                  >
                    {editSvg}
                  </button>
                  <button className="rounded-md bg-tableButtonBackground p-2 hover:bg-gray-200 hover:p-2">
                    {deleteSvg}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BagsTable;
