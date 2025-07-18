// Create this file: vendor-web-app/redux/slices/editCouponSlice.js
import { createSlice } from "@reduxjs/toolkit";

const editCouponSlice = createSlice({
  name: "editCoupon",
  initialState: {
    couponToUpdate: null,
    openDrawer: false,
  },
  reducers: {
    setCouponToUpdate: (state, action) => {
      state.couponToUpdate = action.payload;
    },
    setOpenDrawer: (state, action) => {
      state.openDrawer = action.payload;
    },
  },
});

export const { setCouponToUpdate, setOpenDrawer } = editCouponSlice.actions;
export default editCouponSlice.reducer;