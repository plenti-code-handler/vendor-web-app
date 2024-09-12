"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDrawer } from "../../redux/slices/editBagSlice";
import BagTypes from "./components/BagTypes";
import BagDetails from "./components/BagDetails";
import BagsPerDay from "./components/BagsPerDay";
import DateSelection from "./components/DateSelection";
import BagPricing from "./components/BagPricing";
import { deleteSvg, recycleSvg, trashSvg } from "../../svgs";
import { useContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../app/firebase/config";
import { getUserLocal } from "../../redux/slices/loggedInUserSlice";
import { BagsContext } from "../../contexts/BagsContext";
import { toast } from "sonner";

const bagTypes = [
  {
    type: "Surprise",
    image: "/surprise.png",
    img: "https://firebasestorage.googleapis.com/v0/b/foodie-finder-ee1d8.appspot.com/o/box1.png?alt=media&token=1786ee59-09c2-46ba-a4a6-8aeab31d4535",
  },
  {
    type: "Large",
    image: "/large.png",
    img: "https://firebasestorage.googleapis.com/v0/b/foodie-finder-ee1d8.appspot.com/o/box2.png?alt=media&token=f7fdb328-c8db-4130-9d5d-7206bbfee479",
  },
  {
    type: "Small",
    image: "/small.png",
    img: "https://firebasestorage.googleapis.com/v0/b/foodie-finder-ee1d8.appspot.com/o/box3.png?alt=media&token=f70fb9b4-390d-4d7b-9b98-546ca588a867",
  },
];

const EditBagDrawer = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.editBag.drawerOpen);
  const bagToEdit = useSelector((state) => state.editBag.bagToEdit);
  const { setBags, setFilteredBags, setLastVisible } = useContext(BagsContext);

  const [selectedBag, setSelectedBag] = useState(bagToEdit?.type || {});
  const [selectedTags, setSelectedTags] = useState(bagToEdit?.tags || []);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [stock, setStock] = useState(bagToEdit?.stock || "");
  const [description, setDescription] = useState(bagToEdit?.desc || "");
  const [numberOfBags, setNumberOfBags] = useState(bagToEdit?.bagaday || 0);
  const [pricing, setPricing] = useState(bagToEdit?.price || "");
  const [originalPrice, setOriginalPrice] = useState("");
  const [selectedDates, setSelectedDates] = useState(bagToEdit?.date || []);
  const [dealTitle, setDealTitle] = useState(bagToEdit?.title || "");
  const [user, setUser] = useState({});
  const [bagId, setBagId] = useState(bagToEdit?.id || "");

  useEffect(() => {
    const user = getUserLocal();
    setUser(user);
  }, []);

  const resetForm = () => {
    setSelectedBag({});
    setSelectedTags([]);
    setSelectedDates([]);
    setDescription("");
    setNumberOfBags(0);
    setPricing("");
    setOriginalPrice("");
    setStock("");
  };

  useEffect(() => {
    if (bagToEdit.date) {
      if (bagToEdit.type === "Surprise") {
        setSelectedBag(bagTypes[0]);
      } else if (bagToEdit.type === "Large") {
        setSelectedBag(bagTypes[1]);
      } else if (bagToEdit.type === "Small") {
        setSelectedBag(bagTypes[2]);
      }
      const initializedDates = bagToEdit.date.map((date) => ({
        ...date,
        isEditable: false,
      }));
      setBagId(bagToEdit.id);
      setSelectedTags(bagToEdit.tags);
      setSelectedDates(initializedDates);
      // setSelectedDates(bagToEdit.date);
      setDescription(bagToEdit.desc);
      setNumberOfBags(bagToEdit.bagaday);
      setPricing(bagToEdit.price);
      setOriginalPrice(bagToEdit.originalprice);
      setDealTitle(bagToEdit.title);
      setStock(bagToEdit.stock);
    }
  }, [bagToEdit]);

  const handleUpdateBag = async () => {
    try {
      // Save the date array in firebase timestamp format
      const updatedDateArray = selectedDates.map((item) => {
        // Combine date with starttime and endtime
        const dateStr = `${item.date}T00:00:00`; // Date with no time for selectedDateTime
        const startDateTimeStr = `${item.date}T${item.starttime}:00`; // Combine date with starttime
        const endDateTimeStr = `${item.date}T${item.endtime}:00`; // Combine date with endtime

        // Create Date objects
        const selectedDateTime = new Date(dateStr); // Date only
        const startDateTime = new Date(startDateTimeStr); // Date with start time
        const endDateTime = new Date(endDateTimeStr); // Date with end time

        // Convert to Firebase timestamps
        return {
          date: Timestamp.fromDate(selectedDateTime),
          starttime: Timestamp.fromDate(startDateTime),
          endtime: Timestamp.fromDate(endDateTime),
        };
      });
      // Reference to the 'bags' collection
      const bagsCollectionRef = doc(db, "bags", bagToEdit.id);

      // Data to be added
      const newBag = {
        bagaday: numberOfBags,
        date: updatedDateArray,
        desc: description,
        img: selectedBag.img,
        loc: user.loc,
        type: selectedBag.type,
        tags: selectedTags,
        resname: user.name,
        resimg: user.imageUrl,
        title: dealTitle,
        stock: Number(stock),
        resuid: user.uid,
        // categories: selectedCategories,
        price: Number(pricing),
        originalprice: Number(originalPrice),
        // createdAt: new Date(), // Optionally add a timestamp
      };

      // Add the document to Firestore
      const docRef = await updateDoc(bagsCollectionRef, newBag);
      toast.success("Bag Edited Successfully");

      // Optionally, reset the form state after successful submission
      resetForm();
      const colRef = collection(db, "bags");
      const q = query(
        colRef,
        where("resuid", "==", user.uid), // Adjusted field to resuid
        // orderBy("time"),
        limit(10)
      );

      const allBagsSnapshot = await getDocs(q);
      const bagsData = allBagsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const lastDoc = allBagsSnapshot.docs[allBagsSnapshot.docs.length - 1];

      setBags(bagsData);
      setFilteredBags(bagsData);
      setLastVisible(lastDoc);
      dispatch(setOpenDrawer(false));
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleClose = () => {
    dispatch(setOpenDrawer(false));
  };

  const handleDelete = async (id) => {
    // Reference to the document to be deleted
    const docRef = doc(db, "bags", id);
    await deleteDoc(docRef);
    toast.success("Bag Deleted Successfully");
    dispatch(setOpenDrawer(false));
    const colRef = collection(db, "bags");
    const q = query(
      colRef,
      where("resuid", "==", user.uid), // Adjusted field to resuid
      // orderBy("time"),
      limit(10)
    );

    const allBagsSnapshot = await getDocs(q);
    const bagsData = allBagsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const lastDoc = allBagsSnapshot.docs[allBagsSnapshot.docs.length - 1];

    setBags(bagsData);
    setFilteredBags(bagsData);
    setLastVisible(lastDoc);
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
              className="pointer-events-auto relative lg:w-screen max-w-[29rem] transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-5 shadow-xl">
                <DialogTitle className="flex px-4 sm:px-6 justify-between ">
                  <input
                    type="text"
                    placeholder="Bag Deal Title"
                    value={dealTitle}
                    onChange={(e) => setDealTitle(e.target.value)}
                    className="placeholder-grayThree text-lg placeholder:font-bold focus:outline-none"
                  />
                  <div className="flex gap-x-2">
                    <button
                      onClick={() => handleDelete(bagId)}
                      className="py-2 px-2 rounded hover:bg-pinkBgDark"
                    >
                      {deleteSvg}
                    </button>
                  </div>
                </DialogTitle>
                <hr className="my-3 w-[90%] border-gray-300 ml-8" />
                <div className="relative mt-3 pb-3 flex-1 px-4 sm:px-6">
                  <BagTypes
                    selectedBag={selectedBag}
                    setSelectedBag={setSelectedBag}
                    bagTypes={bagTypes}
                  />
                  <BagDetails
                    description={description}
                    setDescription={setDescription}
                    selectedTags={selectedTags}
                    selectedCategories={selectedCategories}
                    setSelectedTags={setSelectedTags}
                    setSelectedCategories={setSelectedCategories}
                    stock={stock}
                    setStock={setStock}
                  />
                  <BagsPerDay
                    numberOfBags={numberOfBags}
                    setNumberOfBags={setNumberOfBags}
                  />
                  <DateSelection
                    selectedDates={selectedDates}
                    setSelectedDates={setSelectedDates}
                  />

                  <div className="flex flex-col pb-5 gap-3">
                    <BagPricing
                      originalPrice={originalPrice}
                      setOriginalPrice={setOriginalPrice}
                      pricing={pricing}
                      setPricing={setPricing}
                    />
                    <button
                      onClick={handleUpdateBag}
                      className="flex justify-center bg-pinkBgDark text-white font-semibold py-2 rounded hover:bg-pinkBgDarkHover2 gap-2 lg:w-[100%]"
                    >
                      Edit Bag
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

export default EditBagDrawer;
