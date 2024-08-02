import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activePage: null, // Track the active page
};

export const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setActivePage: (state, action) => {
      state.activePage = action.payload;
    },
  },
});

export const { setActivePage } = headerSlice.actions;
export default headerSlice.reducer;
