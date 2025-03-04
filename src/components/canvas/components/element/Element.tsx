import { CanvasElement } from "@/features/canvas/canvasModel";

type Props = {
  element: CanvasElement;
  className?: string;
  handleSelectElement?: (element: CanvasElement) => void;
  handleDragElement?: (
    e: React.MouseEvent<SVGGraphicsElement, MouseEvent>
  ) => void;
  updateElement?: (element: CanvasElement) => void;
};

const Element: React.FC<Props> = ({
  element,
  className,
  handleDragElement,
  handleSelectElement,
  updateElement,
}) => {
  if (element.type === "rectangle") {
    return (
      <rect
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        fill={element.fill}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
        opacity={element.opacity}
        transform={`rotate(${element.angle || 0}, ${
          element.x + element.width / 2
        }, ${element.y + element.height / 2})`}
        rx={element.borderRadius}
        z={element.layer}
        className={className}
        onClick={() => handleSelectElement?.(element)}
        onMouseDown={(e) => handleDragElement?.(e)}
      />
    );
  }
  if (element.type === "circle") {
    const radius = Math.max(element.width, element.height) / 2;
    return (
      <circle
        cx={element.x + element.width / 2}
        cy={element.y + element.height / 2}
        r={radius}
        fill={element.fill}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
        opacity={element.opacity}
        transform={`rotate(${element.angle || 0}, ${
          element.x + element.width / 2
        }, ${element.y + element.height / 2})`}
        z={element.layer}
        className={className}
        onClick={() => handleSelectElement?.(element)}
        onMouseDown={(e) => handleDragElement?.(e)}
      />
    );
  }

  if (element.type === "rhombus") {
    const cx = element.x + element.width / 2;
    const cy = element.y + element.height / 2;

    const points = [
      `${cx},${element.y}`,
      `${element.x + element.width},${cy}`,
      `${cx},${element.y + element.height}`,
      `${element.x},${cy}`,
    ].join(" ");

    return (
      <polygon
        points={points}
        fill={element.fill}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
        opacity={element.opacity}
        transform={`rotate(${element.angle || 0}, ${
          element.x + element.width / 2
        }, ${element.y + element.height / 2})`}
        rx={element.borderRadius}
        z={element.layer}
        className={className}
        onClick={() => handleSelectElement?.(element)}
        onMouseDown={(e) => handleDragElement?.(e)}
      />
    );
  }

  if (element.type === "line") {
    return (
      <line
        x1={element.x}
        y1={element.y}
        x2={element.x + element.width}
        y2={element.y + element.height}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
        opacity={element.opacity}
        transform={`rotate(${element.angle || 0}, ${
          element.x + element.width / 2
        }, ${element.y + element.height / 2})`}
        z={element.layer}
        className={className}
        onClick={() => handleSelectElement?.(element)}
        onMouseDown={(e) => handleDragElement?.(e)}
      />
    );
  }

  if (element.type === "arrow") {
    // Calculate arrowhead
    const x1 = element.x;
    const y1 = element.y;
    const x2 = element.x + element.width;
    const y2 = element.y + element.height;

    // Get angle for arrowhead
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowSize = 15 * Math.sqrt(element.strokeWidth); // Arrowhead size

    // Calculate arrowhead points
    const arrowX1 = x2 - arrowSize * Math.cos(angle - Math.PI / 6);
    const arrowY1 = y2 - arrowSize * Math.sin(angle - Math.PI / 6);

    const arrowX2 = x2 - arrowSize * Math.cos(angle + Math.PI / 6);
    const arrowY2 = y2 - arrowSize * Math.sin(angle + Math.PI / 6);

    return (
      <g
        transform={`rotate(${element.angle || 0}, ${
          element.x + element.width / 2
        }, ${element.y + element.height / 2})`}
        opacity={element.opacity}
        className={className}
        onClick={() => handleSelectElement?.(element)}
        onMouseDown={(e) => handleDragElement?.(e)}
      >
        {/* Line */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={element.strokeColor}
          strokeWidth={element.strokeWidth}
          z={element.layer}
        />
        {/* Arrowhead */}
        <polygon
          points={`${x2},${y2} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
          fill={element.strokeColor} // setting this to stroke color intentionally since the arrow type does not have a stroke color
        />
      </g>
    );
  }

  if (element.type === "pencil") {
    const pointsString = element.points?.map((p) => `${p.x},${p.y}`).join(" ");

    return (
      <polyline
        points={pointsString}
        fill="none"
        stroke={element.strokeColor}
        strokeWidth={element.strokeColor}
        transform={`rotate(${element.angle || 0}, ${
          element.x + element.width / 2
        }, ${element.y + element.height / 2})`}
        opacity={element.opacity}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        onClick={() => handleSelectElement?.(element)}
        onMouseDown={(e) => handleDragElement?.(e)}
      />
    );
  }

  if (element.type === "text") {
    return (
      <foreignObject
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        opacity={element.opacity}
        z={element.layer}
        className={className}
        onClick={() => handleSelectElement?.(element)}
        onMouseDown={(e) => handleDragElement?.(e)}
      >
        <textarea
          contentEditable
          onChange={(e) =>
            updateElement?.({
              ...element,
              text: e.target.value || "",
            })
          }
          style={{
            fontSize: `${element.fontSize}px`,
            fontWeight: element.fontWeight,
            fontFamily: element.fontFamily,
            width: `${element.width}px`,
            minHeight: `${element.height}px`,
            color: element.strokeColor,
            textAlign: element.textAlign,
            lineHeight: element.lineHeight,
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            outline: "none",
            resize: "none",
            overflow: "hidden",
          }}
        >
          {element.text}
        </textarea>
      </foreignObject>
    );
  }

  return <></>;
};

export default Element;
