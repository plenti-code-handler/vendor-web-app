import React from "react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

const cardBaseClasses = "flex flex-col h-full border border-gray-200 rounded-xl pt-5 pl-6 pb-4 pr-6 w-full text-left transition-all duration-200 ease-out hover:shadow-md hover:border-gray-300 cursor-pointer";

const Card = (props) => {
  const content = (
    <>
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-gray-600">
          {props.icon}
        </span>
        <h1 className="text-2xl lg:text-[25px] font-semibold leading-[28px] text-black">
          {props.title}
        </h1>
      </div>
      <h1 className="text-xs lg:text-sm font-semibold text-gray-500 py-4">
        {props.content}
      </h1>
      {props.onViewMore && (
        <div className="flex justify-end mt-auto pt-2 border-t border-gray-100">
          <span className="inline-flex items-center gap-0.5 text-xs text-blue-500">
            View more
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </span>
        </div>
      )}
    </>
  );

  if (props.onViewMore) {
    return (
      <button
        type="button"
        onClick={props.onViewMore}
        className={cardBaseClasses}
      >
        {content}
      </button>
    );
  }

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-xl pt-5 pl-6 pb-4 pr-6 w-full">
      {content}
    </div>
  );
};

export default Card;