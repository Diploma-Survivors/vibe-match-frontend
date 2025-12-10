import { configureStore } from '@reduxjs/toolkit';
import aiReviewReducer from './slides/ai-review-slice';
import contestReducer from './slides/contest-slice';

export const store = configureStore({
  reducer: {
    contest: contestReducer,
    aiReview: aiReviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
