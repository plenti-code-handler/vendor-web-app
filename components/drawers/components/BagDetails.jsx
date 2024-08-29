import { Textarea } from "@headlessui/react";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../app/firebase/config";

const BagDetails = ({
  selectedTags,
  selectedCategories,
  setSelectedTags,
  setSelectedCategories,
  description,
  setDescription,
  stock,
  setStock,
}) => {
  const [tagInput, setTagInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");

  const [showTagOptions, setShowTagOptions] = useState(false);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      const tagsCollection = collection(db, "filters");
      const tagsSnapshot = await getDocs(tagsCollection);
      const tagsList = tagsSnapshot.docs.map((doc) => doc.data().name);
      setAllTags(tagsList);
    };

    fetchTags();
  }, []);

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
    setShowTagOptions(true);
  };

  const handleCategoryInputChange = (e) => {
    setCategoryInput(e.target.value);
    setShowCategoryOptions(true);
  };

  const handleTagSelect = (tag) => {
    setSelectedTags((prevTags) => [...prevTags, tag]);
    setTagInput("");
    setShowTagOptions(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategories((prevCategories) => [...prevCategories, category]);
    setCategoryInput("");
    setShowCategoryOptions(false);
  };

  const handleTagRemove = (tag) => {
    setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
  };

  const handleCategoryRemove = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.filter((c) => c !== category)
    );
  };
  // const allTags = ["Gluten Free", "Something", "IDK", "Hell"];
  const allCategories = [
    "Category Name 1",
    "Category Name 2",
    "Category Name 3",
    "Category Name 4",
  ];
  // const filteredTags = allTags.filter(
  //   (tag) =>
  //     tag.toLowerCase().includes(tagInput.toLowerCase()) &&
  //     !selectedTags.includes(tag)
  // );

  const filteredTags = allTags.filter(
    (tag) =>
      tag.toLowerCase().includes(tagInput.toLowerCase()) &&
      !selectedTags.includes(tag)
  );

  const filteredCategories = allCategories.filter(
    (category) =>
      category.toLowerCase().includes(categoryInput.toLowerCase()) &&
      !selectedCategories.includes(category)
  );
  return (
    <>
      <div className="flex flex-col pb-5 mt-5">
        <p className="text-black font-bold text-[20px]">Bag Details</p>
      </div>
      <Textarea
        className="block w-full placeholder:font-bold resize-none rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        rows={6}
        placeholder="Description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="mt-3 border border-gray-300 p-2 rounded-md">
        <div
          className={`flex flex-wrap gap-2 ${
            selectedTags.length > 0 && "mb-3"
          }`}
        >
          {selectedTags.map((tag) => (
            <div
              key={tag}
              className="border border-main text-secondary px-2 py-1 rounded-2xl flex items-center gap-1"
            >
              <span>{tag}</span>
              <button onClick={() => handleTagRemove(tag)}>x</button>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search Tags"
          value={tagInput}
          onChange={handleTagInputChange}
          onFocus={() => setShowTagOptions(true)}
          onBlur={() => setTimeout(() => setShowTagOptions(false), 200)}
          className="w-full py-2 px-3 rounded-lg placeholder:font-bold"
        />
        {showTagOptions && filteredTags.length > 0 && (
          <div className="mt-2 border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
            {filteredTags.map((tag) => (
              <div
                key={tag}
                className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleTagSelect(tag)}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* <div className="mt-3 border border-gray-300 p-2 rounded-md">
        <div
          className={`flex flex-wrap gap-2 ${
            selectedCategories.length > 0 && "mb-3"
          }`}
        >
          {selectedCategories.map((category) => (
            <div
              key={category}
              className="border border-main text-secondary px-2 py-1 rounded-2xl flex items-center gap-1"
            >
              <span>{category}</span>
              <button onClick={() => handleCategoryRemove(category)}>x</button>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search Categories"
          value={categoryInput}
          onChange={handleCategoryInputChange}
          onFocus={() => setShowCategoryOptions(true)}
          onBlur={() => setTimeout(() => setShowCategoryOptions(false), 200)}
          className="w-full py-2 px-3 rounded-lg placeholder:font-bold"
        />
        {showCategoryOptions && filteredCategories.length > 0 && (
          <div className="mt-2 border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
            {filteredCategories.map((category) => (
              <div
                key={category}
                className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </div>
            ))}
          </div>
        )}
      </div> */}
      <div className="relative flex mt-3 items-center">
        <input
          className="block w-full  placeholder:font-bold rounded-lg border border-gray-300 py-4 px-5 text-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Quantity"
          value={stock}
          type="number"
          onChange={(e) => setStock(e.target.value)}
        />
        <span className="absolute right-3 text-black font-bold"></span>
      </div>
    </>
  );
};

export default BagDetails;
