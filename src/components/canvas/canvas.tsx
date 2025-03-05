import {
  CanvasBaseElement,
  CanvasElement,
  CanvasPencil,
  CanvasShape,
  CanvasShapeHandlePosition,
  CanvasText,
} from "@/features/canvas/canvasModel";
import {
  addElement,
  deleteElement,
  setSelectedElement,
  setZoomPercentage,
  updateElement,
} from "@/features/canvas/canvasSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import useScreenSize from "@/hooks/useScreenSize";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Element from "./components/element/Element";
import {
  CANVAS_MAX_ZOOM,
  CANVAS_MIN_ZOOM,
  CANVAS_SCROLL_DELTA,
  CANVAS_ZOOM_DELTA,
  CANVAS_ZOOM_STEP,
  RESIZE_HANDLE_POSITIONS,
} from "@/constants/canvas";

const Canvas = () => {
  const dispatch = useDispatch();
  const { elements, selectedToolID, zoomPercentage, selectedElement } =
    useAppSelector((state) => state.canvasState.present);

  const sortedElements = [...elements].sort((a, b) => a.layer - b.layer);
  const { width: screenWidth, height: screenHeight } = useScreenSize();

  // Making the canvas initial viewbox twice the size of the screen
  const [viewBox, setViewBox] = useState({
    x: -screenWidth / 2,
    y: -screenHeight / 2,
    width: screenWidth * 2,
    height: screenHeight * 2,
  });

  const [isPanning, setIsPanning] = useState(false);
  const [panningStartPoint, setPanningStartPoint] = useState<{
    x: number;
    y: number;
  }>();
  const [isDrawing, setIsDrawing] = useState(false);

  const [currentElement, setCurrentElement] = useState<CanvasElement>();
  const [drawingStartPoint, setDrawingStartPoint] = useState<{
    x: number;
    y: number;
  }>();

  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandlePosition, setResizeHandlePosition] =
    useState<CanvasShapeHandlePosition>();

  const [resizeStartPoint, setResizeStartPoint] = useState<{
    x: number;
    y: number;
  }>();

  const [isDragging, setIsDragging] = useState(false);
  const [draggingStartPoint, setDraggingStartPoint] = useState<{
    x: number;
    y: number;
  }>();

  useEffect(() => {
    setViewBox((prev) => {
      const scale = 100 / zoomPercentage;

      const newWidth = screenWidth * 2 * scale;
      const newHeight = screenHeight * 2 * scale;

      const centerX = prev.x + prev.width / 2;
      const centerY = prev.y + prev.height / 2;

      return {
        x: centerX - newWidth / 2,
        y: centerY - newHeight / 2,
        width: newWidth,
        height: newHeight,
      };
    });
  }, [screenWidth, screenHeight, zoomPercentage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        selectedElement &&
        (e.key === "Delete" || (e.metaKey && e.key === "Backspace"))
      ) {
        dispatch(deleteElement(selectedElement.ID));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElement, dispatch]);

  const getSVGCoordinates = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    return point.matrixTransform(svg.getScreenCTM()?.inverse());
  };

  const getSVGElementCoordinates = (
    e: React.MouseEvent<SVGGraphicsElement>
  ) => {
    const targetElement = e.currentTarget;
    const svg = targetElement.ownerSVGElement;

    if (!svg) return null;

    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;

    return point.matrixTransform(targetElement.getScreenCTM()?.inverse());
  };

  const handlePanStart = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsPanning(true);

    setPanningStartPoint({ x: e.clientX, y: e.clientY });
  };

  const handlePanMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isPanning || !panningStartPoint) return;

    const dx = (e.clientX - panningStartPoint.x) * 2;
    const dy = (e.clientY - panningStartPoint.y) * 2;
    setViewBox((prev) => ({
      ...prev,
      x: prev.x - dx,
      y: prev.y - dy,
    }));

    setPanningStartPoint({ x: e.clientX, y: e.clientY });
  };

  const handlePanEnd = () => setIsPanning(false);

  const handleDrawStart = (e: React.MouseEvent<SVGSVGElement>) => {
    if (
      !selectedToolID ||
      selectedToolID === "select" ||
      selectedToolID === "pan"
    ) {
      return;
    }

    const svgCoords = getSVGCoordinates(e);

    setDrawingStartPoint({ x: svgCoords.x, y: svgCoords.y });

    const newBaseElement: CanvasBaseElement = {
      ID: crypto.randomUUID(),
      type: selectedToolID,
      x: svgCoords.x,
      y: svgCoords.y,
      width: 0,
      height: 0,
      opacity: 1,
      layer: 1,
      strokeColor: "#000000",
      createdAt: Date.now(),
    };

    let newCanvasElement: CanvasElement;

    if (newBaseElement.type === "pencil") {
      const newPencilElement: CanvasPencil = {
        ...newBaseElement,
        type: "pencil",
        points: [{ x: svgCoords.x, y: svgCoords.y }],
        strokeWidth: 1,
        strokeColor: "#000000",
      };

      newCanvasElement = newPencilElement;
    } else if (newBaseElement.type === "text") {
      const newTextElement: CanvasText = {
        ...newBaseElement,
        type: "text",
        text: "",
        fontSize: 40,
        fontWeight: 500,
        fontFamily: "Arial",
        textAlign: "left",
        verticalAlign: "top",
        lineHeight: 1.2,
        strokeColor: "#000000",
      };

      newCanvasElement = newTextElement;
    } else if (
      ["rectangle", "rhombus", "circle"].includes(newBaseElement.type)
    ) {
      const newShapeElement: CanvasShape = {
        ...newBaseElement,
        type:
          newBaseElement.type === "rectangle"
            ? "rectangle"
            : newBaseElement.type === "rhombus"
            ? "rhombus"
            : "circle",
        fill: "transparent",
        strokeWidth: 2,
        strokeColor: "#000000",
        strokeStyle: "solid",
      };

      newCanvasElement = newShapeElement;
    } else {
      newCanvasElement = newBaseElement as CanvasElement; // this is very flimsy... should revisit;
    }

    setCurrentElement(newCanvasElement);
    setIsDrawing(true);
  };

  const handleDrawMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing || !currentElement || !drawingStartPoint) return;
    const svgCoords = getSVGCoordinates(e);

    setCurrentElement((prev) => {
      if (!prev) return undefined;

      const { x: startX, y: startY } = drawingStartPoint;
      const { x: currentX, y: currentY } = svgCoords;

      const newX = Math.min(startX, currentX);
      const newY = Math.min(startY, currentY);
      const newWidth = Math.abs(currentX - startX);
      const newHeight = Math.abs(currentY - startY);

      const newElement: CanvasElement = {
        ...prev,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      };

      if (prev.type === "pencil") {
        return {
          ...newElement,
          points: [...(prev.points ?? []), { x: currentX, y: currentY }],
        };
      }

      return newElement;
    });
  };

  const handleDrawEnd = () => {
    if (
      !currentElement ||
      currentElement.width < 1 ||
      currentElement.height < 1
    ) {
      setIsDrawing(false);
      setCurrentElement(undefined);

      return;
    }

    dispatch(addElement(currentElement));

    setIsDrawing(false);
    setCurrentElement(undefined);
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!(e.target as HTMLElement).closest(".canvas-element")) {
      dispatch(setSelectedElement(undefined));
    }

    switch (selectedToolID) {
      case "pan":
        return handlePanStart(e);
      default:
        handleDrawStart(e);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDrawing) {
      handleDrawMove(e);
    }
    if (isPanning) {
      handlePanMove(e);
    }
    if (isResizing) {
      handleResizeMove(e);
    }
    if (isDragging) {
      handleDragMove(e);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      handleDrawEnd();
    }
    if (isPanning) {
      handlePanEnd();
    }
    if (isResizing) {
      handleResizeEnd();
    }
    if (isDragging) {
      handleDragEnd();
    }
  };

  const handleSelectElement = (element: CanvasElement) => {
    dispatch(setSelectedElement(element));
  };

  const handleWheelZoom = (e: React.WheelEvent<SVGSVGElement>) => {
    if (!e.ctrlKey) {
      // We are simply "scrolling" the canvas
      setViewBox((prev) => ({
        ...prev,
        x: prev.x + e.deltaX * CANVAS_SCROLL_DELTA,
        y: prev.y + e.deltaY * CANVAS_SCROLL_DELTA,
      }));

      return;
    }

    const newZoom = Math.min(
      CANVAS_MAX_ZOOM,
      Math.max(
        CANVAS_MIN_ZOOM,
        zoomPercentage - e.deltaY * CANVAS_ZOOM_DELTA * CANVAS_ZOOM_STEP
      )
    );

    dispatch(setZoomPercentage(newZoom));
  };

  const getHandlePosition = (element: CanvasElement, position: string) => {
    switch (position) {
      case "top-left":
        return [element.x, element.y];
      case "top-right":
        return [element.x + element.width, element.y];
      case "bottom-left":
        return [element.x, element.y + element.height];
      case "bottom-right":
        return [element.x + element.width, element.y + element.height];
      default:
        return [0, 0];
    }
  };

  const handleResizeStart = (
    e: React.MouseEvent<SVGGraphicsElement>,
    pos: CanvasShapeHandlePosition
  ) => {
    e.stopPropagation(); // Had to use this to prevent unselecting. It basically prevents further propagation of the event.

    const svgCoords = getSVGElementCoordinates(e);

    if (!svgCoords) return;

    setIsResizing(true);
    setResizeHandlePosition(pos);
    setResizeStartPoint({ x: svgCoords.x, y: svgCoords.y });
  };

  const handleResizeMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isResizing || !selectedElement || !resizeStartPoint) return;

    const { x, y, width, height } = selectedElement;

    let newX = x;
    let newY = y;
    let newWidth = width;
    let newHeight = height;

    const svgCoords = getSVGCoordinates(e);

    const dx = svgCoords.x - resizeStartPoint.x;
    const dy = svgCoords.y - resizeStartPoint.y;

    console.log({
      resizeHandlePosition,
      x,
      y,
      resizeStartPointX: resizeStartPoint.x,
      resizeStartPointY: resizeStartPoint.y,
      coordX: svgCoords.x,
      coordY: svgCoords.y,
      width,
      height,
      dx,
      dy,
    });

    if (resizeHandlePosition === "top-left") {
      newX = x + dx;
      newY = y + dy;
      newWidth = width - dx;
      newHeight = height - dy;
    } else if (resizeHandlePosition === "top-right") {
      const fixedX = selectedElement.x;
      const fixedY = selectedElement.y + selectedElement.height;
      newX = fixedX; // element's x position remains unchanged since we are dragging on the right side
      newY = Math.min(svgCoords.y, fixedY);
      newWidth = svgCoords.x - fixedX;
      newHeight = fixedY - newY;
    } else if (resizeHandlePosition === "bottom-left") {
      const fixedX = selectedElement.x + selectedElement.width;
      const fixedY = selectedElement.y;
      newY = fixedY; // y remains unchanged (we are dragging on the bottom so we are not impacting the y position)
      newX = Math.min(svgCoords.x, fixedX);
      newWidth = fixedX - newX;
      newHeight = svgCoords.y - fixedY;
    } else if (resizeHandlePosition === "bottom-right") {
      // Neither our x or y position changes here, we are only resizing
      newWidth = svgCoords.x - selectedElement.x;
      newHeight = svgCoords.y - selectedElement.y;
    }

    // I'm doing this to ensure size doesn't go negative for whatever reason
    if (newWidth < 5) {
      newX = x;
      newWidth = 5;
    }
    if (newHeight < 5) {
      newY = y;
      newHeight = 5;
    }

    const updatedElement = {
      ...selectedElement,
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    };

    dispatch(updateElement(updatedElement));
    setResizeStartPoint({ x: newX, y: newY });
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeHandlePosition(undefined);
    setResizeStartPoint(undefined);
  };

  const handleDragStart = (
    e: React.MouseEvent<SVGGraphicsElement, MouseEvent>
  ) => {
    if (!selectedElement) return;

    e.stopPropagation(); // Prevents unselecting of the element

    setIsDragging(true);

    const svgCoords = getSVGElementCoordinates(e);

    if (!svgCoords) return;

    // Calculate offset from mouse to element origin
    const offsetX = svgCoords.x - selectedElement.x;
    const offsetY = svgCoords.y - selectedElement.y;

    setDraggingStartPoint({ x: offsetX, y: offsetY });
  };

  const handleDragMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!isDragging || !selectedElement || !draggingStartPoint) return;

    const svgCoords = getSVGCoordinates(e);
    const newX = svgCoords.x - draggingStartPoint.x;
    const newY = svgCoords.y - draggingStartPoint.y;

    dispatch(updateElement({ ...selectedElement, x: newX, y: newY }));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggingStartPoint(undefined);
  };

  const getCursor = () => {
    if (selectedToolID === "pan") return "cursor-grab";
    if (selectedToolID === "select") return "cursor-default";
    return "cursor-crosshair";
  };

  return (
    <svg
      className={cn("fixed inset-0 bg-white", getCursor())}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheelZoom}
    >
      {sortedElements.map((element) => (
        <Element
          key={element.ID}
          element={element}
          className={cn(
            "canvas-element",
            !selectedToolID || selectedToolID === "select" ? "cursor-move" : ""
          )}
          handleSelectElement={handleSelectElement}
          handleDragElement={handleDragStart}
          updateElement={(element) => dispatch(updateElement(element))}
        />
      ))}
      {isDrawing && currentElement && <Element element={currentElement} />}
      {selectedElement && (
        <>
          {/* Resize Box */}
          <rect
            x={selectedElement.x - 10}
            y={selectedElement.y - 10}
            width={selectedElement.width + 20}
            height={selectedElement.height + 20}
            fill="none"
            stroke="blue"
            strokeWidth={1}
            strokeDasharray="4"
          />

          {/* Resize Handles (Corners) */}
          {RESIZE_HANDLE_POSITIONS.map((pos) => {
            const [cx, cy] = getHandlePosition(selectedElement, pos);
            return (
              <circle
                key={pos}
                cx={cx}
                cy={cy}
                r={10}
                fill="#FFFFFF"
                stroke="blue"
                strokeWidth={1}
                onMouseDown={(e) => handleResizeStart(e, pos)}
                className={
                  ["top-right", "bottom-left"].includes(pos)
                    ? "cursor-nesw-resize"
                    : "cursor-nwse-resize"
                }
              />
            );
          })}
        </>
      )}
    </svg>
  );
};

export default Canvas;
