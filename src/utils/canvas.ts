import { CanvasElement } from "@/features/canvas/canvasModel";

// This basically sets the layer (similar to z-index for the CSS guys) for a particular element
export const getUpdatedElementLayer = (
  elements: CanvasElement[],
  id: string,
  direction: "up" | "down" | "top" | "bottom"
) => {
  const index = elements.findIndex((el) => el.ID === id);
  if (index === -1) return elements;

  const updatedElements = [...elements];
  const element = { ...updatedElements[index] };

  switch (direction) {
    case "up":
      element.layer++;
      break;
    case "down":
      element.layer--;
      break;
    case "top":
      element.layer = Math.max(...updatedElements.map((el) => el.layer)) + 1;
      break;
    case "bottom":
      element.layer = Math.min(...updatedElements.map((el) => el.layer)) - 1;
      break;
  }

  updatedElements[index] = element;

  return updatedElements;
};
