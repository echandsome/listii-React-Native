import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BookmarkItem {
  id: string;
  name: string;
  path: string;
  isCart: boolean;
}

interface BookmarkState {
  items: BookmarkItem[];
}

const initialState: BookmarkState = {
  items: [],
};

const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<BookmarkItem>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateItem: (state, action: PayloadAction<BookmarkItem>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    setAllItemsFalse: (state) => {
      state.items = state.items.map(item =>
        item.isCart ? { ...item, isCart: false } : item
      );
    },

    setAllItemsTrue: (state) => {
      state.items = state.items.map(item =>
        !item.isCart ? { ...item, isCart: true } : item
      );
    },

    removeItemsFalse: (state) => {
      state.items = state.items.filter(item => item.isCart);
    },

    removeItemsTrue: (state) => {
      state.items = state.items.filter(item => !item.isCart);
    },
  },
});

export const {
  addItem,
  removeItem,
  updateItem,
  setAllItemsFalse,
  setAllItemsTrue,
  removeItemsFalse,
  removeItemsTrue,
} = bookmarkSlice.actions;

export default bookmarkSlice.reducer;