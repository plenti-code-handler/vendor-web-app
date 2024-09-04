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

const RestaurentBox = () => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("Categories"));
  }, [dispatch]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoader(true);
      const categoriesCollection = collection(db, "categories");

      try {
        const querySnapshot = await getDocs(categoriesCollection);
        const categoriesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchCategories();
  }, []); // Re-run the effect if categories state changes

  const handlePlusClick = () => {
    if (inputValue) {
      if (editingIndex !== null) {
        handleEditCategory(editingIndex); // Call the edit handler
      } else {
        handleAddCategory(); // Call the add handler
      }
    } else {
      setShowInput(true); // Show input field if it's hidden
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClearInput = () => {
    setInputValue("");
  };

  const handleAddCategory = async () => {
    const categoriesCollection = collection(db, "categories");

    try {
      if (editingIndex !== null) {
        // Update existing category in Firestore
        setEditingIndex(null);
      } else {
        // Add new category to Firestore
        await addDoc(categoriesCollection, {
          name: inputValue,
        });
      }

      // Refetch the categories to ensure the data is up-to-date
      const querySnapshot = await getDocs(categoriesCollection);
      const categoriesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesList);
    } catch (error) {
      console.error("Error adding/updating category:", error);
    }

    setInputValue("");
    setShowInput(false);
  };

  const handleEditCategory = async (id) => {
    const categoryToUpdate = categories.find((category) => category.id === id);

    // Set the input value to the name of the category being edited
    setInputValue(categoryToUpdate.name);
    // Show the input field for editing
    setShowInput(true);
    // Set the editing index to the ID of the category being edited
    setEditingIndex(id);

    // Function to handle the actual update in Firestore
    const handleCategoryUpdate = async () => {
      try {
        const categoryDocRef = doc(db, "categories", id);
        await updateDoc(categoryDocRef, {
          name: inputValue, // Update the name field in Firestore
        });

        console.log("Category updated successfully.");

        // Refetch the categories from Firestore to refresh the data
        const categoriesCollection = collection(db, "categories");
        const querySnapshot = await getDocs(categoriesCollection);
        const categoriesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesList);

        // Reset input and hide input field after update
        setInputValue("");
        setEditingIndex(null);
        setShowInput(false);
      } catch (error) {
        console.error("Error updating category:", error);
      }
    };

    // Update the category when the user submits the updated name
    setShowInput(true);
    setInputValue(categoryToUpdate.name);

    const handleInputConfirm = async () => {
      if (editingIndex) {
        await handleCategoryUpdate();
      }
    };

    handleInputConfirm();
  };

  const handleDeleteCategory = async (index) => {
    try {
      // Delete the category from Firestore
      const categoryDocRef = doc(db, "categories", index);
      await deleteDoc(categoryDocRef);

      // Optionally, refetch the categories to ensure the data is up-to-date
      const categoriesCollection = collection(db, "categories");
      const querySnapshot = await getDocs(categoriesCollection);
      const categoriesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesList);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col w-[100%] lg:w-[50%] gap-y-3">
      <div className="flex flex-col gap-5 lg:flex-row lg:gap-4 items-center w-[100%] justify-start lg:justify-between">
        <p className="text-blackTwo font-semibold text-[18px] lg:text-[16px] xl:text-[18px] xl:ml-10 whitespace-nowrap">
          Restaurant Categories
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
      {categories.length > 0 ? (
        categories.map((category) => (
          <div
            key={category.id}
            className={`flex justify-between w-full h-[37px] mb-[1%] p-2 ${
              showInput ? "opacity-30 pointer-events-none" : ""
            }`}
          >
            <p className="font-semibold text-[14px] text-blackTwo">
              {category.name}
            </p>
            <div className="flex items-center gap-2">
              <span
                onClick={() => handleDeleteCategory(category.id)}
                className="w-[30px] h-[30px] rounded-[6px] bg-gray-200 flex justify-center items-center hover:bg-gray-300 hover:cursor-pointer"
              >
                {deleteSvgSmall}
              </span>
              <span
                onClick={() => handleEditCategory(category.id)}
                className="w-[30px] h-[30px] rounded-[6px] bg-gray-200 flex justify-center items-center hover:bg-gray-300 hover:cursor-pointer"
              >
                {editSvgSmall}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div colSpan="10" className="text-center py-10 text-grayOne">
          No Restaurant Categories Found
        </div>
      )}
    </div>
  );
};

export default RestaurentBox;
