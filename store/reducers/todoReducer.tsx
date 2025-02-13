import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TodoItem {
  id: string;
  name: string;
  path: string;
  isCart: boolean;
}

interface TodoState {
  items: TodoItem[];
}

const initialState: TodoState = {
  items: [],
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<TodoItem>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateItem: (state, action: PayloadAction<TodoItem>) => {
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
} = todoSlice.actions;

export default todoSlice.reducer;