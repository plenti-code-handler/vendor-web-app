"use client";
import React from "react";
import DetailsTableUpper from "./DetailsTableUpper";
import { users } from "../../../../lib/constant_data";
import LoadMoreButton from "../../../buttons/LoadMoreButton";

const CustomerDetailTable = () => {
  return (
    <div className="mt-4 w-full border border-gray-200 rounded-xl p-6 sm:px-4">
      <DetailsTableUpper />
      <div className="no-scrollbar w-full overflow-y-hidden">
        <table
          className="w-full table-auto truncate overflow-hidden rounded-2xl bg-white"
        >
          <thead>
            <tr className="border-b-[1px] border-grayOne border-dashed text-sm font-semibold text-grayOne">
              <th className="pb-[8px] px-[3%] pt-[18px] text-left">Deal Name</th>
              <th className="pb-[8px] px-2 pt-[18px] text-center">Size</th>
              <th className="pb-[8px] px-2 pt-[18px] text-center">Quantity</th>
              <th className="pb-[8px] px-2 pt-[18px] text-center">Amount</th>
              <th className="pb-[8px] px-2 pt-[18px] text-center">
                Order Date
              </th>
              <th className="pb-[8px] px-2 pt-[18px] text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                className="cursor-pointer border-b-[1px] border-[#E4E4E4] border-dashed hover:bg-[#f8f7f7] h-[60px] w-[50px]"
              >
                <td className="truncate text-left px-[3%]">
                  <p className="text-sm font-semibold text-grayThree">
                    {user.dealName}
                  </p>
                </td>
                <td className="truncate text-center px-2">
                  <p className="text-sm font-semibold text-grayThree">
                    {user.size}
                  </p>
                </td>
                <td className="truncate text-center px-2">
                  <p className="text-sm font-semibold text-grayThree">
                    {user.quantity}
                  </p>
                </td>
                <td className="truncate text-center px-2">
                  <p className="text-sm font-semibold text-grayThree">
                    € {user.amount}
                  </p>
                </td>
                <td className="truncate text-center px-2">
                  <p className="text-sm font-semibold text-grayThree">
                    {user.orderDate}
                  </p>
                </td>
                <td className="truncate text-center px-2">
                  <div
                    className={`mx-auto ${
                      user.status.toLowerCase() == "picked"
                        ? "bg-pickedBg text-pickedText "
                        : "bg-notPickedBg text-notPickedText"
                    } font-semibold rounded-[4px] text-[12px] w-[77px] h-[26px] p-1 `}
                  >
                    <p>{user.status}</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <LoadMoreButton/>
    </div>
  );
};

export default CustomerDetailTable;
