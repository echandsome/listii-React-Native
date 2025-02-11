import { createSlice } from '@reduxjs/toolkit';
import { useColorScheme } from '@/hooks/useColorScheme';
const colorScheme = useColorScheme();

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: colorScheme,
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
