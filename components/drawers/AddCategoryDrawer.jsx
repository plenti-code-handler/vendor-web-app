"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDrawer } from "../../redux/slices/addCategorySlice";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../app/firebase/config";
import { getUserLocal } from "../../redux/slices/loggedInUserSlice";

const AddCategoryDrawer = ({ items, setCategories: updateCategories }) => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const open = useSelector((state) => state.addCategory.drawerOpen);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Reference to the `categories` collection
        const colRef = collection(db, "categories");

        // Fetch all documents from the collection
        const snapshot = await getDocs(colRef);

        // Extract data and format it
        const fetchedCategories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          selected: items.some((item) => item.id === doc.id), // Set selected property based on `items` prop
        }));

        // Update state with fetched categories
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [items]); // Depend on `items` so that the effect runs when `items` prop changes

  const handleClose = () => {
    dispatch(setOpenDrawer(false));
  };

  const handleToggle = (clickedItem) => {
    setCategories((prevCategories) =>
      prevCategories.map((item) =>
        item.id === clickedItem.id
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const handleSubmit = async () => {
    const user = getUserLocal();

    if (!user || !user.uid) {
      console.error("User is not logged in or user ID is missing.");
      return;
    }

    try {
      // Filter and format selected categories
      const formattedCategory = categories
        .filter((category) => category.selected) // Keep only selected categories
        .map(({ selected, ...rest }) => rest); // Remove the `selected` property

      // Reference to the user document
      const userRef = doc(db, "users", user.uid);

      // Update the user document with the formatted categories
      await updateDoc(userRef, {
        categories: formattedCategory,
      });

      console.log("User profile updated successfully");
      handleClose();
      if (!user || !user.uid) return; // Ensure user is available

      try {
        const userDocRef = doc(db, "users", user.uid); // Reference to user document
        const userDocSnapshot = await getDoc(userDocRef); // Fetch document snapshot

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData.categories) {
            updateCategories(userData.categories);
          } else {
            updateCategories([]); // Handle case where `categories` field is missing
          }
        } else {
          console.log("No such document!");
          updateCategories([]); // Handle case where document does not exist
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
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
                      {categories.map((item) => (
                        <p
                          key={item.id}
                          onClick={() => handleToggle(item)}
                          className={`border text-[14px] border-gray px-[8px] rounded-[50px] py-[3px] hover:cursor-pointer transform active:translate-y-[2px] ${
                            item.selected
                              ? "text-secondary border-secondary"
                              : ""
                          }`}
                        >
                          {item.name}
                        </p>
                      ))}
                    </div>
                    <button
                      onClick={handleSubmit}
                      className="flex justify-center mt-4 bg-pinkBgDark text-white font-semibold py-2 rounded hover:bg-pinkBgDarkHover2 gap-2 lg:w-[100%]"
                    >
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
