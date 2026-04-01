import { configureStore } from '@reduxjs/toolkit';
import { reducer as appReducer } from './reducer'; 
import offersReducer from './offers-reducer'; 
import { createAPI } from '../services/api';

export const api = createAPI();

export const store = configureStore({
  reducer: {
    app: appReducer,     
    offers: offersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
