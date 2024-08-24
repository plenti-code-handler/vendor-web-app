import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false,
  bagToEdit: {},
};

const editBagSlice = createSlice({
  name: "editBag",
  initialState,
  reducers: {
    setOpenDrawer: (state, action) => {
      state.drawerOpen = action.payload;
    },
    setBagToUpdate: (state, action) => {
      state.bagToEdit = action.payload;
    },
  },
});

export const { setOpenDrawer, setBagToUpdate, updateBagsList } =
  editBagSlice.actions;
export default editBagSlice.reducer;
