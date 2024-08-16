"use client";

import React, { useEffect, useState } from "react";
import {
  crossSvgBox,
  deleteSvgSmall,
  editSvgSmall,
  magnifierSvg,
  plusIconSvg,
  whiteTickSvg,
} from "../../../../svgs";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../../../redux/slices/headerSlice";

const FoodFiltersBox = () => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("Categories"));
  }, [dispatch]);

  const handlePlusClick = () => {
    if (inputValue) {
      handleAddCategory();
    } else {
      setShowInput(true);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClearInput = () => {
    setInputValue("");
  };

  const handleAddCategory = () => {
    if (editingIndex !== null) {
      const updatedCategories = [...categories];
      updatedCategories[editingIndex] = inputValue;
      setCategories(updatedCategories);
      setEditingIndex(null);
    } else {
      setCategories([...categories, inputValue]);
    }
    setInputValue("");
    setShowInput(false);
  };

  const handleEditCategory = (index) => {
    setInputValue(categories[index]);
    setEditingIndex(index);
    setShowInput(true);
  };

  const handleDeleteCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col w-[100%] lg:w-[50%] gap-y-3">
      <div className="flex flex-col gap-5 lg:flex-row lg:gap-12 items-center w-[100%] justify-start lg:justify-between">
        <p className="text-blackTwo xl:ml-10 font-semibold text-[18px] lg:text-[16px] xl:text-[18px] whitespace-nowrap">
          Food Filters
        </p>
        <div className="flex gap-5 lg:flex-grow w-full lg:justify-end justify-between items-center">
          <button
            onClick={handlePlusClick}
            className="bg-pinkBgDark w-[50px] h-[38px] rounded-[6px] flex justify-center items-center flex-shrink-0"
          >
            {inputValue ? whiteTickSvg : plusIconSvg}
          </button>
          <div className="flex flex-grow items-center gap-x-2 rounded-[6px] lg:max-w-[238px] bg-[#F9F9F9] w-full px-5 overflow-hidden ">
            {magnifierSvg}
            <input
              type="text"
              placeholder="Search"
              className="bg-[#F9F9F9] w-[10%]  p-2 text-md text-[#7E8299] placeholder:text-sm placeholder-[#7E8299] placeholder:font-semibold focus:outline-none flex-grow"
            />
          </div>
        </div>
      </div>

      <hr className="border-t-1 border-gray-200 w-full h-[1px]" />

      {/* INPUT BOX */}
      {showInput && (
        <div className="relative flex items-center">
          <input
            className="block w-full placeholder:font-semibold rounded-[6px] border border-gray-300 py-3 px-3 text-[13px] text-black placeholder-[#7E8299] focus:outline-none focus:ring-1 focus:ring-gray-300"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type Category Name"
          />
          <span
            onClick={handleClearInput}
            className="absolute right-3 hover:bg-gray-100 p-1.5 rounded-lg cursor-pointer"
          >
            {crossSvgBox}
          </span>
        </div>
      )}

      {/* CONTENT BOXES */}
      {categories.map((category, index) => (
        <div
          key={index}
          className={`flex justify-between w-full h-[37px] mb-[1%] p-2 ${
            showInput ? "opacity-30 pointer-events-none" : ""
          }`}
        >
          <p className="font-semibold text-[14px] text-blackTwo">{category}</p>
          <div className="flex items-center gap-2">
            <span
              onClick={() => handleDeleteCategory(index)}
              className="w-[30px] h-[30px] rounded-[6px] bg-gray-200 flex justify-center items-center hover:bg-gray-300 hover:cursor-pointer"
            >
              {deleteSvgSmall}
            </span>
            <span
              onClick={() => handleEditCategory(index)}
              className="w-[30px] h-[30px] rounded-[6px] bg-gray-200 flex justify-center items-center hover:bg-gray-300 hover:cursor-pointer"
            >
              {editSvgSmall}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodFiltersBox;
