import { configureStore } from '@reduxjs/toolkit';
import contestReducer from './slides/contest-slice';

export const store = configureStore({
  reducer: {
    contest: contestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
