"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Textarea,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setOpenDrawer } from "../../redux/slices/addBagSlice";

const AddBagDrawer = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.addBag.drawerOpen);
  const [selectedBagType, setSelectedBagType] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showTagOptions, setShowTagOptions] = useState(false);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [numberOfBags, setNumberOfBags] = useState(0);

  const handleClose = () => {
    dispatch(setOpenDrawer(false));
  };

  const handleBagTypeClick = (type) => {
    setSelectedBagType(type);
  };

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

  const bagTypes = ["Surprise", "Large", "Small"];
  const allTags = ["Gluten Free", "Something", "IDK", "Hell"];
  const allCategories = [
    "Category Name 1",
    "Category Name 2",
    "Category Name 3",
    "Category Name 4",
  ];

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

  const handleIncrease = () => {
    setNumberOfBags((prevCount) => prevCount + 1);
  };

  const handleDecrease = () => {
    setNumberOfBags((prevCount) => Math.max(prevCount - 1, 0));
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-999999">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden rounded-md">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-5 shadow-xl">
                <DialogTitle className="flex px-4 sm:px-6 justify-between ">
                  <input
                    type="text"
                    placeholder="Bag Deal Title"
                    className="placeholder-grayThree font-semibold text-lg"
                  />
                  <button className="flex text-center justify-between bg-pinkBgDark text-white font-semibold py-2 px-7 rounded hover:bg-pinkBgDarkHover gap-2 lg:w-[25%]">
                    Add
                  </button>
                </DialogTitle>
                <hr className="my-3 w-[90%] border-gray-300 ml-8" />
                <div className="relative mt-3 pb-3 flex-1 px-4 sm:px-6">
                  <div className="flex flex-col pb-5">
                    <p className="text-black font-bold text-[20px]">
                      Choose Bag Type
                    </p>
                  </div>
                  <div className="flex gap-5">
                    {bagTypes.map((type) => (
                      <div
                        key={type}
                        onClick={() => handleBagTypeClick(type)}
                        className={`flex flex-col h-30 w-30 pr-5 pl-5 pb-3 pt-3 items-center rounded-lg shadow-lg transform transition-transform hover:translate-y-[-5px] ${
                          selectedBagType === type
                            ? "bg-mainLight opacity-90 border-2 border-main"
                            : "bg-white"
                        }`}
                      >
                        <img alt="Bag" src="/bag.png" className="rounded-md" />
                        <p
                          className={`text-[14px] font-semibold mt-2 ${
                            selectedBagType === type
                              ? "text-black font-bold"
                              : "text-black"
                          }`}
                        >
                          {type}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col pb-5 mt-5">
                    <p className="text-black font-bold text-[20px]">
                      Bag Details
                    </p>
                  </div>
                  <Textarea
                    className="block w-full placeholder:font-bold resize-none rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                    rows={4}
                    placeholder="Description..."
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
                          <button onClick={() => handleTagRemove(tag)}>
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Search Tags"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onFocus={() => setShowTagOptions(true)}
                      onBlur={() =>
                        setTimeout(() => setShowTagOptions(false), 200)
                      }
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
                  <div className="mt-3 border border-gray-300 p-2 rounded-md">
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
                          <button
                            onClick={() => handleCategoryRemove(category)}
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Search Categories"
                      value={categoryInput}
                      onChange={handleCategoryInputChange}
                      onFocus={() => setShowCategoryOptions(true)}
                      onBlur={() =>
                        setTimeout(() => setShowCategoryOptions(false), 200)
                      }
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
                  </div>
                  <div className="flex justify-between items-center mt-3 pl-1 pr-1">
                    <p className="text-black font-semibold text-[16px]">
                      Bags per day
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDecrease}
                        className="bg-white border border-gray-400  text-gray-800 px-2 rounded-xl hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span>{numberOfBags}</span>
                      <button
                        onClick={handleIncrease}
                        className="bg-black text-white px-2 rounded-xl hover:bg-gray-800"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col pb-5 mt-4 gap-2">
                    <p className="text-black font-bold text-[20px]">
                      Date & Time
                    </p>
                    <input
                      className="block w-full placeholder:font-bold rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Select Date(s)"
                    />
                    <div className="flex gap-4">
                      <input
                        className="block w-full placeholder:font-bold rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Start Time"
                      />
                      <input
                        className="block w-full placeholder:font-bold rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="End Time"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col pb-5 gap-3">
                    <p className="text-black font-bold text-[20px]">Pricing</p>
                    <div className="relative flex items-center">
                      <input
                        className="block w-full placeholder:font-bold rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Pricing for Bag"
                      />
                      <span className="absolute right-3 text-black font-bold">
                        €
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        className="block w-full placeholder:font-bold rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Original Price"
                      />
                      <span className="absolute right-3 text-black font-bold">
                        €
                      </span>
                    </div>

                    <button className="flex justify-center bg-pinkBgDark text-white font-semibold py-2  rounded hover:bg-pinkBgDarkHover gap-2 lg:w-[100%]">
                      Add Bag
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddBagDrawer;
