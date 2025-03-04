import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CanvasState,
  CanvasElement,
  CanvasToolID,
  LayerDirection,
} from "./canvasModel";
import historyReducer from "@/store/reducers/history";
import { getUpdatedElementLayer } from "@/utils/canvas";
import { CANVAS_LOCAL_STORAGE_KEY } from "@/constants/canvas";

const persistedElementsString = localStorage.getItem(CANVAS_LOCAL_STORAGE_KEY);
let persistedElements: CanvasElement[] = [];

try {
  persistedElements = persistedElementsString
    ? JSON.parse(persistedElementsString)
    : [];
} catch (error) {
  console.error("Error parsing persisted tasks:", error);
}

const initialState: CanvasState = {
  elements: persistedElements,
  zoomPercentage: 100,
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setElements: (state, action: PayloadAction<CanvasElement[]>) => {
      state.elements = action.payload;
    },
    addElement: (state, action: PayloadAction<CanvasElement>) => {
      state.elements.push(action.payload);
      state.selectedElement = action.payload;
      state.selectedToolID = "select";
    },
    selectTool: (state, action: PayloadAction<CanvasToolID>) => {
      state.selectedToolID = action.payload;
    },
    setSelectedElement: (
      state,
      action: PayloadAction<CanvasElement | undefined>
    ) => {
      state.selectedElement = action.payload;
    },
    updateElement: (state, action: PayloadAction<CanvasElement>) => {
      const index = state.elements.findIndex(
        (el) => el.ID === action.payload.ID
      );
      if (index !== -1) {
        state.elements[index] = action.payload;
      }
      state.selectedElement = action.payload;
      state.selectedToolID = "select";
    },
    deleteElement: (state, action: PayloadAction<string>) => {
      state.elements = state.elements.filter((el) => el.ID !== action.payload);
      state.selectedElement = undefined;
    },
    setZoomPercentage: (state, action: PayloadAction<number>) => {
      state.zoomPercentage = action.payload;
    },
    updateElementLayer: (
      state,
      action: PayloadAction<{ ID: string; direction: LayerDirection }>
    ) => {
      state.elements = getUpdatedElementLayer(
        state.elements,
        action.payload.ID,
        action.payload.direction
      );
    },
  },
});

export const {
  setElements,
  addElement,
  selectTool,
  setSelectedElement,
  updateElement,
  deleteElement,
  setZoomPercentage,
  updateElementLayer,
} = canvasSlice.actions;

export default historyReducer(canvasSlice.reducer);
