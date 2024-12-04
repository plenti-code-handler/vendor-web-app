"use client";
import SearchField from "../../../fields/SearchField";
import React, { useEffect, useState } from "react";
import BagsFilter from "../../../dropdowns/BagsFilter";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../../../redux/slices/headerSlice";

const TableUpper = ({ selectedFilter, onFilterChange, setSearchTerm }) => {
  const dispatch = useDispatch();
  const [currLang, setCurrLang] = useState("en");

    useEffect(() => {
      if (typeof window !== "undefined") {
        const updateLangFromStorage = () => {
          const storedLang = localStorage.getItem("lang");
          if (storedLang) {
            setCurrLang(storedLang);
          }
        };

        const timeoutId = setTimeout(() => {
          updateLangFromStorage();
          window.addEventListener("storage", updateLangFromStorage);
        }, 2000);
        return () => {
          clearTimeout(timeoutId);
          window.removeEventListener("storage", updateLangFromStorage);
        };
      }
    }, []);

    useEffect(() => {
      if (typeof window !== "undefined" && document.body) {
        document.body.setAttribute("lang", currLang);
      }
    }, [currLang]);

  
  useEffect(() => {
    dispatch(setActivePage("Manage Pouches"));
  }, [dispatch]);


  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4 px-2 sm:px-4">
      <p className="text-xl font-bold text-blackTwo hidden sm:block">
        {`My ${currLang === "en" ? "Bags" : "Pouches"}`}
      </p>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <BagsFilter
          selectedFilter={selectedFilter}
          onFilterChange={onFilterChange}
        />
        <SearchField
          setSearchTerm={setSearchTerm}
          placeholder={`Search ${currLang === "en" ? "Bag" : "Pouche"}`}
        />
      </div>
    </div>
  );
};

export default TableUpper;
