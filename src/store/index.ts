import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import your slices
import aiReviewReducer from './slides/ai-review-slice';
import contestReducer from './slides/contest-slice';
import problemReducer from './slides/problem-slice';
import workspaceReducer from './slides/workspace-slice';

// 1. Create the configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['workspace', 'aiReview'],
};

// 2. Combine your reducers into one root
const rootReducer = combineReducers({
  contest: contestReducer,
  problem: problemReducer,
  aiReview: aiReviewReducer,
  workspace: workspaceReducer,
});

// 3. Wrap the root reducer with the persist logic
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Create the store
export const store = configureStore({
  reducer: persistedReducer, // Use the wrapped reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Required to ignore redux-persist's non-serializable actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5. Export the persistor (Need this for main.tsx)
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
