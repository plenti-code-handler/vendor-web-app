"use client";
import { searchSvg } from "../../svgs";
import React, { useState } from "react";

const SearchField = () => {
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div
      className="flex w-full max-w-[300px] items-center gap-x-2 rounded-2xl bg-white px-5"
      style={{
        boxShadow: "0px 1.999px 7.994px 0px rgba(153, 153, 153, 0.20)",
      }}
    >
      {searchSvg}
      <input
        type="text"
        placeholder="Search Order"
        value={search}
        onChange={handleSearchChange}
        className="bg-secondaryBackground w-full rounded-full p-2 pl-4 text-sm text-black text-opacity-45 placeholder:text-sm focus:outline-none"
      />
    </div>
  );
};

export default SearchField;
