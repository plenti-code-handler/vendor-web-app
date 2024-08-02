"use client";
import { Provider } from "react-redux";
import { store } from "./store";
import Main from "../components/layouts/Main";
import { useEffect } from "react";
import Header from "../components/layouts/Header";
import { usePathname } from "next/navigation";

const Providers = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    const user = true;

    if (
      !user &&
      pathname !== "/" &&
      pathname !== "/register" &&
      pathname !== "/forgot-password" &&
      pathname !== "/reset-password"
    ) {
      window.location.href = "/login";
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
        <header>
          <h1>Auth Layout</h1>
        </header>
        <main>{children}</main>
        <footer>
          <h1>Footer</h1>
        </footer>
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
