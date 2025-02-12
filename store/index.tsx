import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './reducers/themeSlice';
import listItemMenuReducer from './reducers/listItemMenuSlice'; // Import the new reducer
import listSliceReducer from './reducers/listSlice';
import groceryReducer from './reducers/groceryReducer';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    listItemMenu: listItemMenuReducer, // Add the new reducer
    list: listSliceReducer,
    grocery: groceryReducer
  },
});

export default store;