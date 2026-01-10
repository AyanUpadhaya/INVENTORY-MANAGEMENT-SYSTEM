import { configureStore } from "@reduxjs/toolkit";
import { appApi } from "../features/api";
import authReducer  from "../features/auth/authSlice"

export const store = configureStore({
  reducer: {
    [appApi.reducerPath]: appApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(appApi.middleware),
})