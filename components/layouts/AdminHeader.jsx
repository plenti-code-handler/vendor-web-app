"use client";
import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutIconAdminSvg } from "../../svgs";
import Link from "next/link";
import AdminProfileDropdown from "../dropdowns/AdminProfileDropdown";
import { setActivePage } from "../../redux/slices/headerSlice";
import { menuItemsData } from "../../lib/admin_menu";
import { appLogoUrl } from "../../lib/constant_data";
import { getUserLocal, logoutUser } from "../../redux/slices/loggedInUserSlice";
import { auth, db } from "../../app/firebase/config";
import { useRouter } from "next/navigation";
import LanguageDropdown from "../dropdowns/LanguageDropdown";
import { doc, getDoc } from "firebase/firestore";
import { AdminContext } from "../../contexts/AdminContext";

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [user, setUser] = useState({});
  const activePage = useSelector((state) => state.header.activePage);
  const dispatch = useDispatch();
  const { imageUrl, setImageUrl } = useContext(AdminContext);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 1024);
      }
    };

    checkIsMobile();

    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const router = useRouter();

  const handleLinkClick = (page) => {
    dispatch(setActivePage(page));
  };

  useEffect(() => {
    const user = getUserLocal();
    setUser(user);
  }, []);

  useEffect(() => {
    if (user && user.uid) {
      const fetchUserData = async () => {
        // Retrieve user id from localStorage
        const { uid } = user; // Extract uid from localStorage

        try {
          // Fetch the user data from Firestore
          const userDoc = await getDoc(doc(db, "users", uid)); // Assuming 'users' collection

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setImageUrl(userData.imageUrl);
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      };

      fetchUserData();
    } else {
      console.error("user uid not available");
    }
  }, [user]); // Runs once on initial render

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    await auth.signOut();
    dispatch(logoutUser());
    router.push("/");
  };

  return (
    <>
      <header className="bg-white border-b-2 xl:px-[6%] justify-around">
        <div className="mx-auto flex items-center justify-between p-2">
          <a href="/">
            <img
              alt="Foodie Finder Logo"
              src={"/auth_logo.png"}
              className="max-w-[180px] md:max-w-[240px]"
            />
          </a>
          <div className="flex lg:hidden gap-3 items-center">
            <AdminProfileDropdown imageUrl={imageUrl} />
            <button
              onClick={toggleMenu}
              className="text-gray-900 hover:text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? closeSvg : hamburgerIcon}
            </button>
            <button
              className="text-sm font-semibold leading-6 text-gray-900 p-3 transition-colors duration-200 ease-in-out hover:bg-mainLight hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-mainLight focus:ring-offset-2 rounded-lg"
              title="Logout"
              onClick={handleLogout}
            >
              {logoutIconAdminSvg}
            </button>
          </div>
          {/* Menu Items Section */}
          <nav
            className={`${
              isMenuOpen ? "block" : "hidden"
            } absolute top-16 left-0 w-full h-full bg-white font-base shadow-md transition-transform transform${
              isMenuOpen ? "translate-y-0" : "-translate-y-full"
            } lg:static lg:block lg:bg-transparent lg:shadow-none lg:translate-y-0`}
            style={{ zIndex: 1000 }}
          >
            <div className="flex flex-col lg:flex-row lg:justify-center lg:gap-x-4 p-6 lg:p-0">
              {menuItemsData.map(({ name, href, activeSvg, inactiveSvg }) => (
                <Link
                  key={name}
                  href={href}
                  className={`lg:text-[15px] font-semibold flex flex-col gap-10 leading-6   transition-colors duration-500 rounded-md pt-3 pb-3 pl-3 pr-3 min-w-[90px]   lg:h-[80px] ${
                    activePage === name
                      ? "bg-secondary text-white"
                      : "text-menuItem lg:text-menuItem hover:bg-secondary hover:text-white  decoration-mainLight"
                  }`}
                  onMouseEnter={() => setHoveredItem(name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => {
                    handleLinkClick(name);
                    if (isMobile) {
                      toggleMenu(); // Only trigger toggleMenu on mobile devices
                    }
                  }}
                >
                  <div className="flex lg:flex-col items-center gap-3 text-[15px]">
                    <div>
                      {activePage === name || hoveredItem === name
                        ? inactiveSvg
                        : activeSvg}
                    </div>
                    <div>{name}</div>
                  </div>
                </Link>
              ))}
              <div className="w-full lg:hidden">
                <LanguageDropdown
                  background="white"
                  textColor="black"
                  borderColor="grayLight"
                />
              </div>
            </div>
          </nav>
          <div className="hidden lg:flex items-center gap-5">
            <LanguageDropdown
              background="white"
              textColor="black"
              borderColor="grayLight"
              width="small"
            />
            {/* User Profile Section */}
            <div className="hidden lg:flex items-center border-2 min-w-[110px] border-dotted rounded-xl justify-between p-2">
              <Link href="/admin/profile">
                <img
                  alt="User"
                  src={imageUrl || "/User.png"}
                  className="lg:h-11 lg:w-11 rounded-md hover:cursor-pointer focus:outline-none"
                />
              </Link>
              {/* <div className="flex flex-col">
                <p className="text-[14px] font-semibold text-black">
                  {user.name}
                </p>
                <p className="text-[12px] font-semibold text-gray-400">Admin</p>
              </div> */}
              <button
                onClick={handleLogout}
                className="p-2 transition-colors duration-200 ease-in-out hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 rounded-lg"
                title="Logout"
              >
                {logoutIconAdminSvg}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;

const closeSvg = (
  <svg
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-menuItem"
  >
    <path
      d="M14.2547 12.9612C14.6451 13.3533 14.6451 13.9416 14.2547 14.3337C14.0594 14.5298 13.8642 14.6278 13.5713 14.6278C13.2785 14.6278 13.0832 14.5298 12.888 14.3337L7.71419 9.13764L2.54038 14.3337C2.34515 14.5298 2.14991 14.6278 1.85705 14.6278C1.56419 14.6278 1.36895 14.5298 1.17372 14.3337C0.78324 13.9416 0.78324 13.3533 1.17372 12.9612L6.34753 7.76509L1.17372 2.56901C0.78324 2.17685 0.78324 1.58862 1.17372 1.19646C1.56419 0.804305 2.14991 0.804305 2.54038 1.19646L7.71419 6.39254L12.888 1.19646C13.2785 0.804305 13.8642 0.804305 14.2547 1.19646C14.6451 1.58862 14.6451 2.17685 14.2547 2.56901L9.08086 7.76509L14.2547 12.9612Z"
      fill="#5E6278"
    />
  </svg>
);

const hamburgerIcon = (
  <svg
    className="w-6 h-6 text-menuItem"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16m-7 6h7"
    />
  </svg>
);
