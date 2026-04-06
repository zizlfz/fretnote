import ChordCard from "./ChordCard";
import ScaleNotes from "./ScaleNotes";
import { getChordsInKey } from "../utils/theory";
import "./ChordGrid.css";

export default function ChordGrid({
  root,
  mode,
  selectedChord,
  onChordSelect,
}) {
  const chords = getChordsInKey(root, mode);

  return (
    <div className="chord-grid-section">
      <div className="section-label-row">
        <p className="section-label">Chords in key</p>
      </div>
      <div className="chord-grid">
        {chords.map((chord, i) => (
          <ChordCard
            key={i}
            chord={chord}
            isSelected={selectedChord && selectedChord.name === chord.name}
            onSelect={() => onChordSelect(chord)}
          />
        ))}
      </div>
    </div>
  );
}
