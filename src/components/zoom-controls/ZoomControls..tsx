import { setZoomPercentage } from "@/features/canvas/canvasSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useDispatch } from "react-redux";

const ZoomControls = () => {
  const dispatch = useDispatch();
  const { zoomPercentage } = useAppSelector(
    (state) => state.canvasState.present
  );

  const handleZoomIn = () =>
    dispatch(setZoomPercentage(Math.min(zoomPercentage + 10, 500)));
  const handleZoomOut = () =>
    dispatch(setZoomPercentage(Math.max(zoomPercentage - 10, 10)));

  return (
    <div className="fixed bottom-4 left-4 flex items-center gap-2 bg-gray-200 shadow-lg rounded-md">
      <button onClick={handleZoomOut} className="p-3 rounded-md cursor-pointer">
        <MinusIcon size={20} />
      </button>
      <span className="w-12 text-center font-medium">{zoomPercentage}%</span>
      <button onClick={handleZoomIn} className="p-3 rounded-md cursor-pointer">
        <PlusIcon size={20} />
      </button>
    </div>
  );
};

export default ZoomControls;
