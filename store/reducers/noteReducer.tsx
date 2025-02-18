import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NoteItem {
  id: string;
  name: string;
  content: string;
  is_check: boolean;
}

interface NoteState {
  listitems: { [listId: string]: NoteItem[] };
}

const initialState: NoteState = {
  listitems: {},
};

const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.listitems = action.payload;
    },
    addItem: (state, action: PayloadAction<{ listId: string, item: NoteItem }>) => {
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
    updateItem: (state, action: PayloadAction<{ listId: string, item: NoteItem }>) => {
      const { listId, item } = action.payload;
      if (state.listitems[listId]) {
        const index = state.listitems[listId].findIndex((noteItem) => noteItem.id === item.id);
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
  addItem,
  removeItem,
  updateItem,
  setAllItemsFalse,
  setAllItemsTrue,
  removeItemsFalse,
  removeItemsTrue,
} = noteSlice.actions;

export const selectItemsByListId = (state: { note: { listitems: { [x: string]: any; }; } }) => {
  return state.note.listitems;
};

export default noteSlice.reducer;