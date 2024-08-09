import React from "react";

const TransactionCard = (props) => {
  return (
    <div
      className={`flex flex-col border border-gray-200 rounded-[12px] h-[140px] justify-center pl-8 ${
        props.smallScreen ? "w-[100%]" : "w-[50%]"
      }`}
    >
      <h1
        className={`text-[34px] lg:text-[34px] font-semibold leading-[28px] ${props.textColor}`}
      >
        {props.title}
      </h1>
      <h1 className="text-[14px] font-semibold leading-[28px] text-[#A1A5B7] py-4">
        {props.content}
      </h1>
    </div>
  );
};

export default TransactionCard;
