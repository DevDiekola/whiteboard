import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useDispatch } from "react-redux";
import {
  updateElement,
  updateElementLayer,
} from "@/features/canvas/canvasSlice";
import {
  CanvasElementKeys,
  LayerDirection,
} from "@/features/canvas/canvasModel";
import {
  ArrowDownIcon,
  ArrowDownToLineIcon,
  ArrowUpIcon,
  ArrowUpToLineIcon,
  BanIcon,
  BoldIcon,
  SlashIcon,
} from "lucide-react";
import IconButton from "./components/icon-button/IconButton";
import ColorPalette from "./components/color-palette/ColorPalette";
import { FILL_COLORS, STROKE_COLORS } from "@/constants/canvas";

const PropertiesBar = () => {
  const { selectedElement } = useAppSelector(
    (state) => state.canvasState.present
  );
  const dispatch = useDispatch();

  if (!selectedElement) {
    return (
      <div className="w-64 p-4 bg-white shadow-md border-l flex flex-col items-center">
        <p className="text-sm text-gray-500">No element selected</p>
      </div>
    );
  }

  const handleChange = (
    field: CanvasElementKeys,
    value: unknown // This is very flimsy but it works for now
  ) => {
    dispatch(updateElement({ ...selectedElement, [field]: value }));
  };

  const handleUpdateLayer = (ID: string, direction: LayerDirection) => {
    dispatch(updateElementLayer({ ID, direction }));
  };

  return (
    <div className="fixed top-0 bottom-0 right-0 w-64 h-[100dvh] p-4 bg-white border-l flex flex-col space-y-4 overflow-y-auto">
      <h3 className="text-lg font-semibold">Properties</h3>

      {/* General CanvasBaseElement Properties */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Position</label>
        <div className="flex space-x-2">
          <Input
            type="number"
            value={selectedElement.x}
            onChange={(e) => handleChange("x", Number(e.target.value))}
          />
          <Input
            type="number"
            value={selectedElement.y}
            onChange={(e) => handleChange("y", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Size</label>
        <div className="flex space-x-2">
          <Input
            type="number"
            value={selectedElement.width}
            onChange={(e) => handleChange("width", Number(e.target.value))}
          />
          <Input
            type="number"
            value={selectedElement.height}
            onChange={(e) => handleChange("height", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Opacity</label>
        <Slider
          value={[selectedElement.opacity]}
          max={1}
          step={0.1}
          onValueChange={(val) => handleChange("opacity", val[0])}
        />
      </div>

      {/* Commenting this out for now until I figure out how to handle it properly - aligning the positions, resize box e.t.c */}
      {/* <div className="space-y-2">
        <label className="block text-sm font-medium">Angle</label>
        <Slider
          value={[selectedElement.angle ?? 0]}
          max={360}
          step={1}
          onValueChange={(val) => handleChange("angle", val[0])}
        />
      </div> */}

      <div className="space-y-2">
        <label className="block text-sm font-medium">Layer</label>
        <div className="flex gap-3">
          <IconButton
            onClick={() => handleUpdateLayer(selectedElement.ID, "bottom")}
          >
            <ArrowDownToLineIcon />
          </IconButton>
          <IconButton
            onClick={() => handleUpdateLayer(selectedElement.ID, "down")}
          >
            <ArrowDownIcon />
          </IconButton>
          <IconButton
            onClick={() => handleUpdateLayer(selectedElement.ID, "up")}
          >
            <ArrowUpIcon />
          </IconButton>
          <IconButton
            onClick={() => handleUpdateLayer(selectedElement.ID, "top")}
          >
            <ArrowUpToLineIcon />
          </IconButton>
        </div>
      </div>

      {/* Shape-Specific Properties */}
      {selectedElement.type === "text" && (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Text</label>
            <Input
              value={selectedElement.text || "YOOO"}
              onChange={(e) => handleChange("text", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Font Size</label>
            <Input
              type="number"
              value={selectedElement.fontSize}
              onChange={(e) => handleChange("fontSize", Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Font Weight</label>
            <div className="flex gap-3">
              <IconButton
                isActive={selectedElement.fontWeight === 400}
                onClick={() => handleChange("fontWeight", 400)}
              >
                <BoldIcon strokeWidth={1} />
              </IconButton>
              <IconButton
                isActive={selectedElement.fontWeight === 600}
                onClick={() => handleChange("fontWeight", 600)}
              >
                <BoldIcon strokeWidth={2} />
              </IconButton>
              <IconButton
                isActive={selectedElement.fontWeight === 800}
                onClick={() => handleChange("fontWeight", 800)}
              >
                <BoldIcon strokeWidth={3} />
              </IconButton>
              <IconButton
                isActive={selectedElement.fontWeight === 900}
                onClick={() => handleChange("fontWeight", 900)}
              >
                <BoldIcon strokeWidth={4} />
              </IconButton>
            </div>
          </div>
        </>
      )}

      {(selectedElement.type === "rectangle" ||
        selectedElement.type === "circle" ||
        selectedElement.type === "rhombus") && (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Fill Color</label>
            <ColorPalette
              colors={FILL_COLORS}
              selectedColor={selectedElement.fill || "transparent"}
              setSelectedColor={(color) => handleChange("fill", color)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Stroke Color</label>
            <ColorPalette
              colors={STROKE_COLORS}
              selectedColor={selectedElement.strokeColor || "transparent"}
              setSelectedColor={(color) => handleChange("strokeColor", color)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Stroke Width</label>
            <div className="flex gap-3">
              <IconButton
                isActive={selectedElement.strokeWidth === 0}
                onClick={() => handleChange("strokeWidth", 0)}
              >
                <BanIcon />
              </IconButton>
              <IconButton
                isActive={selectedElement.strokeWidth === 2}
                onClick={() => handleChange("strokeWidth", 2)}
              >
                <SlashIcon strokeWidth={1} />
              </IconButton>
              <IconButton
                isActive={selectedElement.strokeWidth === 4}
                onClick={() => handleChange("strokeWidth", 4)}
              >
                <SlashIcon strokeWidth={2} />
              </IconButton>
              <IconButton
                isActive={selectedElement.strokeWidth === 6}
                onClick={() => handleChange("strokeWidth", 6)}
              >
                <SlashIcon strokeWidth={3} />
              </IconButton>
              <IconButton
                isActive={selectedElement.strokeWidth === 8}
                onClick={() => handleChange("strokeWidth", 8)}
              >
                <SlashIcon strokeWidth={4} />
              </IconButton>
            </div>
          </div>
        </>
      )}

      {(selectedElement.type === "rectangle" ||
        selectedElement.type === "rhombus") && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Border Radius</label>
          <Slider
            value={[selectedElement.borderRadius ?? 0]}
            max={200}
            step={1}
            onValueChange={(val) => handleChange("borderRadius", val[0])}
          />
        </div>
      )}
    </div>
  );
};

export default PropertiesBar;
