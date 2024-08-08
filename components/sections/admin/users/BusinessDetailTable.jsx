"use client";
import React from "react";
import Image from "next/image";
import DetailsTableUpper from "./DetailsTableUpper";
import { users } from "../../../../lib/constant_data";

const BusinessDetailTable = () => {
  return (
    <div className="mt-4 w-full border border-gray-300 rounded-md p-6 sm:px-4">
      <DetailsTableUpper />
      <div className="no-scrollbar w-full  overflow-y-hidden">
        <table
          className="w-full table-auto truncate overflow-hidden rounded-2xl bg-white"
          style={{ boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.10)" }}
        >
          <thead>
            <tr className="border-b-[1px] border-grayOne border-opacity-20 text-sm font-semibold text-grayOne">
              <th className="pb-[8px] pl-2 pt-[18px] text-left w-[14.28%]">
                CUSTOMER
              </th>
              <th className="pb-[8px] px-2 pt-[18px] text-center">Deal Name</th>
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
                className="cursor-pointer border-b-[1px] border-[#E4E4E4] hover:bg-[#f8f7f7]"
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
                        <p className="text-sm font-medium">{user.name}</p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="truncate text-center px-2">
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
                        ? "bg-pickedBg text-pickedText w-20 pl-4 pr-4 pt-2"
                        : "bg-notPickedBg text-notPickedText w-20 pl-0 pr-0 pt-2"
                    } font-semibold p-1 rounded-md text-sm`}
                  >
                    <p>{user.status}</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusinessDetailTable;
