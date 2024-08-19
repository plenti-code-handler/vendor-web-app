"use client";
import React from "react";
import Image from "next/image";
import { approvalsData } from "../../../../lib/constant_data";
import { redCrossSvg, whiteTickSvg } from "../../../../svgs";
import LoadMoreButton from "../../../buttons/LoadMoreButton";

const ApprovalsTable = () => {
  return (
    <div className="no-scrollbar w-full overflow-y-hidden lg:pl-10 lg:pr-10">
      <table className="w-full table-auto truncate overflow-hidden rounded-2xl bg-white">
        <thead>
          <tr className="border-b-[1px] border-grayOne border-dashed border-opacity-20 text-sm font-semibold text-grayOne">
            <th className="pb-[8px] pl-2 pt-[18px] text-left w-[18.00%]">
              Business Name
            </th>
            <th className="pb-[8px] px-12 pt-[18px] text-left w-[20.00%]">
              Address
            </th>
            <th className="pb-[8px] px-2 pt-[18px] text-left w-[30.00%]">
              Description
            </th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">
              Submitted at
            </th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {approvalsData.map((user, index) => (
            <tr
              key={index}
              className="cursor-pointer border-b-[1px] border-[#E4E4E4] hover:bg-[#f8f7f7] border-dashed"
            >
              <td className="truncate pl-2 pr-2 w-[18.00%]">
                <div className="py-3">
                  <div className="flex flex-row items-center gap-x-4">
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
              <td className="truncate text-center px-2 w-[18.00%]">
                <p className="text-sm font-semibold text-grayThree">
                  {user.address}
                </p>
              </td>
              <td
                className="relative text-left px-2 w-[15.00%]"
                title={user.description}
              >
                <p
                  className="text-sm font-semibold text-grayThree truncate overflow-hidden whitespace-nowrap tooltip-target"
                  style={{ maxWidth: "280px" }}
                >
                  {user.description}
                </p>
              </td>
              <td className="truncate text-center px-2">
                <p className="text-sm font-semibold text-grayThree">
                  {user.submittedAt}
                </p>
              </td>
              <td className="truncate text-center ">
                <div className="flex flex-row justify-center gap-2">
                  <button className="rounded-md bg-white border border-redOne p-3 hover:bg-red-50">
                    {redCrossSvg}
                  </button>
                  <button className="rounded-md bg-secondary p-2 hover:bg-main">
                    {whiteTickSvg}
                  </button>
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

export default ApprovalsTable;
