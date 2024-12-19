"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDrawer } from "../../redux/slices/addBagSlice";
import DrawerHeader from "./components/DrawerHeader";
import BagTypes from "./components/BagTypes";
import BagDetails from "./components/BagDetails";
import BagsPerDay from "./components/BagsPerDay";
import DateSelection from "./components/DateSelection";
import BagPricing from "./components/BagPricing";
import { useContext, useEffect, useState } from "react";
import { db } from "../../app/firebase/config";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  Timestamp,
  GeoPoint,
  getDoc,
  doc,
} from "firebase/firestore";
import { getUserLocal } from "../../redux/slices/loggedInUserSlice";
import { BagsContext } from "../../contexts/BagsContext";
import { toast } from "sonner";
import { whiteLoader } from "../../svgs";

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

const AddBagDrawer = () => {
  const { setBags, setFilteredBags, setLastVisible } = useContext(BagsContext);

  const [selectedBag, setSelectedBag] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [numberOfBags, setNumberOfBags] = useState(0);
  const [pricing, setPricing] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [dealTitle, setDealTitle] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCountryCode = JSON.parse(localStorage.getItem("countryCode"));
      setCountryCode(storedCountryCode);
    }
  }, []);

  useEffect(() => {
    const localUser = getUserLocal(); // Safely fetch the user.
    setUser(localUser || null); // If null/undefined, set `null`.
  }, []);

  useEffect(() => {
    if (user?.point) {
      // Use optional chaining to safely access `user.point`.
      setLat(user.point.latitude || null);
      setLng(user.point.longitude || null);
    } else {
      setLat(null); // Reset coordinates if user or point is not available.
      setLng(null);
    }
  }, [user]);

  const resetForm = () => {
    setSelectedBag({});
    setSelectedTags([]);
    setSelectedCategories([]);
    setSelectedDates([]);
    setDescription("");
    setNumberOfBags(0);
    setPricing("");
    setOriginalPrice("");
    setDealTitle("");
    setStock("");
  };

  const handleSubmitBag = async () => {
    try {
      setLoading(true);

      console.log("Slected tags");
      console.log(selectedTags);

      const requiredFields = [
        {
          field: dealTitle,
          name: "dealTitle",
          message: "Please provide a deal title.",
        },
        {
          field: selectedBag.type,
          name: "selectedBag.type",
          message: "Please select a bag type.",
        },
        {
          field: description,
          name: "description",
          message: "Please fill the description.",
        },
        {
          field: numberOfBags,
          name: "numberOfBags",
          message: "Please fill the number of bags.",
        },
        {
          field: selectedBag.img,
          name: "selectedBag.img",
          message: "Please upload an image for the bag.",
        },
        {
          field: stock,
          name: "stock",
          message: "Please specify the stock quantity.",
        },
        {
          field: pricing,
          name: "pricing",
          message: "Please provide the pricing information.",
        },
        {
          field: originalPrice,
          name: "originalPrice",
          message: "Please provide the original price.",
        },
      ];

      for (const { field, name, message } of requiredFields) {
        if (!field) {
          console.log(`Field '${name}' is missing or empty.`);
          toast.error(message);
          setLoading(false);
          return;
        }
      }

      if (!selectedDates || selectedDates.length === 0) {
        toast.error("Please select date and time.");
        setLoading(false);
        return;
      }

      const updatedDateArray = selectedDates.map((item) => {
        // Combine date with starttime and endtime
        const dateStr = `${item.date}T00:00:00`; // Date with no time for selectedDateTime
        const startDateTimeStr = `${item.date}T${item.starttime}:00`; // Combine date with starttime
        const endDateTimeStr = `${item.date}T${item.endtime}:00`; // Combine date with endtime

        // Create Date objects
        const selectedDateTime = new Date(dateStr); // Date only
        const startDateTime = new Date(startDateTimeStr); // Date with start time
        const endDateTime = new Date(endDateTimeStr); // Date with end time

        if (endDateTime < startDateTime) {
          console.log("End time should be after start time");
          toast.error("End time should be after start time");
          setLoading(false);
          return;
        }

        // Convert to Firebase timestamps
        return {
          date: Timestamp.fromDate(selectedDateTime),
          starttime: Timestamp.fromDate(startDateTime),
          endtime: Timestamp.fromDate(endDateTime),
        };
      });

      console.log("updated array");
      console.log(updatedDateArray);

      if (!updatedDateArray || updatedDateArray.includes(undefined)) {
        setLoading(false);
        return;
      }

      // Reference to the 'bags' collection
      const bagsCollectionRef = collection(db, "bags");

      // Data to be added
      const newBag = {
        bagaday: numberOfBags,
        lastUpdated: new Date(),
        perbag: numberOfBags,
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
        isgift: false,
        // categories: selectedCategories,
        price: Number(pricing),
        originalprice: Number(originalPrice),
        curr: countryCode ? countryCode : "SEK",
        points: lat !== null && lng !== null ? new GeoPoint(lat, lng) : null,
        // createdAt: new Date(), // Optionally add a timestamp
      };

      // Add the document to Firestore
      const docRef = await addDoc(bagsCollectionRef, newBag);

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const listuids = userDoc.exists() ? userDoc.data().listuids || [] : [];
      const businessName = userDoc.exists() ? userDoc.data().name || "" : "";

      // Retrieve tokens for each uid
      const tokenPromises = listuids.map(async (uid) => {
        const userTokenDoc = await getDoc(doc(db, "users", uid));
        return userTokenDoc.exists() ? userTokenDoc.data().token : null;
      });

      const tokens = await Promise.all(tokenPromises);
      const validTokens = tokens.filter((token) => token !== null);

      // Optionally, reset the form state after successful submission
      // Send notification to each valid token
      for (const token of validTokens) {
        await fetch("/api/send-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, businessName }),
        });
      }

      toast.success("Bag Created Successfully!");

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
      setLoading(false);
    } catch (error) {
      toast.error("Failed to create a bag");
      console.error("Error adding document: ", error);
    }
  };

  const dispatch = useDispatch();
  const open = useSelector((state) => state.addBag.drawerOpen);

  const handleClose = () => {
    dispatch(setOpenDrawer(false));
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
                  <DrawerHeader
                    dealTitle={dealTitle}
                    setDealTitle={setDealTitle}
                    onAddClick={handleSubmitBag}
                  />
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

                  <div className="flex flex-col gap-3">
                    <BagPricing
                      originalPrice={originalPrice}
                      setOriginalPrice={setOriginalPrice}
                      pricing={pricing}
                      setPricing={setPricing}
                    />
                    <button
                      onClick={handleSubmitBag}
                      className="flex justify-center bg-blueBgDark text-white font-semibold py-2  rounded hover:bg-blueBgDarkHover2 gap-2 lg:w-[100%]"
                    >
                      {loading && (
                        <div className="animate-spin flex items-center justify-center">
                          {whiteLoader}
                        </div>
                      )}
                      {loading ? "Adding..." : "Add Bag"}
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
