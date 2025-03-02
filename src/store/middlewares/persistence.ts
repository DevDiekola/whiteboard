import { Action, Middleware, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../reducers/root";
import {
  CANVAS_LOCAL_STORAGE_KEY,
  CANVAS_SLICE_NAME,
} from "@/constants/canvas";

const persistenceMiddleware: Middleware<object, RootState> =
  (storeAPI) => (next) => (action) => {
    const result = next(action);

    if (
      !(action as Action).type.startsWith(`${CANVAS_SLICE_NAME}/`) &&
      (action as PayloadAction<string>)?.payload !== CANVAS_SLICE_NAME
    ) {
      return;
    }

    const state = storeAPI.getState();

    localStorage.setItem(
      CANVAS_LOCAL_STORAGE_KEY,
      JSON.stringify(state.canvasState.present.elements)
    );

    return result;
  };

export default persistenceMiddleware;
