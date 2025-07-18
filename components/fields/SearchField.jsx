"use client";
import { magnifierSvg } from "../../svgs";
import React, { useState } from "react";

const SearchField = ({ placeholder, setSearchTerm }) => {
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setSearchTerm(value);
  };

  return (
    <div className="flex lg:w-[300px] md:w-auto w-full items-center gap-x-2 rounded-[6px] bg-grayFive px-5">
      {magnifierSvg}
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={handleSearchChange}
        className="bg-grayFive w-full rounded-full p-2 pl-4 text-sm text-black text-opacity-45 placeholder:text-sm placeholder-grayFour focus:outline-none"
      />
    </div>
  );
};

export default SearchField;
