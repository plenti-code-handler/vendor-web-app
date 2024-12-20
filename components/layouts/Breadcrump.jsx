"use client";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { addUserSvg, backButtonSvg } from "../../svgs";
import { useDispatch } from "react-redux";
import { setOpenDrawer } from "../../redux/slices/addBagSlice";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../app/firebase/config";

const decidePath = (pathname) => {
  // Check for specific patterns
  console.log(pathname);
  if (pathname.match(/\/admin\/users\/business\/[a-zA-Z0-9]+/)) {
    return "Business Details";
  } else if (pathname.match(/\/admin\/users\/customer\/[a-zA-Z0-9]+/)) {
    return "Customer Details";
  }

  // Check the last part of the path for general cases
  const path = pathname.split("/");
  const lastPath = path.at(-1);

  switch (lastPath) {
    case "business":
      return "My Dashboard";
    case "manage-bags":
      return "Manage Pouches";
    case "bookings":
      return "Bookings";
    case "more":
      return "More Options";
    case "profile":
      return "My Profile";
    case "admin":
      return "Admin Dashboard";
    case "users":
      return "Users";
    case "approvals":
      return "Approvals";
    case "transactions":
      return "Transactions";
    case "categories":
      return "Categories/Tags";
    default:
      return "";
  }
};

const Breadcrumb = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const [pendingUsersCount, setPendingUsersCount] = useState(0);
  

  const handleOpenDrawer = useCallback(() => {
    dispatch(setOpenDrawer(true));
  }, [dispatch]);

  const handleBackClick = useCallback(() => {
    router.replace("/admin/users");
  }, [router]);



  useEffect(() => {
    const fetchPendingUsersCount = async () => {
      try {
        // Query the "users" collection for documents where "status" is "pending"
        const q = query(
          collection(db, "users"),
          where("status", "==", "pending")
        );

        // Execute the query and get the documents
        const querySnapshot = await getDocs(q);

        // Set the count of pending users in state
        setPendingUsersCount(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching pending users:", error);
        toast.error("An error occurred while fetching pending users.");
      }
    };

    fetchPendingUsersCount();
  }, []); // Empty dependency array to run this effect only once on mount

  const currentPath = useMemo(() => decidePath(pathname), [pathname]);



  const MoreOptionsContent = () => (
    <div className="flex flex-col items-center">
      <img
        alt="Plenti Logo"
        src={"/logo_more.png"}
        className="w-[60%] h-[80%] p-5 lg:p-0 lg:h-[25%] lg:w-[25%]"
      />
      <p className="text-lg sm:text-sm md:text-2xl lg:text-xl font-semibold text-graySix">
        {currentPath}
      </p>
    </div>
  );

  const DefaultContent = () => (
    <div className="flex justify-between items-center lg:mr-auto lg:mt-4 lg:mb-4 lg:py-2 lg:w-[99%]">
      <p className="m-4 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-one">
        {currentPath === "Manage Pouches" ? (
          <>{`Manage Bags `}</>
        ) : (
          <>{currentPath}</>
        )}
      </p>

      {currentPath === "Manage Pouches" && (
        <button
          onClick={handleOpenDrawer}
          className="mr-3 mt-2 lg:m-0 flex items-center text-center justify-center bg-blueBgDark text-white font-semibold py-2 px-4 rounded-[6px] hover:bg-blueBgDarkHover2"
        >
          <span className="mr-3 ml-2 font-semibold">{`New Bags`}</span>
          <span>{addUserSvg}</span>
        </button>
      )}
    </div>
  );

  const ApprovalsContent = () => (
    <div className="flex items-center m-4 lg:mr-auto lg:mt-4 lg:mb-4 lg:w-[99%] gap-2">
      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-one">
        {currentPath}
      </p>
      <p className="text-lg sm:m-0 sm:text-xl md:text-2xl lg:text-3xl font-medium text-secondary">
        {`(${pendingUsersCount} New)`}
      </p>
    </div>
  );

  const DetailsContent = () => (
    <div className="flex items-center gap-4 m-4 lg:m-0 lg:mr-auto lg:mt-4 lg:mb-4 lg:py-2 lg:w-[99%]">
      <button
        onClick={handleBackClick}
        className="bg-gray-100 p-1 rounded-full border border-gray-400 hover:bg-gray-200"
      >
        {backButtonSvg}
      </button>
      <p className="m-4 text-lg sm:m-0 sm:text-xl md:text-2xl lg:text-3xl font-bold text-one">
        {currentPath}
      </p>
    </div>
  );

  if (currentPath === "More Options") {
    return <MoreOptionsContent />;
  } else if (
    currentPath === "Business Details" ||
    currentPath === "Customer Details"
  ) {
    return <DetailsContent />;
  } else if (currentPath === "Approvals") {
    return <ApprovalsContent />;
  } else {
    return <DefaultContent />;
  }
};

export default Breadcrumb;
