import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: {
    _id: "123",
    username: "iron_man",
    password: "stark123",
    firstName: "Tony",
    lastName: "Stark",
    email: "tony@stark.com",
    role: "FACULTY",
  } as any,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentUser } = accountSlice.actions;
export default accountSlice.reducer;