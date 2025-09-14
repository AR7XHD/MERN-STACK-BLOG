import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isloggedin: false,
    user: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    AddUser: (state, action) => {
      state.isloggedin = true;
      state.user = action.payload;
    },
    RemoveUser: (state) => {
      state.isloggedin = false;
      state.user = {};
    },
  },
});

export const { AddUser, RemoveUser } = userSlice.actions;
// This exports the reducer function from the user slice, which is used to handle state changes for user management in the Redux store.
export default userSlice.reducer;
