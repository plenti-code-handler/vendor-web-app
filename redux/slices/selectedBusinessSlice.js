import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedBusiness: {},
};

const selectedBusinessSlice = createSlice({
  name: "selectedBusiness",
  initialState,
  reducers: {
    selectBusiness: (state, action) => {
      state.selectedBusiness = action.payload;
    },
  },
});

export const { selectBusiness } = selectedBusinessSlice.actions;
export default selectedBusinessSlice.reducer;
