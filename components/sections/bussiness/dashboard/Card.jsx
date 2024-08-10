import React from "react";

const Card = (props) => {
  return (
    <div className="flex flex-col border border-gray-200 rounded-xl pt-6 pl-6 pb-14 pr-8 w-full lg:w-[90%]">
      <h1 className="text-[24px] lg:text-[34px] font-semibold leading-[28px] text-black">
        {props.title}
      </h1>
      <h1 className="text-[14px] font-semibold leading-[28px] text-gray-500 py-4">
        {props.content}
      </h1>
    </div>
  );
};

export default Card;
