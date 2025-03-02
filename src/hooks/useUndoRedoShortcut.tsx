import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { REDO_CANVAS_ACTION, UNDO_CANVAS_ACTION } from "@/constants/canvas";

const useUndoRedoShortcut = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isUndo =
        (e.ctrlKey && e.key.toLowerCase() === "z") ||
        (e.metaKey && !e.shiftKey && e.key.toLowerCase() === "z");

      const isRedo =
        (e.ctrlKey && e.key.toLowerCase() === "y") ||
        (e.metaKey && e.shiftKey && e.key.toLowerCase() === "z");

      if (isUndo) {
        e.preventDefault();

        dispatch(UNDO_CANVAS_ACTION);
      } else if (isRedo) {
        e.preventDefault();

        dispatch(REDO_CANVAS_ACTION);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);
};

export default useUndoRedoShortcut;
