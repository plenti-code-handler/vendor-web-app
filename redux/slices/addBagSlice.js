import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false,
  templateItem: null,
};

const addBagSlice = createSlice({
  name: "addBag",
  initialState,
  reducers: {
    setOpenDrawer: (state, action) => {
      state.drawerOpen = action.payload;
      // Clear template if drawer is closed
      if (!action.payload) {
        state.templateItem = null;
      }
    },
    setTemplateItem: (state, action) => {
      state.templateItem = action.payload;
    },
  },
});

export const { setOpenDrawer, setTemplateItem } = addBagSlice.actions;
export default addBagSlice.reducer;
