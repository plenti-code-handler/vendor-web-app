import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false,
};

const addCategorySlice = createSlice({
  name: "addCategory",
  initialState,
  reducers: {
    setOpenDrawer: (state, action) => {
      state.drawerOpen = action.payload;
    },
  },
});

export const { setOpenDrawer } = addCategorySlice.actions;
export default addCategorySlice.reducer;
