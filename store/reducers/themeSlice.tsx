import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: 'light',
  },
  reducers: {
    toggleTheme: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export const selectThemeMode = (state: any) => state.theme.mode;
export default themeSlice.reducer;
