import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false,
};

const contactUserSlice = createSlice({
  name: "contactReducer",
  initialState,
  reducers: {
    setOpenDrawer: (state, action) => {
      state.drawerOpen = action.payload;
    },
  },
});

export const { setOpenDrawer } = contactUserSlice.actions;
export default contactUserSlice.reducer;
