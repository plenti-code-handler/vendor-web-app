import { configureStore } from "@reduxjs/toolkit";
import headerReducer from "./slices/headerSlice";
import addBagReducer from "./slices/addBagSlice";

export const store = configureStore({
  reducer: {
    header: headerReducer,
    addBag: addBagReducer,
  },
});
