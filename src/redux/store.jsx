import {configureStore} from '@reduxjs/toolkit';
import reloadReducer from './features/ReloadNewsSlice';
import reloadStatusReducer from './features/ReloadStatusBar';
import hideTabBarReducer from './features/HideTabBar';

export const store = configureStore({
  reducer: {
    reloadNews: reloadReducer,
    reloadStatusBar: reloadStatusReducer,
    hideTabBar: hideTabBarReducer,
  },
});
