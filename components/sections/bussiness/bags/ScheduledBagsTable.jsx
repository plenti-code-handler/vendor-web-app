"use client";
import React from "react";
import Image from "next/image";
import { bags } from "../../../../lib/constant_data";
import { deleteSvg, editSvg } from "../../../../svgs";
import LoadMoreButton from "../../../buttons/LoadMoreButton";

const ScheduledBagsTable = () => {
  return (
    <div className="no-scrollbar w-full  overflow-y-hidden">
      <table className="w-full table-auto truncate overflow-hidden bg-white">
        <thead>
          <tr className="border-b-[1px] border-grayOne border-opacity-45 border-dashed text-sm font-semibold text-grayOne">
            <th className="pb-[8px] pl-2 pt-[18px] text-left w-[14.28%]">
              Bag Deal Title
            </th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Size</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Daily Serve</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">In Stock</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Bag Price</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Date</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bags.map((bag, index) => (
            <tr
              key={index}
              className="cursor-pointer border-b-[1px] border-[#E4E4E4] border-dashed hover:bg-[#f8f7f7]"
            >
              <td className="truncate pl-2 pr-2 w-[14.28%]">
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
                <p className="text-sm font-semibold text-grayThree">
                  10/01/2023, 10:30 - 12:30
                </p>
              </td>
              <td className="truncate text-center">
                <div className="flex flex-row justify-center">
                  <div className="rounded-md bg-tableButtonBackground p-2 hover:bg-gray-200 hover:p-2">
                    {editSvg}
                  </div>
                  <div className="rounded-md bg-tableButtonBackground p-2 hover:bg-gray-200 hover:p-2">
                    {deleteSvg}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <LoadMoreButton />
    </div>
  );
};

export default ScheduledBagsTable;
