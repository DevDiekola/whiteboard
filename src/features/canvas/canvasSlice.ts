import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CanvasState, CanvasElement, CanvasToolID } from "./canvasModel";
import historyReducer from "@/store/reducers/history";

const initialState: CanvasState = {
  elements: [],
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
    },
    selectTool: (state, action: PayloadAction<CanvasToolID>) => {
      state.selectedToolID = action.payload;
    },
    setSelectedElement: (state, action: PayloadAction<CanvasElement>) => {
      state.selectedElement = action.payload;
    },
    updateElement: (state, action: PayloadAction<CanvasElement>) => {
      const index = state.elements.findIndex(
        (el) => el.ID === action.payload.ID
      );
      if (index !== -1) {
        state.elements[index] = action.payload;
      }
    },
    deleteElement: (state, action: PayloadAction<string>) => {
      state.elements = state.elements.filter((el) => el.ID !== action.payload);
    },
    setZoomPercentage: (state, action: PayloadAction<number>) => {
      state.zoomPercentage = action.payload;
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
} = canvasSlice.actions;

export default historyReducer(canvasSlice.reducer);
