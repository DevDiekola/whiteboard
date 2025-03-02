import { CanvasElement } from "@/features/canvas/canvasModel";
import { updateElement } from "@/features/canvas/canvasSlice";

type Props = {
  element: CanvasElement;
  handleSelectElement?: (element: CanvasElement) => void;
  updateElement?: (element: CanvasElement) => void;
};

const Element: React.FC<Props> = ({ element, handleSelectElement }) => {
  if (element.type === "rectangle") {
    return (
      <rect
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        stroke="black"
        fill="transparent"
        strokeWidth={2}
        onClick={() => handleSelectElement?.(element)}
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
        stroke="black"
        fill="transparent"
        strokeWidth={2}
        onClick={() => handleSelectElement?.(element)}
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
        stroke="black"
        fill="transparent"
        strokeWidth={2}
        onClick={() => handleSelectElement?.(element)}
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
        stroke="black"
        strokeWidth={2}
        onClick={() => handleSelectElement?.(element)}
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
    const arrowSize = 15; // Arrowhead size

    // Calculate arrowhead points
    const arrowX1 = x2 - arrowSize * Math.cos(angle - Math.PI / 6);
    const arrowY1 = y2 - arrowSize * Math.sin(angle - Math.PI / 6);

    const arrowX2 = x2 - arrowSize * Math.cos(angle + Math.PI / 6);
    const arrowY2 = y2 - arrowSize * Math.sin(angle + Math.PI / 6);

    return (
      <>
        {/* Line */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="black"
          strokeWidth={2}
          onClick={() => handleSelectElement?.(element)}
        />
        {/* Arrowhead */}
        <polygon
          points={`${x2},${y2} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
          fill="black"
        />
      </>
    );
  }

  if (element.type === "pencil") {
    const pointsString = element.points?.map((p) => `${p.x},${p.y}`).join(" ");

    return (
      <polyline
        points={pointsString}
        stroke="black"
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
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
      >
        <textarea
          value={element.text}
          onChange={(e) => updateElement({ ...element, text: e.target.value })}
          style={{
            fontSize: "25px",
            fontFamily: "Arial",
            width: `${element.width}px`,
            height: `${element.height}px`,
            border: "1px solid black",
            outline: "none",
          }}
        />
      </foreignObject>
    );
  }

  return <></>;
};

export default Element;
