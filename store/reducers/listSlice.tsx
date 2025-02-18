import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { createSelector } from 'reselect'

interface List {
    id: string;
    is_archive: boolean; // Added: is_archive property
    [key: string]: any; // Allow for dynamic properties in your list item
}

interface ListState {
    lists: List[];
}

const initialState: ListState = {
    lists: [],
};

const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
        setList: (state, action) => {
            state.lists = action.payload;
        },
        addList: (state, action: PayloadAction<List>) => {
            state.lists = [...state.lists, action.payload];
        },
        deleteList: (state, action: PayloadAction<string>) => {
            state.lists = state.lists.filter((list) => list.id !== action.payload);
        },
        updateList: (state, action: PayloadAction<{ id: string; updates: Partial<List> }>) => {
            const { id, updates } = action.payload;
            state.lists = state.lists.map((list) =>
                list.id === id ? { ...list, ...updates } : list
            );
        },
        duplicateList: (state, action: PayloadAction<string>) => {
            const idToDuplicate = action.payload;
            const listToDuplicate = state.lists.find((list) => list.id === idToDuplicate);

            if (listToDuplicate) {
                // Generate a new ID for the duplicated item
                const newId = uuidv4();

                // Create a deep copy of the list item (to avoid modifying the original)
                const duplicatedList = { ...listToDuplicate, id: newId };

                state.lists = [...state.lists, duplicatedList];
            }
        },

        // Modified: reducer to archive a list (set is_archive to true)
        archiveList: (state, action: PayloadAction<string>) => {
            const itemId = action.payload;
            state.lists = state.lists.map(list =>
                list.id === itemId ? { ...list, is_archive: true } : list
            );
        },

        // Added: reducer to restore a list (set is_archive to false)
        restoreList: (state, action: PayloadAction<string>) => {
            const itemId = action.payload;
            state.lists = state.lists.map(list =>
                list.id === itemId ? { ...list, is_archive: false } : list
            );
        },
    },
    extraReducers: (builder) => {
        builder.addCase("RESET", () => initialState); 
    },
});

export const { setList, addList, deleteList, updateList, duplicateList, archiveList, restoreList } = listSlice.actions;

export const selectListById = (state: any, itemId: string) => {
    return state.list.lists.find((list: any) => list.id === itemId);
};

const selectListsState = (state: any) => state.list.lists;

export const selectLists = createSelector(
  [selectListsState],
  (lists) => lists.filter((list) => !list.is_archive).reverse()
);

export const selectArchiveLists = createSelector(
  [selectListsState],
  (lists) => lists.filter((list) => list.is_archive).reverse()
);



export default listSlice.reducer;