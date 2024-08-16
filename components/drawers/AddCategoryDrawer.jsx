"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDrawer } from "../../redux/slices/addCategorySlice";
import { useState } from "react";

const initialCategoryItems = [
  { id: 1, text: "Category 1", selected: true },
  { id: 2, text: "Category 2", selected: true },
  { id: 3, text: "Category 3", selected: false },
  { id: 4, text: "Category 4", selected: false },
  { id: 5, text: "Category 5", selected: false },
  { id: 6, text: "Category 6", selected: false },
  { id: 7, text: "Category 7", selected: false },
  { id: 8, text: "Category 8", selected: false },
];

const AddCategoryDrawer = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.addCategory.drawerOpen);

  const handleClose = () => {
    dispatch(setOpenDrawer(false));
  };

  const [selectedItems, setSelectedItems] = useState(initialCategoryItems);

  const handleToggle = (clickedItem) => {
    setSelectedItems((prevState) =>
      prevState.map((item) =>
        item.id === clickedItem.id
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-999999">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 overflow-hidden rounded-md">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-4">
            <DialogPanel
              transition
              className="pointer-events-auto relative lg:w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-5 shadow-xl">
                <DialogTitle className="flex px-4 sm:px-6 justify-between text-[24px] font-[500]">
                  Add Category
                </DialogTitle>
                <hr className="my-3 w-[90%] border-gray-300 ml-8" />
                <div className="relative mt-3 pb-3 flex-1 px-4 sm:px-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2 flex-wrap">
                      {selectedItems.map((item) => (
                        <p
                          key={item.id}
                          onClick={() => handleToggle(item)}
                          className={`border text-[14px] border-gray px-[8px] rounded-[50px] py-[3px] hover:cursor-pointer transform active:translate-y-[2px] ${
                            item.selected && "text-secondary border-secondary"
                          }`}
                        >
                          {item.text}
                        </p>
                      ))}
                    </div>
                    <button className="flex justify-center mt-4 bg-pinkBgDark text-white font-semibold py-2  rounded hover:bg-pinkBgDarkHover2 gap-2 lg:w-[100%]">
                      Add Category
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

export default AddCategoryDrawer;
