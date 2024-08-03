import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false,
};

const addBagSlice = createSlice({
  name: "addBag",
  initialState,
  reducers: {
    setOpenDrawer: (state, action) => {
      state.drawerOpen = action.payload;
    },
  },
});

export const { setOpenDrawer } = addBagSlice.actions;
export default addBagSlice.reducer;
