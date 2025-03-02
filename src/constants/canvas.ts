import { CanvasTool } from "@/features/canvas/canvasModel";
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
