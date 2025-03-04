import React from "react";
import { Button } from "@/components/ui/button";
import { Palette, BanIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  colors: ReadonlyArray<string>;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
};

const ColorPalette: React.FC<Props> = ({
  colors,
  selectedColor,
  setSelectedColor,
}) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
  };

  return (
    <div className="grid grid-cols-6 gap-2 p-2 max-w-xs">
      {colors.map((color) => (
        <Button
          key={color}
          className={cn(
            "w-8 h-8 p-0 border-1",
            selectedColor === color && "border-2"
          )}
          style={{
            backgroundColor: color === "transparent" ? "#FFFFFF" : color,
            borderColor: [selectedColor, "transparent", "#FFFFFF"].includes(
              color
            )
              ? "#000000"
              : "transparent",
            position: "relative",
          }}
          onClick={() => setSelectedColor(color)}
        >
          {color === "transparent" && (
            <BanIcon className="text-black absolute inset-0 m-auto" size={16} />
          )}
        </Button>
      ))}

      <div className="relative">
        <input
          type="color"
          value={selectedColor}
          onChange={handleColorChange}
          className="absolute inset-0 w-0 h-0 opacity-0"
          id="color-picker"
        />
        <Button
          className="w-8 h-8 p-0 flex items-center justify-center"
          onClick={() => document.getElementById("color-picker")?.click()}
        >
          <Palette size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ColorPalette;
