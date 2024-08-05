import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false,
};

const deleteAccountSlice = createSlice({
  name: "deleteAccount",
  initialState,
  reducers: {
    setOpenDrawer: (state, action) => {
      state.drawerOpen = action.payload;
    },
  },
});

export const { setOpenDrawer } = deleteAccountSlice.actions;
export default deleteAccountSlice.reducer;
