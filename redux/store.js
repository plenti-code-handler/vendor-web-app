import { configureStore } from "@reduxjs/toolkit";
import headerReducer from "./slices/headerSlice";
import addBagReducer from "./slices/addBagSlice";
import addCategoryReducer from "./slices/addCategorySlice";
import updatePasswordReducer from "./slices/updatePasswordSlice";
import deleteAccountReducer from "./slices/deleteAccountSlice";
import withdrawAmountReducer from "./slices/withdrawAmountSlice";
import withdrawSuccessReducer from "./slices/withdrawSuccessSlice";
import editBagReducer from "./slices/editBagSlice";
import loggedInUserReducer from "./slices/loggedInUserSlice";
import registerUserReducer from "./slices/registerUserSlice";
import contactUserReducer from "./slices/contactUserSlice";
import selectedBusinessReducer from "./slices/selectedBusinessSlice";

export const store = configureStore({
  reducer: {
    header: headerReducer,
    addBag: addBagReducer,
    addCategory: addCategoryReducer,
    updatePassword: updatePasswordReducer,
    deleteAccount: deleteAccountReducer,
    withdrawAmount: withdrawAmountReducer,
    withdrawSuccess: withdrawSuccessReducer,
    editBag: editBagReducer,
    loggedInUser: loggedInUserReducer,
    registerUser: registerUserReducer,
    contactUser: contactUserReducer,
    selectBusiness: selectedBusinessReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
