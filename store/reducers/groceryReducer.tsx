import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GroceryItem {
  id: string; 
  name: string;
  price: string;
  quantity: string;
  shop: string;
  isCart: boolean; 
}

interface GroceryState {
  items: GroceryItem[];
}

const initialState: GroceryState = {
  items: [],
};
const grocerySlice = createSlice({
  name: 'grocery',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<GroceryItem>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateItem: (state, action: PayloadAction<GroceryItem>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
});

export const { addItem, removeItem, updateItem } = grocerySlice.actions;

export default grocerySlice.reducer;