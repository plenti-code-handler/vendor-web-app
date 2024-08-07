import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false,
};

const editBagSlice = createSlice({
  name: "editBag",
  initialState,
  reducers: {
    setOpenDrawer: (state, action) => {
      state.drawerOpen = action.payload;
    },
  },
});

export const { setOpenDrawer } = editBagSlice.actions;
export default editBagSlice.reducer;
