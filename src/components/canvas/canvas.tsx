import {
  CanvasBaseElement,
  CanvasElement,
  CanvasElementType,
  CanvasPencil,
} from "@/features/canvas/canvasModel";
import { addElement, setSelectedElement } from "@/features/canvas/canvasSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import useScreenSize from "@/hooks/useScreenSize";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Element from "./components/element/Element";

const Canvas = () => {
  const dispatch = useDispatch();
  const { elements, selectedToolID, zoomPercentage } = useAppSelector(
    (state) => state.canvasState.present
  );
  const { width: screenWidth, height: screenHeight } = useScreenSize();

  // Make the canvas initial viewbox twice the size of the screen
  const [viewBox, setViewBox] = useState({
    x: -screenWidth / 2,
    y: -screenHeight / 2,
    width: screenWidth * 2,
    height: screenHeight * 2,
  });

  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);

  const [currentElement, setCurrentElement] = useState<CanvasElement>();
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

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

  const getSVGCoordinates = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    return point.matrixTransform(svg.getScreenCTM()?.inverse());
  };

  const handlePanStart = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsPanning(true);
    setStartPan({ x: e.clientX, y: e.clientY });
  };

  const handlePanMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isPanning) return;
    const dx = e.clientX - startPan.x;
    const dy = e.clientY - startPan.y;
    setViewBox((prev) => ({
      ...prev,
      x: prev.x - dx,
      y: prev.y - dy,
    }));
    setStartPan({ x: e.clientX, y: e.clientY });
  };

  const handlePanEnd = () => setIsPanning(false);

  const handleDrawStart = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgCoords = getSVGCoordinates(e);

    setStartPoint({ x: svgCoords.x, y: svgCoords.y });

    const newBaseElement: CanvasBaseElement = {
      ID: crypto.randomUUID(),
      type: selectedToolID as CanvasElementType,
      x: svgCoords.x,
      y: svgCoords.y,
      width: 0,
      height: 0,
      zIndex: 1,
      createdAt: Date.now(),
    };

    if (selectedToolID === "pencil") {
      const newElement: CanvasPencil = {
        ...newBaseElement,
        type: "pencil",
        points: [{ x: svgCoords.x, y: svgCoords.y }],
      };

      setCurrentElement(newElement);
    }

    setCurrentElement(newBaseElement as CanvasElement);

    setIsDrawing(true);
  };

  const handleDrawMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing || !currentElement) return;
    const svgCoords = getSVGCoordinates(e);

    setCurrentElement((prev) => {
      if (!prev) return undefined;

      const { x: startX, y: startY } = startPoint;
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
          points: [...(prev.points || []), { x: currentX, y: currentY }],
        };
      }

      return newElement;
    });
  };

  const handleDrawEnd = () => {
    if (currentElement) dispatch(addElement(currentElement));
    setIsDrawing(false);
    setCurrentElement(undefined);
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    switch (selectedToolID) {
      case "pan":
        return handlePanStart(e);
      default:
        handleDrawStart(e);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) return handlePanMove(e);
    handleDrawMove(e);
  };

  const handleMouseUp = () => {
    if (isPanning) return handlePanEnd();
    handleDrawEnd();
  };

  const handleSelectElement = (element: CanvasElement) => {
    dispatch(setSelectedElement(element));
  };

  return (
    <svg
      className={cn(
        "absolute inset-0 bg-white",
        selectedToolID === "pan" ? "cursor-grab" : "cursor-crosshair"
      )}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {elements.map((element) => (
        <Element
          key={element.ID}
          element={element}
          handleSelectElement={handleSelectElement}
        />
      ))}
      {isDrawing && currentElement && <Element element={currentElement} />}
    </svg>
  );
};

export default Canvas;
