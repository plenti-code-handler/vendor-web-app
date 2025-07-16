"use client";

import { Provider } from "react-redux";
import { store } from "./store";

import { useRouter } from "next/navigation";
import { useEffect, useState} from "react";
import { useSelector } from "react-redux";


const Providers = ({ children }) => {

  return <Provider store={store}>{children}</Provider>;
};

export default Providers;