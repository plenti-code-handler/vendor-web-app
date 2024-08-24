"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Image from "next/image";
// import { bags } from "../../../../lib/constant_data";
import { deleteSvg, editSvg } from "../../../../svgs";
import { useDispatch } from "react-redux";
import {
  setBagToUpdate,
  setOpenDrawer,
  updateBagsList,
} from "../../../../redux/slices/editBagSlice";
import LoadMoreButton from "../../../buttons/LoadMoreButton";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "../../../../app/firebase/config";
import { BagsContext } from "../../../../contexts/BagsContext";

const BagsTable = () => {
  const dispatch = useDispatch();
  const decideStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-pinkBgOne text-pinkTextOne";
      case "past":
        return "bg-grayFive text-grayFour";
      case "scheduled":
        return "bg-scheduledBg text-badgeScheduled";
      default:
        break;
    }
  };

  const {
    bags,
    lastVisible,
    filteredBookings,
    setBags,
    setFilteredBags,
    setLastVisible,
  } = useContext(BagsContext);

  // const [bags, setBags] = useState([]);
  // const [filteredBookings, setFilteredBags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInitialBags();
  }, []);

  const fetchInitialBags = async () => {
    const colRef = collection(db, "bags");
    const q = query(colRef, orderBy("title"), limit(10)); // Adjust limit as needed

    const allBagsSnapshot = await getDocs(q);

    const bagsData = allBagsSnapshot.docs.map((doc) => ({
      id: doc.id, // Extract the ID here
      ...doc.data(), // Spread the rest of the document data
    }));
    const lastDoc = allBagsSnapshot.docs[allBagsSnapshot.docs.length - 1];

    setBags(bagsData);
    setFilteredBags(bagsData);
    setLastVisible(lastDoc);
  };

  const fetchMoreBags = async () => {
    // Prevent the function from running if it’s already loading
    if (loading) return;

    try {
      setLoading(true);

      const colRef = collection(db, "bags");
      let q;

      if (lastVisible) {
        // If lastVisible exists, start after it
        q = query(colRef, orderBy("title"), startAfter(lastVisible), limit(10));
      } else {
        // If lastVisible is null, just order and limit
        q = query(colRef, orderBy("title"), limit(10));
      }

      const allBagsSnapshot = await getDocs(q);

      // Handle empty snapshots (end of collection)
      if (allBagsSnapshot.empty) {
        console.log("No more bags to fetch");
        setLoading(false);
        return;
      }

      const bagsData = allBagsSnapshot.docs.map((doc) => doc.data());
      const lastDoc = allBagsSnapshot.docs[allBagsSnapshot.docs.length - 1];

      // Update state with new data
      setBags((prevBags) => [...prevBags, ...bagsData]);
      setFilteredBags((prevBags) => [...prevBags, ...bagsData]);
      setLastVisible(lastDoc); // Set the last visible document for pagination
    } catch (error) {
      console.error("Error fetching more bags:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleEditClick = async (bag) => {
    dispatch(setBagToUpdate(bag));
    dispatch(setOpenDrawer(true));
  };

  const handleDelete = async (id) => {
    const docRef = doc(db, "bags", id);
    await deleteDoc(docRef);
    const colRef = collection(db, "bags");
    const q = query(colRef, orderBy("title"), limit(10)); // Adjust limit as needed

    const allBagsSnapshot = await getDocs(q);

    const bagsData = allBagsSnapshot.docs.map((doc) => ({
      id: doc.id, // Extract the ID here
      ...doc.data(), // Spread the rest of the document data
    }));
    const lastDoc = allBagsSnapshot.docs[allBagsSnapshot.docs.length - 1];

    setBags(bagsData);
    setFilteredBags(bagsData);
    setLastVisible(lastDoc);
  };

  return (
    <div className="no-scrollbar w-full  overflow-y-hidden">
      <table className="w-full table-auto truncate overflow-hidden bg-white">
        <thead>
          <tr className="border-b-[1px] border-grayOne border-dashed border-opacity-45 text-sm font-semibold text-grayOne">
            <th className="pb-[8px] pl-[5%] pt-[18px] text-left w-[18.00%]">
              Bag Deal Title
            </th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Size</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Daily Serve</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">In Stock</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Bag Price</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Status</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bags.map((bag, index) => (
            <tr
              key={index}
              className="cursor-pointer border-b-[1px] border-[#E4E4E4] border-dashed hover:bg-[#f8f7f7]"
            >
              <td className="truncate pl-2 lg:pl-[5%] pr-2 w-[14.28%]">
                <div className="py-3">
                  <div className="flex flex-row items-center gap-x-2">
                    <div className="flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full">
                      <Image
                        src={bag.img ? bag.img : "/User.png"}
                        alt="GetSpouse Logo"
                        className="h-full w-full object-cover"
                        width={40}
                        height={40}
                        priority
                      />
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <p className="text-sm font-medium">{bag.title}</p>
                    </div>
                  </div>
                </div>
              </td>
              <td className="truncate text-center px-2">
                <p className="text-sm font-semibold text-grayThree">
                  {bag.type}
                </p>
              </td>
              <td className="truncate text-center px-2">
                <p className="text-sm font-semibold text-grayThree">
                  {bag.bagaday}
                </p>
              </td>
              <td className="truncate text-center px-2">
                <p className="text-sm font-semibold text-grayThree">
                  {bag.stock}
                </p>
              </td>
              <td className="truncate text-center px-2">
                <p className="text-sm font-semibold text-grayThree">
                  € {bag.price}
                </p>
              </td>
              <td className="truncate text-center px-2">
                {/* <div
                  className={`mx-auto ${decideStyle(
                    bag.status.toLowerCase()
                  )} font-semibold rounded-[4px] text-[12px] w-[77px] h-[26px] p-1`}
                >
                  <p>{bag.status}</p>
                </div> */}
              </td>
              <td className="truncate text-center">
                <div className="flex flex-row justify-center">
                  <button
                    onClick={() => handleEditClick(bag)}
                    className="rounded-md bg-tableButtonBackground p-2 hover:bg-gray-200 hover:p-2"
                  >
                    {editSvg}
                  </button>
                  <button
                    onClick={() => handleDelete(bag.id)}
                    className="rounded-md bg-tableButtonBackground p-2 hover:bg-gray-200 hover:p-2"
                  >
                    {deleteSvg}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <LoadMoreButton loadMore={fetchMoreBags} isLoading={loading} />
    </div>
  );
};

export default BagsTable;
