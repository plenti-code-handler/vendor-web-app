import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false,
};

const withdrawSuccessSlice = createSlice({
  name: "withdrawSuccess",
  initialState,
  reducers: {
    setOpenDrawer: (state, action) => {
      state.drawerOpen = action.payload;
    },
  },
});

export const { setOpenDrawer } = withdrawSuccessSlice.actions;
export default withdrawSuccessSlice.reducer;
