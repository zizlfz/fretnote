import FretboardHeader from './FretboardHeader';
import StringRow from './StringRow';
import ScaleNotes from './ScaleNotes';
import { STRINGS, NOTES, getScaleNotes } from '../utils/theory';
import './Fretboard.css';

export default function Fretboard({ root, mode, highlightedNotes }) {
  const scaleNotes = getScaleNotes(root, mode);
  const modeLabel = mode === 'minor' ? 'natural minor' : 'major';

  return (
    <div className="fretboard-section">
      <div className="section-label-row">
        <p className="section-label">
          Fretboard — <span className="section-label__sub">{NOTES[root]} {modeLabel} scale</span>
        </p>
        <ScaleNotes root={root} mode={mode} highlightedNotes={highlightedNotes} playMode="single" />
      </div>
      <div className="fretboard-scroll">
        <div className="fretboard">
          <FretboardHeader />
          {STRINGS.map((name, i) => (
            <StringRow
              key={i}
              stringIndex={i}
              stringName={name}
              scaleNotes={scaleNotes}
              root={root}
              highlightedNotes={highlightedNotes}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
