import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserItem {
  id: string;
  aud: string;
  email: string;
}

interface UserState {
  user: UserItem | null; 
  isAuthenticated: boolean;
}

type UserData = {
  id: string;
  aud: string;
  email: string;
}

const initialUserState: UserState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'auth',
  initialState: initialUserState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase("RESET", () => initialUserState); 
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectUser = (state: { user: { user: any; }; }) => state.user.user;
export const selectIsAuthenticated = (state: { user: { isAuthenticated: boolean; }; }) => state.user.isAuthenticated;

export default userSlice.reducer;