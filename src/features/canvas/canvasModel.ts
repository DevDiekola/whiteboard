import { LucideIcon } from "lucide-react";

export type CanvasElementType =
  | "rectangle"
  | "circle"
  | "line"
  | "text"
  | "arrow"
  | "rhombus"
  | "pencil"
  | "eraser"
  | "image";

export type CanvasBaseElement = {
  ID: string;
  type: CanvasElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  angle?: number;
  opacity: number;
  strokeColor?: string;
  layer: number;
  createdAt: number;
};

export type CanvasShapeType = "rectangle" | "circle" | "rhombus";

export type CanvasShape = CanvasBaseElement & {
  type: CanvasShapeType;
  fill: string;
  strokeWidth?: number;
  strokeStyle?: string;
};

export type CanvasRectangle = CanvasShape & {
  type: "rectangle";
  borderRadius?: number;
};

export type CanvasRhombus = CanvasShape & {
  type: "rhombus";
  borderRadius?: number;
};

export type CanvasCircle = CanvasShape & {
  type: "circle";
};

export type CanvasText = CanvasBaseElement & {
  type: "text";
  text: string;
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
  textAlign: "left" | "center" | "right";
  verticalAlign: "top" | "middle" | "bottom";
  lineHeight: number;
};

export type CanvasLine = CanvasBaseElement & {
  type: "line";
  strokeWidth: number;
};

export type CanvasArrow = CanvasBaseElement & {
  type: "arrow";
  strokeWidth: number;
};

export type CanvasPoint = { x: number; y: number };

export type CanvasPencil = CanvasBaseElement & {
  type: "pencil";
  points: CanvasPoint[];
  strokeWidth: number;
};

export type CanvasElement =
  | CanvasText
  | CanvasRectangle
  | CanvasCircle
  | CanvasLine
  | CanvasArrow
  | CanvasRhombus
  | CanvasPencil;

export type CanvasElementKeys =
  | keyof CanvasText
  | keyof CanvasRectangle
  | keyof CanvasCircle
  | keyof CanvasLine
  | keyof CanvasArrow
  | keyof CanvasRhombus
  | keyof CanvasPencil;

export type CanvasToolID =
  | "select"
  | "pan"
  | "rectangle"
  | "circle"
  | "rhombus"
  | "arrow"
  | "line"
  | "pencil"
  | "text"
  | "image"
  | "eraser";

export type CanvasTool = {
  ID: CanvasToolID;
  label: string;
  icon: LucideIcon;
};

export type LayerDirection = "up" | "down" | "top" | "bottom";

export type CanvasShapeHandlePosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface CanvasState {
  elements: CanvasElement[];
  selectedToolID?: CanvasToolID;
  selectedElement?: CanvasElement;
  zoomPercentage: number;
}
