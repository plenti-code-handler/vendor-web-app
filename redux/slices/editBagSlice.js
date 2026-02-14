import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false,
  bagToEdit: {},
  templateItem: null,
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
      state.templateItem = null; // Clear template when editing
    },
    setTemplateItem: (state, action) => {
      state.templateItem = action.payload;
      state.bagToEdit = null; // Clear edit bag when using template
    },
  },
});

export const { setOpenDrawer, setBagToUpdate, updateBagsList, setTemplateItem } =
  editBagSlice.actions;
export default editBagSlice.reducer;
