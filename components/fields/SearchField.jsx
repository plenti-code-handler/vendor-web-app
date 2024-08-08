"use client";
import { magnifierSvg, searchSvg } from "../../svgs";
import React, { useState } from "react";

const SearchField = (props) => {
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex w-full sm:max-w-[300px] items-center gap-x-2 rounded-[6px] bg-grayFive px-5">
      {magnifierSvg}
      <input
        type="text"
        placeholder={props.placeholder}
        value={search}
        onChange={handleSearchChange}
        className="bg-grayFive w-full rounded-full p-2 pl-4 text-sm text-black text-opacity-45 placeholder:text-sm placeholder-grayFour focus:outline-none"
      />
    </div>
  );
};

export default SearchField;
