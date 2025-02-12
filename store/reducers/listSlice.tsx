import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

interface List {
    id: string;
    [key: string]: any; // Allow for dynamic properties in your list item
}

interface ListState {
    lists: List[];
    archiveLists: List[]; // Added: array for archived lists
}

const initialState: ListState = {
    lists: [],
    archiveLists: [], // Initialized: archive list array initialized
};

const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
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

        // Added: reducer to delete and archive a list
        archiveList: (state, action: PayloadAction<string>) => {
            const itemId = action.payload;
            const listToArchive = state.lists.find(list => list.id === itemId);

            if (listToArchive) {
                // Remove from list
                state.lists = state.lists.filter(list => list.id !== itemId);

                // Add to archive list
                state.archiveLists = [...state.archiveLists, listToArchive];
            }
        },

        // Added: reducer to move list from archiveLists back to lists
        restoreList: (state, action: PayloadAction<string>) => {
            const itemId = action.payload;
            const listToRestore = state.archiveLists.find(list => list.id === itemId);

            if (listToRestore) {
                // Remove from archive list
                state.archiveLists = state.archiveLists.filter(list => list.id !== itemId);

                // Add to lists
                state.lists = [...state.lists, listToRestore];
            }
        },
    },
});

export const { addList, deleteList, updateList, duplicateList, archiveList, restoreList } = listSlice.actions;

export const selectLists = (state: any) => state.list.lists;
export const selectArchiveLists = (state: any) => state.list.archiveLists; // Added: archive list selector

export const selectListById = (state: any, itemId: string) => {
    return state.list.lists.find((list: any) => list.id === itemId);
};

export default listSlice.reducer;