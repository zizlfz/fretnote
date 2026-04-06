import { getChordType, CHORD_MODIFIERS } from '../utils/theory';
import './ChordModifier.css';

export default function ChordModifier({ chord, selectedModifier, onSelect }) {
  if (!chord) return null;

  const chordType = getChordType(chord.suffix);
  const modifiers = CHORD_MODIFIERS[chordType] ?? [];

  return (
    <div className="chord-modifier">
      <span className="chord-modifier__label">{chord.name}</span>
      <div className="chord-modifier__pills">
        {modifiers.map(mod => (
          <button
            key={mod.id}
            className={`modifier-pill${selectedModifier && selectedModifier.id === mod.id ? ' modifier-pill--active' : ''}`}
            onClick={() => onSelect(mod)}
          >
            {mod.label}
          </button>
        ))}
      </div>
    </div>
  );
}
