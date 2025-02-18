import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './reducers/themeSlice';
import listItemMenuReducer from './reducers/listItemMenuSlice'; // Import the new reducer
import listSliceReducer from './reducers/listSlice';
import groceryReducer from './reducers/groceryReducer';
import todoReducer from './reducers/todoReducer';
import bookmarkReducer from './reducers/bookmarkReducer';
import noteReducer from './reducers/noteReducer';
import authReducer from './reducers/authReducer';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    listItemMenu: listItemMenuReducer, // Add the new reducer
    list: listSliceReducer,
    grocery: groceryReducer,
    todo: todoReducer,
    bookmark: bookmarkReducer,
    note: noteReducer,
    auth: authReducer
  },
});

export default store;