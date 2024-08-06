import React from "react";
import { locationIconSvg } from "../../../../svgs";
import Tabs from "./Tabs";

const ProfileCard = () => {
  return (
    <div className="flex flex-col gap-5 w-[100%] lg:w-[50%] md:w-[60%]">
      <div className="flex space-x-4">
        <img
          alt="User"
          src="/User.png"
          className="rounded-full h-24 w-24 sm:h-40 sm:w-40 object-cover"
        />
        <div className="flex flex-col lg:mt-5 lg:gap-y-2">
          <p className="text-lg font-semibold text-gray-900">McDonald's</p>
          <div className="flex items-center text-gray-600 space-x-2">
            {locationIconSvg}
            <p className="text-sm">1425 Edinburg, United Kingdom</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="bg-mainThree border border-mainThree rounded-md px-3 py-1">
              <p className="text-mainTwo text-sm font-medium">Category 1</p>
            </div>
            <div className="bg-mainThree border border-mainThree rounded-md px-3 py-1">
              <p className="text-mainTwo text-sm font-medium">Category 2</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-left leading-5 text-grayThree font-medium">
        Outlines keep you honest. They stop you from indulging in poorly
        thought-out metaphors about driving and keep you focused on the overall
        structure of your post.
      </p>
      <Tabs/>
    </div>
  );
};

export default ProfileCard;
