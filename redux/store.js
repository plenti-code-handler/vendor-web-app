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
import balanceReducer from "./slices/blanceSlice";
// import contactUserReducer from "./slices/contactUserSlice";
import selectedBusinessReducer from "./slices/selectedBusinessSlice";
import bagsReducer from "./slices/bagsSlice";
import couponReducer from "./slices/couponSlice";
import addCouponReducer from "./slices/addCouponSlice";

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
    // contactUser: contactUserReducer,
    selectBusiness: selectedBusinessReducer,
    bags: bagsReducer,
    balance: balanceReducer,
    coupons: couponReducer,
    addCoupon: addCouponReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
