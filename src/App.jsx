import { useState } from "react";
import RootSelector from "./components/RootSelector";
import Fretboard from "./components/Fretboard";
import ChordGrid from "./components/ChordGrid";
import "./App.css";

export default function App() {
  const [root, setRoot] = useState(0);
  const [mode, setMode] = useState("major");
  const [selectedChord, setSelectedChord] = useState(null);

  function handleRootChange(newRoot) {
    setRoot(newRoot);
    setSelectedChord(null);
  }

  function handleModeChange(newMode) {
    setMode(newMode);
    setSelectedChord(null);
  }

  function handleChordSelect(chord) {
    setSelectedChord((prev) =>
      prev && prev.name === chord.name ? null : chord,
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">fretnote</h1>
      </header>
      <main className="app-main">
        <RootSelector
          root={root}
          onChange={handleRootChange}
          mode={mode}
          onModeChange={handleModeChange}
        />
        <Fretboard root={root} mode={mode} selectedChord={selectedChord} />
        <ChordGrid
          root={root}
          mode={mode}
          selectedChord={selectedChord}
          onChordSelect={handleChordSelect}
        />
      </main>
    </div>
  );
}
