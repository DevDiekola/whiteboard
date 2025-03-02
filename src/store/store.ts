import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers/root";
import persistenceMiddleware from "./middlewares/persistence";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistenceMiddleware),
});

export default store;
