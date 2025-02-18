import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BookmarkItem {
  id: string;
  name: string;
  path: string;
  is_check: boolean;
}

interface BookmarkState {
  listitems: { [id: string]: BookmarkItem[] };
}

const initialState: BookmarkState = {
  listitems: {},
};

const bookmarkSlice = createSlice({
  name: 'bookmark',
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
    addItem: (state, action: PayloadAction<{ listId: string, item: BookmarkItem }>) => {
      const { listId, item } = action.payload;
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
         if (state.listitems[listId].length === 0) {
          delete state.listitems[listId];
        }
      }
    },
    updateItem: (state, action: PayloadAction<{ listId: string, item: BookmarkItem }>) => {
      const { listId, item } = action.payload;
      if (state.listitems[listId]) {
        const index = state.listitems[listId].findIndex((bookmarkItem) => bookmarkItem.id === item.id);
        if (index !== -1) {
          state.listitems[listId][index] = item;
        }
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
        if (state.listitems[listId].length === 0) {
          delete state.listitems[listId];
        }
      }
    },

    removeItemsTrue: (state, action: PayloadAction<string>) => {
      const { listId } = action.payload;
      if (state.listitems[listId]) {
        state.listitems[listId] = state.listitems[listId].filter(item => !item.is_check);
        if (state.listitems[listId].length === 0) {
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
  setAllItemsFalse,
  setAllItemsTrue,
  removeItemsFalse,
  removeItemsTrue,
} = bookmarkSlice.actions;

export const selectItemsByListId = (state: { bookmark: { listitems: { [x: string]: any; }; } }) => {
  return state.bookmark.listitems
};


export default bookmarkSlice.reducer;