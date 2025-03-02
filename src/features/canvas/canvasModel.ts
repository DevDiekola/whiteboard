import { LucideIcon } from "lucide-react";

export type CanvasElementType =
  | "rectangle"
  | "circle"
  | "line"
  | "text"
  | "arrow"
  | "rhombus"
  | "pencil";

export type CanvasBaseElement = {
  ID: string;
  type: CanvasElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  strokeWidth?: number;
  strokeColor?: string;
  angle?: number;
  zIndex: number;
  createdAt: number;
};

export type CanvasRectangle = CanvasBaseElement & {
  type: "rectangle";
  borderRadius?: number;
};

export type CanvasRhombus = CanvasBaseElement & {
  type: "rhombus";
  borderRadius?: number;
};

export type CanvasCircle = CanvasBaseElement & {
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
};

export type CanvasArrow = CanvasBaseElement & {
  type: "arrow";
};

export type CanvasPoint = { x: number; y: number };

export type CanvasPencil = CanvasBaseElement & {
  type: "pencil";
  points: CanvasPoint[];
};

export type CanvasElement =
  | CanvasText
  | CanvasRectangle
  | CanvasCircle
  | CanvasLine
  | CanvasArrow
  | CanvasRhombus
  | CanvasPencil;

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

export interface CanvasState {
  elements: CanvasElement[];
  selectedToolID?: CanvasToolID;
  selectedElement?: CanvasElement;
  zoomPercentage: number;
}
