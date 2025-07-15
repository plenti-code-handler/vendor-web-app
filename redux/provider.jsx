"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { usePathname } from "next/navigation";
import {
  PublicLayout,
  BusinessLayout,
  LandingLayout,
} from "../components/layouts/AllLayouts";

import { useRouter } from "next/navigation";
import { useEffect, useState} from "react";


const Providers = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [ isClient, setIsClient ] = useState(false);

  // Ensure we're on client-side before checking localStorage
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forget_password" ||
    pathname === "/verify" ||
    pathname === "/setup_password" ||
    pathname === "/setup_profile" ||
    pathname === "/awaiting" ||
    pathname === "/reset_password" ||
    pathname === "/verify_phone"
  ) {
    return (
      <Provider store={store}>
        <PublicLayout>{children}</PublicLayout>
      </Provider>
    );
  } else if (
    pathname === "/"
  ) {
    return (
      <Provider store={store}>
        <LandingLayout>{children}</LandingLayout>
      </Provider>
    );
  } else if (pathname.startsWith("/business")) {
    if ( isClient && !localStorage.getItem("token") ) {
      router.push("/");
      return null;
    }
    return (
      <Provider store={store}>
        <BusinessLayout>{children}</BusinessLayout>
      </Provider>
    );
  } else {
    return null;
  }
};

export default Providers;
