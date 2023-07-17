import {configureStore} from '@reduxjs/toolkit';
import reloadReducer from './features/ReloadNewsSlice';
import reloadStatusReducer from './features/ReloadStatusBar';
import hideTabBarReducer from './features/HideTabBar';
import darkModeReducer from './features/DarkMode';

export const store = configureStore({
  reducer: {
    reloadNews: reloadReducer,
    reloadStatusBar: reloadStatusReducer,
    hideTabBar: hideTabBarReducer,
    darkMode: darkModeReducer,
  },
});
