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
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../../app/firebase/config";
import { BagsContext } from "../../../../contexts/BagsContext";
import { getUserLocal } from "../../../../redux/slices/loggedInUserSlice";
import TableUpper from "./TableUpper";
import Loader from "../../../loader/loader";
import { toast } from "sonner";
import EditBagDrawer from "../../../drawers/EditBagDrawer";

const BagsTable = () => {
  const dispatch = useDispatch();

  const {
    bags,
    lastVisible,
    filteredBags,
    setBags,
    setFilteredBags,
    setLastVisible,
  } = useContext(BagsContext);

  // const [bags, setBags] = useState([]);
  // const [filteredBookings, setFilteredBags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [onStatusChange, setOnStatusChange] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const localUser = getUserLocal();
    setUser(localUser);
  }, []);

  useEffect(() => {
    if (user && user.uid) {
      // Ensure the user and user.uid are available
      const fetchInitialBags = async () => {
        try {
          setLoader(true);
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
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setLoader(false);
        }
      };

      fetchInitialBags();
    } else {
      console.log("user or user.uid is undefined:", user);
    }
  }, [user, setBags, setFilteredBags, setLastVisible]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredBags(bags);
    } else {
      const filtered = bags.filter(
        (bag) =>
          bag.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bag.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBags(filtered);
    }
  }, [searchTerm, bags]);

  if (loader) return <Loader />;

  const fetchMoreBags = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const colRef = collection(db, "bags");
      let q;

      if (lastVisible) {
        // If lastVisible exists, start after it
        q = query(
          colRef,
          where("resuid", "==", user.uid),
          // orderBy("time"),
          startAfter(lastVisible),
          limit(10)
        );
      } else {
        // If lastVisible is null, just order and limit
        q = query(
          colRef,
          where("resuid", "==", user.uid),
          // orderBy("time"),
          limit(10)
        );
      }

      const allBagsSnapshot = await getDocs(q);

      if (allBagsSnapshot.empty) {
        console.log("No more bags to fetch");
        setLoading(false);
        return;
      }

      const bagsData = allBagsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const lastDoc = allBagsSnapshot.docs[allBagsSnapshot.docs.length - 1];

      setBags((prevBags) => [...prevBags, ...bagsData]);
      setFilteredBags((prevBags) => [...prevBags, ...bagsData]);
      setLastVisible(lastDoc);
    } catch (error) {
      console.error("Error fetching more bags:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleEditClick = async (bag) => {
    // Recontruct values from timestamps and store them in redux
    const reverseDateArray = bag.date.map((item) => {
      // Convert Firebase Timestamp to JavaScript Date
      const dateObj = item.date.toDate();
      const startTimeObj = item.starttime.toDate();
      const endTimeObj = item.endtime.toDate();

      console.log(dateObj);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
      const day = String(dateObj.getDate()).padStart(2, "0"); // Get day of the month
      // Format Date object to HTML date format (YYYY-MM-DD)
      const date = `${year}-${month}-${day}`;

      // Format Time objects to HTML time format (HH:MM)
      const starttime = startTimeObj.toTimeString().split(" ")[0].slice(0, 5);
      const endtime = endTimeObj.toTimeString().split(" ")[0].slice(0, 5);

      return {
        date, // in 'YYYY-MM-DD' format
        starttime, // in 'HH:MM' format
        endtime, // in 'HH:MM' format
      };
    });
    dispatch(setBagToUpdate({ ...bag, date: reverseDateArray }));
    dispatch(setOpenDrawer(true));
  };

  const handleDelete = async (id) => {
    // Reference to the document to be deleted
    const docRef = doc(db, "bags", id);
    await deleteDoc(docRef);
    toast.success("Bag Deleted Successfully");
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

  const onFilterChange = (status) => {
    setOnStatusChange(status);

    const getStatus = (dateArray) => {
      const now = new Date();

      let activeCount = 0;
      let scheduledCount = 0;
      let pastCount = 0;

      dateArray.forEach((dateObj) => {
        const { date, starttime, endtime } = dateObj;

        const startDateTime = starttime.toDate(); // Convert Firebase timestamp to JavaScript Date
        const endDateTime = endtime.toDate(); // Convert Firebase timestamp to JavaScript Date

        if (now >= startDateTime && now <= endDateTime) {
          activeCount++;
        } else if (now < startDateTime) {
          scheduledCount++;
        } else {
          pastCount++;
        }
      });

      if (activeCount > 0) {
        return "active";
      } else if (scheduledCount > 0) {
        return "scheduled";
      } else {
        return "past";
      }
    };

    const filtered = bags.filter((bag) => {
      const statusFromDates = getStatus(bag.date); // Assuming bag.dates is the array of date objects
      return statusFromDates === status || status === ""; // Include all if status is empty
    });

    setFilteredBags(filtered);
  };

  return (
    <div className="no-scrollbar w-full  overflow-y-hidden">
      <TableUpper
        selectedFilter={onStatusChange}
        onFilterChange={onFilterChange}
        setSearchTerm={setSearchTerm}
      />

      <table className="w-full table-auto truncate overflow-hidden bg-white">
        <thead>
          <tr className="border-b-[1px] border-grayOne border-dashed border-opacity-45 text-sm font-semibold text-grayOne">
            <th className="pb-[8px] pl-[5%] pt-[18px] text-left w-[25.00%]">
              Bag Deal Title
            </th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Size</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Daily Serve</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">In Stock</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Pouch Price</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Status</th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBags.length > 0 ? (
            filteredBags.map((bag, index) => (
              <tr
                key={index}
                className="cursor-pointer border-b-[1px] border-[#E4E4E4] border-dashed hover:bg-[#f8f7f7]"
              >
                <td className="truncate pl-2 lg:pl-[5%] pr-6   md:pr-2 w-[14.28%]">
                  <div className="py-3">
                    <div className="flex flex-row items-center gap-x-2">
                      <div className="flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full">
                        {bag.type === "Surprise" ? (
                          <Image
                            src={`/Round-${bag.type}.png`}
                            className="h-full w-full object-cover"
                            width={40}
                            height={40}
                            priority
                          />
                        ) : bag.type === "Large" ? (
                          <Image
                            src={`/Round-${bag.type}.png`}
                            className="h-full w-full object-cover"
                            width={40}
                            height={40}
                            priority
                          />
                        ) : bag.type === "Small" ? (
                          <Image
                            src={`/Round-${bag.type}.png`}
                            className="h-full w-full object-cover"
                            width={40}
                            height={40}
                            priority
                          />
                        ) : null}
                      </div>
                      <div className="flex flex-col gap-y-1">
                        <p className="text-sm font-medium truncate overflow-hidden whitespace-nowrap  ">
                          {bag.title.length > 25
                            ? `${bag.title.slice(0, 25)}...`
                            : bag.title}
                        </p>
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
                  <RenderStatus dates={bag.date} />
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
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center py-10 text-grayOne">
                No Pouch found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <LoadMoreButton loadMore={fetchMoreBags} isLoading={loading} />
    </div>
  );
};

export default BagsTable;

const RenderStatus = ({ dates }) => {
  // Function to determine status based on current date and time
  const getStatus = (dateArray) => {
    const now = new Date();

    let activeCount = 0;
    let scheduledCount = 0;
    let pastCount = 0;

    dateArray.forEach((dateObj) => {
      const { date, starttime, endtime } = dateObj;
      const startDateTime = starttime.toDate(); // Convert Firebase timestamp to JavaScript Date
      const endDateTime = endtime.toDate(); // Convert Firebase timestamp to JavaScript Date

      if (now >= startDateTime && now <= endDateTime) {
        activeCount++;
      } else if (now < startDateTime) {
        scheduledCount++;
      } else {
        pastCount++;
      }
    });

    if (activeCount > 0) {
      return "active";
    } else if (scheduledCount > 0) {
      return "scheduled";
    } else {
      return "past";
    }
  };

  // Determine the overall status
  const status = getStatus(dates);

  // Function to decide style based on status
  const decideStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-pinkBgOne text-pinkTextOne";
      case "past":
        return "bg-grayFive text-grayFour";
      case "scheduled":
        return "bg-scheduledBg text-badgeScheduled";
      default:
        return "";
    }
  };

  return (
    <div
      className={`mx-auto ${decideStyle(
        status
      )} font-semibold rounded-[4px] text-[12px] w-[77px] h-[26px] p-1`}
    >
      <p>{status.charAt(0).toUpperCase() + status.slice(1)}</p>
    </div>
  );
};
