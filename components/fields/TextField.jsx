import React from "react";

const TextField = (props) => {
  return (
    <input
      type="text"
      className="block w-full placeholder:font-bold rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
      placeholder={props.placeholder}
    />
  );
};

export default TextField;
