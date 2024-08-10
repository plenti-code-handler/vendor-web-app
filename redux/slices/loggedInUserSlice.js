import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    name: "Deepak Kumar",
    role: "admin",
    // role: "business_owner",
  },
};

export const loggedInUserSlice = createSlice({
  name: "loggedInUser",
  initialState,
  reducers: {},
});

export default loggedInUserSlice.reducer;
