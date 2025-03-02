import Canvas from "./components/canvas/Canvas";
import Toolbar from "./components/toolbar/Toolbar";
import ZoomControls from "./components/zoom-controls/ZoomControls.";
import useUndoRedoShortcut from "./hooks/useUndoRedoShortcut";

const App = () => {
  // Enables canvas undo/redo using keyboard shortcuts
  useUndoRedoShortcut();

  return (
    <div className="w-screen h-screen relative bg-gray-50">
      <Canvas />
      <Toolbar />
      <ZoomControls />
    </div>
  );
};

export default App;
