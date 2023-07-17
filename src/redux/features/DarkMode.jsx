import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  value: false,
};

export const darkModeSlice = createSlice({
  name: 'darkMode',
  initialState,
  reducers: {
    toggleDarkMode: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = !state.value;
    },
  },
});

// Action creators are generated for each case reducer function
export const {toggleDarkMode} = darkModeSlice.actions;

export default darkModeSlice.reducer;
