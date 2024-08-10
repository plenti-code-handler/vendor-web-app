"use client";
import { Provider } from "react-redux";
import { store } from "./store";
import Main from "../components/layouts/Main";
import AuthMain from "../components/layouts/AuthMain";
import { useEffect } from "react";
import Header from "../components/layouts/Header";
import { usePathname } from "next/navigation";

const Providers = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    const user = false;

    if (
      !user &&
      pathname !== "/" &&
      pathname !== "/register" &&
      pathname !== "/forgot-password" &&
      pathname !== "/reset-password"
    ) {
      window.location.href = "/";
    }

    if (
      user &&
      (pathname === "/" ||
        pathname === "/register" ||
        pathname === "/forgot-password" ||
        pathname === "/reset-password")
    ) {
      window.location.href = "/business";
    }
  }, []);

  if (
    pathname === "/" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password"
  ) {
    return (
      <Provider store={store}>
        <AuthMain>{children}</AuthMain>
      </Provider>
    );
  } else {
    return (
      <Provider store={store}>
        <Header />
        <Main>{children}</Main>
      </Provider>
    );
  }
};

export default Providers;
