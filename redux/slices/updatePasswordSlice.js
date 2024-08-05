import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false,
};

const updatePasswordSlice = createSlice({
  name: "updatePassword",
  initialState,
  reducers: {
    setOpenDrawer: (state, action) => {
      state.drawerOpen = action.payload;
    },
  },
});

export const { setOpenDrawer } = updatePasswordSlice.actions;
export default updatePasswordSlice.reducer;
