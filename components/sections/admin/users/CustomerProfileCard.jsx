import { filesEmailSvg, locationIconSvg } from "../../../../svgs";
import React from "react";

const CustomerProfileCard = () => {
  return (
    <>
      <div className="flex space-x-4">
        <img
          alt="User"
          src="/User.png"
          className="rounded-full h-24 w-24 sm:h-25 sm:w-25 object-cover"
        />
        <div className="flex mt-2 lg:mt-0">
          <div className="flex flex-col lg:mt-5 lg:gap-y-2">
            <p className="text-lg font-semibold text-gray-900">McDonald's</p>
            <div className="flex items-center text-gray-600 space-x-2">
              {filesEmailSvg}
              <p className="text-sm">iamzaibi305@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerProfileCard;
