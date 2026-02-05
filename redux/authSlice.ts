
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Role } from '../types';

interface AuthState {
  user: User | null;
  language: 'en' | 'hi';
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: JSON.parse(sessionStorage.getItem('nexus_user') || 'null'),
  language: (sessionStorage.getItem('nexus_lang') as 'en' | 'hi') || 'en',
  isAuthenticated: !!sessionStorage.getItem('nexus_user'),
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      sessionStorage.setItem('nexus_user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem('nexus_user');
    },
    setLanguage: (state, action: PayloadAction<'en' | 'hi'>) => {
      state.language = action.payload;
      sessionStorage.setItem('nexus_lang', action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, logout, setLanguage, setLoading } = authSlice.actions;
export default authSlice.reducer;
