import {
  CanvasShapeHandlePosition,
  CanvasShapeType,
  CanvasTool,
} from "@/features/canvas/canvasModel";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  ArrowRightIcon,
  CircleIcon,
  DiamondIcon,
  EraserIcon,
  HandIcon,
  ImageIcon,
  LetterTextIcon,
  MousePointerIcon,
  PencilIcon,
  SlashIcon,
  SquareIcon,
} from "lucide-react";

export const CANVAS_SLICE_NAME = "canvas";
export const CANVAS_LOCAL_STORAGE_KEY = "canvas";

export const UNDO_CANVAS_ACTION: Readonly<PayloadAction<string>> = {
  type: "UNDO",
  payload: CANVAS_SLICE_NAME,
};
export const REDO_CANVAS_ACTION: Readonly<PayloadAction<string>> = {
  type: "REDO",
  payload: CANVAS_SLICE_NAME,
};

export const TOOLBAR_TOOLS: ReadonlyArray<CanvasTool> = [
  { ID: "select", label: "Select", icon: MousePointerIcon },
  { ID: "pan", label: "Pan", icon: HandIcon },
  { ID: "rectangle", label: "Rectangle", icon: SquareIcon },
  { ID: "circle", label: "Circle", icon: CircleIcon },
  { ID: "rhombus", label: "Rhombus", icon: DiamondIcon },
  { ID: "line", label: "Arrow", icon: SlashIcon },
  { ID: "arrow", label: "Line", icon: ArrowRightIcon },
  { ID: "pencil", label: "Pencil", icon: PencilIcon },
  { ID: "text", label: "Text", icon: LetterTextIcon },
  { ID: "image", label: "Image", icon: ImageIcon },
  { ID: "eraser", label: "Eraser", icon: EraserIcon },
];

export const RESIZE_HANDLE_POSITIONS: ReadonlyArray<CanvasShapeHandlePosition> =
  ["top-left", "top-right", "bottom-left", "bottom-right"];

export const CANVAS_SHAPE_TYPES: ReadonlyArray<CanvasShapeType> = [
  "rectangle",
  "circle",
  "rhombus",
];

export const FILL_COLORS: ReadonlyArray<string> = [
  "transparent",
  "#000000",
  "#FFFFFF",
  "#C2C2C2",
  "#8E8E8E",
  "#E4C9A0",
  "#D7B899",
  "#B89B9D",
  "#E5A08C",
  "#A7C4A0",
  "#A3BCE2",
  "#789DCB",
  "#A2D2C6",
  "#E8B4B8",
  "#C6A5D8",
  "#d8e1d4",
  "#DDD4E1",
];

export const STROKE_COLORS: ReadonlyArray<string> = [
  "transparent",
  "#000000",
  "#FFFFFF",
  "#3D3D3D",
  "#555555",
  "#717171",
  "#8E8E8E",
  "#A67B5B",
  "#C49A6C",
  "#B08D7E",
  "#6C8C6F",
  "#5E738F",
  "#6E7B92",
  "#759F9D",
  "#9D6B84",
  "#8B6F9B",
  "#A295B7",
];

export const CANVAS_MIN_ZOOM = 10;
export const CANVAS_MAX_ZOOM = 1000;
export const CANVAS_ZOOM_STEP = 10;
export const CANVAS_ZOOM_DELTA = 0.3;

export const CANVAS_SCROLL_DELTA = 1.3;
