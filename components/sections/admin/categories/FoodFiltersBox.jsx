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
import { db } from "../../../../app/firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import Loader from "../../../loader/loader";

const FoodFiltersBox = () => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filters, setFilters] = useState([]);
  const [filteredFilters, setFilteredFilters] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loader, setLoader] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("Categories"));
  }, [dispatch]);

  useEffect(() => {
    const fetchFilters = async () => {
      setLoader(true);
      const filtersCollection = collection(db, "filters");

      try {
        const querySnapshot = await getDocs(filtersCollection);
        const filtersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFilters(filtersList);
        setFilteredFilters(filtersList);
      } catch (error) {
        console.error("Error fetching filters:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchFilters();
  }, []); // Re-run the effect if filters state changes

  const handlePlusClick = () => {
    if (inputValue) {
      if (editingIndex !== null) {
        handleEditFilter(editingIndex); // Call the edit handler
      } else {
        handleAddFilter(); // Call the add handler
      }
    } else {
      setShowInput(true); // Show input field if it's hidden
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClearInput = () => {
    setShowInput(false);
    setInputValue("");
  };

  const handleAddFilter = async () => {
    const filtersCollection = collection(db, "filters");

    try {
      if (editingIndex !== null) {
        // Update existing filter in Firestore
        setEditingIndex(null);
      } else {
        // Add new filter to Firestore
        await addDoc(filtersCollection, {
          name: inputValue,
        });
      }

      // Refetch the filters to ensure the data is up-to-date
      const querySnapshot = await getDocs(filtersCollection);
      const filtersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFilters(filtersList);
      setFilteredFilters(filtersList);
    } catch (error) {
      console.error("Error adding/updating filter:", error);
    }

    setInputValue("");
    setShowInput(false);
  };

  const handleEditFilter = async (id) => {
    const filterToUpdate = filters.find((filter) => filter.id === id);

    // Set the input value to the name of the filter being edited
    setInputValue(filterToUpdate.name);
    // Show the input field for editing
    setShowInput(true);
    // Set the editing index to the ID of the filter being edited
    setEditingIndex(id);

    // Function to handle the actual update in Firestore
    const handleFilterUpdate = async () => {
      try {
        const filterDocRef = doc(db, "filters", id);
        await updateDoc(filterDocRef, {
          name: inputValue, // Update the name field in Firestore
        });

        console.log("Filter updated successfully.");

        // Refetch the filters from Firestore to refresh the data
        const filtersCollection = collection(db, "filters");
        const querySnapshot = await getDocs(filtersCollection);
        const filtersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFilters(filtersList);
        setFilteredFilters(filtersList);

        // Reset input and hide input field after update
        setInputValue("");
        setEditingIndex(null);
        setShowInput(false);
      } catch (error) {
        console.error("Error updating filter:", error);
      }
    };

    // Update the filter when the user submits the updated name
    setShowInput(true);
    setInputValue(filterToUpdate.name);

    const handleInputConfirm = async () => {
      if (editingIndex) {
        await handleFilterUpdate();
      }
    };

    handleInputConfirm();
  };

  const handleDeleteFilter = async (index) => {
    try {
      // Delete the filter from Firestore
      const filterDocRef = doc(db, "filters", index);
      await deleteDoc(filterDocRef);

      // Optionally, refetch the filters to ensure the data is up-to-date
      const filtersCollection = collection(db, "filters");
      const querySnapshot = await getDocs(filtersCollection);
      const filtersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFilters(filtersList);
      setFilteredFilters(filtersList);
    } catch (error) {
      console.error("Error deleting filter:", error);
    }
  };

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredFilters(filters);
    } else {
      const filtered = filters.filter((filter) =>
        filter.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFilters(filtered);
    }
  }, [searchTerm]);

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col w-[100%] lg:w-[50%] gap-y-3">
      <div className="flex flex-col gap-5 lg:flex-row lg:gap-4 items-center w-[100%] justify-start lg:justify-between">
        <p className="text-blackTwo font-semibold text-lg lg:text-base xl:text-lg xl:ml-10 whitespace-nowrap">
          Food Filters
        </p>
        <div className="flex gap-5 lg:flex-grow w-full justify-between lg:justify-end items-center">
          <button
            onClick={handlePlusClick}
            className="bg-pinkBgDark w-[50px] h-[38px] rounded-[6px] flex justify-center items-center flex-shrink-0"
          >
            {inputValue ? whiteTickSvg : plusIconSvg}
          </button>
          <div className="flex flex-grow items-center gap-x-2 rounded-[6px] bg-[#F9F9F9] px-5 overflow-hidden w-full lg:max-w-[238px]">
            {magnifierSvg}
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            placeholder="Type Filter Name"
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
      {filteredFilters.length > 0 ? (
        filteredFilters.map((filter) => (
          <div
            key={filter.id}
            className={`flex justify-between w-full h-[37px] mb-[1%] p-2 ${
              showInput ? "opacity-30 pointer-events-none" : ""
            }`}
          >
            <p className="font-semibold text-sm text-blackTwo">{filter.name}</p>
            <div className="flex items-center gap-2">
              <span
                onClick={() => handleDeleteFilter(filter.id)}
                className="w-[30px] h-[30px] rounded-[6px] bg-gray-200 flex justify-center items-center hover:bg-gray-300 hover:cursor-pointer"
              >
                {deleteSvgSmall}
              </span>
              <span
                onClick={() => handleEditFilter(filter.id)}
                className="w-[30px] h-[30px] rounded-[6px] bg-gray-200 flex justify-center items-center hover:bg-gray-300 hover:cursor-pointer"
              >
                {editSvgSmall}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div colSpan="10" className="text-center py-10 text-grayOne">
          No Food Filters Found
        </div>
      )}
    </div>
  );
};

export default FoodFiltersBox;
