import { configureStore } from "@reduxjs/toolkit";
import headerReducer from "./slices/headerSlice";
import addBagReducer from "./slices/addBagSlice";
import updatePasswordReducer from "./slices/updatePasswordSlice";
import deleteAccountReducer from "./slices/deleteAccountSlice";
import withdrawAmountReducer from "./slices/withdrawAmountSlice";

export const store = configureStore({
  reducer: {
    header: headerReducer,
    addBag: addBagReducer,
    updatePassword: updatePasswordReducer,
    deleteAccount: deleteAccountReducer,
    withdrawAmount: withdrawAmountReducer,
  },
});
