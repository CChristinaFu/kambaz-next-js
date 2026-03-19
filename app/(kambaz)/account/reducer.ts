import { createSlice } from "@reduxjs/toolkit";

interface User {
  _id: string;
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
}

const initialState = {
  currentUser: null as User | null,
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