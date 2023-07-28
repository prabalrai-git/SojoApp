import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  value: true,
};

export const toggleNotificationSlice = createSlice({
  name: 'darkMode',
  initialState,
  reducers: {
    toggleNotification: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {toggleNotification} = toggleNotificationSlice.actions;

export default toggleNotificationSlice.reducer;
