import { combineReducers } from "@reduxjs/toolkit";
import canvasReducer from "@/features/canvas/canvasSlice";

export const rootReducer = combineReducers({
  canvasState: canvasReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
