import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GroceryItem {
  id: string;
  name: string;
  price: string;
  quantity: string;
  shop: string;
  is_check: boolean;
}

interface GroceryState {
  listitems: { [id: string]: GroceryItem[] };
}

const initialState: GroceryState = {
  listitems: {},
};

const grocerySlice = createSlice({
  name: 'grocery',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.listitems = action.payload;
    },
    addItems: (state, action) => {
      const { listId, items } = action.payload;
    
      if (!state.listitems[listId]) {
        state.listitems[listId] = [];
      }
      
      state.listitems[listId] = state.listitems[listId].concat(items);
    },
    addItem: (state, action: PayloadAction<{ listId: string, item: GroceryItem }>) => {
      const { listId, item } = action.payload;
      let _items = state.listitems[listId];
      if (_items != null && _items.length > 0 &&  _items.find((_item) => _item.id == item.id)) return;
      if (state.listitems[listId]) {
        state.listitems[listId].push(item);
      } else {
        state.listitems[listId] = [item];
      }
    },
    removeItem: (state, action: PayloadAction<{ listId: string, itemId: string }>) => {
      const { listId, itemId } = action.payload;
      if (state.listitems[listId]) {
        state.listitems[listId] = state.listitems[listId].filter((item) => item.id !== itemId);
        if (state.listitems[listId].length == 0) {
          delete state.listitems[listId];
        }
      }
    },
    updateItem: (state, action: PayloadAction<{ listId: string, item: GroceryItem }>) => {
      const { listId, item } = action.payload;
      if (state.listitems[listId]) {
        const index = state.listitems[listId].findIndex((groceryItem) => groceryItem.id == item.id);
        if (index !== -1) {
          state.listitems[listId][index] = item;
        }
      }
    },

    setAllItemsIsCart: (state, action: PayloadAction<{ listId: string, is_check: boolean }>) => {
      const { listId, is_check } = action.payload;
      if (state.listitems[listId]) {
        state.listitems[listId] = state.listitems[listId].map(item => ({ ...item, is_check: is_check }));
      }
    },

    setAllItemsFalse: (state, action: PayloadAction<string>) => {
      const { listId } = action.payload;
      if (state.listitems[listId]) {
          state.listitems[listId] = state.listitems[listId].map(item =>
            item.is_check ? { ...item, is_check: false } : item
          );
      }
    },

    setAllItemsTrue: (state, action: PayloadAction<string>) => {
       const { listId } = action.payload;
        if (state.listitems[listId]) {
        state.listitems[listId] = state.listitems[listId].map(item =>
            !item.is_check ? { ...item, is_check: true } : item
          );
        }
    },

    removeItemsFalse: (state, action: PayloadAction<string>) => {
      const { listId } = action.payload;
      if (state.listitems[listId]) {
        state.listitems[listId] = state.listitems[listId].filter(item => item.is_check);
        if (state.listitems[listId].length == 0) {
          delete state.listitems[listId];
        }
      }
    },

    removeItemsTrue: (state, action: PayloadAction<string>) => {
       const { listId } = action.payload;
        if (state.listitems[listId]) {
          state.listitems[listId] = state.listitems[listId].filter(item => !item.is_check);
           if (state.listitems[listId].length == 0) {
            delete state.listitems[listId];
          }
        }
    },
  },
  extraReducers: (builder) => {
    builder.addCase("RESET", () => initialState); 
  },
});

export const {
  setItems,
  addItems,
  addItem,
  removeItem,
  updateItem,
  setAllItemsIsCart,
  setAllItemsFalse,
  setAllItemsTrue,
  removeItemsFalse,
  removeItemsTrue,
} = grocerySlice.actions;

export const selectItemsByListId = (state: { grocery: { listitems: { [x: string]: any; }; } }) => {
  return state.grocery.listitems;
};


export default grocerySlice.reducer;