import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isVisible: false,
  menuButtonLayout: { x: 0, y: 0, width: 0, height: 0 },
  selectedListId: null, 
};

const listItemMenuSlice = createSlice({
  name: 'listItemMenu',
  initialState,
  reducers: {
    openMenu: (state, action) => {
      state.isVisible = true;
      state.menuButtonLayout = action.payload.menuButtonLayout;
      state.selectedListId = action.payload.listId; 
    },
    closeMenu: (state) => {
      state.isVisible = false;
      state.selectedListId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase("RESET", () => initialState); 
  },
});

export const { openMenu, closeMenu } = listItemMenuSlice.actions;
export const selectListItemMenu = (state: any) => state.listItemMenu;
export default listItemMenuSlice.reducer;