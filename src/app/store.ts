import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { api } from './api/api';
import themeReducer from './features//themeSlice';
import modalReducer from './features/modalSlice';
import authSlice from './features/authSlice';
import filterSlice from './features/filterSlice';
import locationReducer from './features/locationSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { handleSuccessAndError } from './utils/handleSuccesAndError';

const rootReducer = combineReducers({
  theme: themeReducer,
  modal: modalReducer,
  auth: authSlice,
  filter: filterSlice,
  location: locationReducer,
  [api.reducerPath]: api.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme', 'location'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],

        ignoredActionPaths: [
          'payload.content',
          'meta.arg',
          'meta.baseQueryMeta',
        ],

        ignoredPaths: ['modal.content', 'api.queries', 'api.mutations'],
      },
    })
      .concat(api.middleware)
      .concat(handleSuccessAndError),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
