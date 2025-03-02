import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TOOLBAR_TOOLS } from "@/constants/canvas";
import { CanvasToolID } from "@/features/canvas/canvasModel";
import { selectTool } from "@/features/canvas/canvasSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";

const Toolbar = () => {
  const { selectedToolID } = useAppSelector(
    (state) => state.canvasState.present
  );
  const dispatch = useDispatch();

  const handleSelectTool = (toolID: CanvasToolID) => {
    dispatch(selectTool(toolID));
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-white shadow-md rounded-md z-10">
      {TOOLBAR_TOOLS.map((tool) => (
        <TooltipProvider key={tool.ID}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "p-2 cursor-pointer",
                  selectedToolID === tool.ID
                    ? "bg-purple-100"
                    : "hover:bg-gray-100"
                )}
                onClick={() => handleSelectTool(tool.ID)}
              >
                <tool.icon size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {tool.label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default Toolbar;
