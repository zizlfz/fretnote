import { useState } from 'react';
import RootSelector from './components/RootSelector';
import Fretboard from './components/Fretboard';
import ChordGrid from './components/ChordGrid';
import { NOTES, getChordType, CHORD_MODIFIERS, resolveChordNotes } from './utils/theory';
import './App.css';

export default function App() {
  const [root, setRoot] = useState(0);
  const [mode, setMode] = useState('major');
  const [selectedChord, setSelectedChord] = useState(null);
  const [selectedModifier, setSelectedModifier] = useState(null);

  function handleRootChange(newRoot) {
    setRoot(newRoot);
    setSelectedChord(null);
    setSelectedModifier(null);
  }

  function handleModeChange(newMode) {
    setMode(newMode);
    setSelectedChord(null);
    setSelectedModifier(null);
  }

  function handleChordSelect(chord) {
    setSelectedChord(prev => prev && prev.name === chord.name ? null : chord);
    setSelectedModifier(null);
  }

  function handleModifierSelect(modifier) {
    setSelectedModifier(prev => prev && prev.id === modifier.id ? null : modifier);
  }

  // Derive highlighted notes from selected chord + modifier
  let highlightedNotes = null;
  if (selectedChord) {
    if (selectedModifier) {
      const chordRootIndex = NOTES.indexOf(selectedChord.notes[0]);
      const { triads, extensions } = resolveChordNotes(chordRootIndex, selectedModifier.intervals);
      highlightedNotes = { triads, extensions };
    } else {
      highlightedNotes = { triads: selectedChord.notes, extensions: [] };
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Fretboard Explorer</h1>
      </header>
      <main className="app-main">
        <RootSelector root={root} onChange={handleRootChange} mode={mode} onModeChange={handleModeChange} />
        <Fretboard root={root} mode={mode} highlightedNotes={highlightedNotes} />
        <ChordGrid
          root={root}
          mode={mode}
          selectedChord={selectedChord}
          highlightedNotes={highlightedNotes}
          selectedModifier={selectedModifier}
          onChordSelect={handleChordSelect}
          onModifierSelect={handleModifierSelect}
        />
      </main>
    </div>
  );
}
