"use client";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "./store";
import Main from "@/components/layout/Main";
import NewUserModal from "@/components/modals/NewUserModal";
import DeleteUserModal from "@/components/modals/DeleteUserModal";
import EditUserModal from "@/components/modals/EditUserModal";
import CancelSubModal from "@/components/modals/CancelSubModal";
import SidebarModal from "@/components/modals/SidebarModal";
import NotificationModal from "@/components/modals/NotificationModal";
import { getToken } from "./slices/userSlice";
import { useEffect } from "react";

const Providers = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    const token = getToken();

    if (
      token == undefined &&
      pathname !== "/login" &&
      pathname !== "/register" &&
      pathname !== "/forgot-password" &&
      pathname !== "/reset-password" &&
      pathname !== "/verify-account"
    ) {
      window.location.href = "/login";
    }

    if (
      token &&
      (pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/forgot-password" ||
        pathname === "/reset-password" ||
        pathname === "/verify-account")
    ) {
      window.location.href = "/";
    }
  }, []);

  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/verify-account"
  ) {
    return (
      <Provider store={store}>
        <div className="relative flex w-full flex-col">
          <main className="w-full">{children}</main>
        </div>
      </Provider>
    );
  } else {
    return (
      <Provider store={store}>
        <NewUserModal />
        <DeleteUserModal />
        <EditUserModal />
        <CancelSubModal />
        <SidebarModal />
        <NotificationModal />
        <ToastContainer
          position="top-center"
          theme="dark"
          closeOnClick={false} // No close button
          //autoClose={3000}
          hideProgressBar={false}
          style={{ zIndex: 110000 }}
        />

        <div className="relative flex w-full flex-col">
          <Header />
          <div
            style={{ top: "80px", height: "calc(100vh - 80px)" }}
            className="bg-primaryBackground absolute flex w-full flex-row overflow-y-auto overflow-x-hidden"
          >
            <Sidebar />
            <Main> {children} </Main>
          </div>
        </div>
      </Provider>
    );
  }
};

export default Providers;
