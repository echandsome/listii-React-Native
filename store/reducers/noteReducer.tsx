import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NoteItem {
  id: string;
  name: string;
  content: string;
  isCart: boolean;
}

interface NoteState {
  items: NoteItem[];
}

const initialState: NoteState = {
  items: [],
};

const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<NoteItem>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateItem: (state, action: PayloadAction<NoteItem>) => {
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
} = noteSlice.actions;

export default noteSlice.reducer;