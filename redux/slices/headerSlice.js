import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

export const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setHeaderOption: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setHeaderOption } = headerSlice.actions;

export default headerSlice.reducer;
