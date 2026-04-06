import FretNote from './FretNote';
import { NOTES, STRING_MIDI, POSITION_MARKERS } from '../utils/theory';
import './StringRow.css';

const NUM_FRETS = 22;

export default function StringRow({ stringIndex, stringName, scaleNotes, root, selectedChord }) {
  const cells = [];

  for (let fret = 0; fret <= NUM_FRETS; fret++) {
    const noteIdx = (STRING_MIDI[stringIndex] + fret) % 12;
    const inScale = scaleNotes.includes(noteIdx);
    const isRoot = noteIdx === root;
    const isNut = fret === 0;
    const inChord = selectedChord ? selectedChord.notes.includes(NOTES[noteIdx]) : false;

    cells.push(
      <div
        key={fret}
        className={`fret-cell${isNut ? ' fret-cell--nut' : ''}`}
      >
        {!isNut && <div className="string-line" />}
        <FretNote
          note={NOTES[noteIdx]}
          isRoot={isRoot}
          inScale={inScale}
          inChord={inChord}
          hasChordSelected={!!selectedChord}
          size={isNut ? 'sm' : 'md'}
        />
      </div>
    );
  }

  return (
    <div className="string-row">
      <div className="string-label">{stringName}</div>
      {cells}
    </div>
  );
}
