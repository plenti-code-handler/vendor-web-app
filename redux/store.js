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
import selectedBusinessReducer from "./slices/selectedBusinessSlice";
import bagsReducer from "./slices/bagsSlice";
import catalogueReducer from "./slices/catalogueSlice";
import vendorReducer from "./slices/vendorSlice";
import parentReducer from "./slices/parentSlice";
import itemImageReducer from "./slices/itemImageSlice";
import ratingReducer from "./slices/ratingSlice";
import vendorReportsReducer from "./slices/vendorReportsSlice";
import dineinCouponReducer from "./slices/dineinCouponSlice";

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
    selectBusiness: selectedBusinessReducer,
    bags: bagsReducer,
    balance: balanceReducer,
    catalogue: catalogueReducer,
    vendor: vendorReducer,
    parent: parentReducer,
    itemImage: itemImageReducer,
    rating: ratingReducer,
    vendorReports: vendorReportsReducer,
    dineinCoupons: dineinCouponReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
