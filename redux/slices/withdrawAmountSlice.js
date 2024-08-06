import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false,
};

const withdrawAmountSlice = createSlice({
  name: "withdrawAmount",
  initialState,
  reducers: {
    setOpenDrawer: (state, action) => {
      state.drawerOpen = action.payload;
    },
  },
});

export const { setOpenDrawer } = withdrawAmountSlice.actions;
export default withdrawAmountSlice.reducer;
