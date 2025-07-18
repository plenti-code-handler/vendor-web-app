// vendor-web-app/redux/slices/addCouponSlice.js
import { createSlice } from "@reduxjs/toolkit";

const addCouponSlice = createSlice({
  name: "addCoupon",
  initialState: {
    drawerOpen: false,
  },
  reducers: {
    setOpenDrawer: (state, action) => {
      state.drawerOpen = action.payload;
    },
  },
});

export const { setOpenDrawer } = addCouponSlice.actions;
export default addCouponSlice.reducer;