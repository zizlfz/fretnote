import FretNote from './FretNote';
import { NOTES, STRING_MIDI } from '../utils/theory';
import './StringRow.css';

const NUM_FRETS = 22;

export default function StringRow({ stringIndex, stringName, scaleNotes, root, highlightedNotes }) {
  const cells = [];
  const hasChordSelected = !!highlightedNotes;
  const triads = highlightedNotes?.triads ?? [];
  const extensions = highlightedNotes?.extensions ?? [];

  for (let fret = 0; fret <= NUM_FRETS; fret++) {
    const noteIdx = (STRING_MIDI[stringIndex] + fret) % 12;
    const noteName = NOTES[noteIdx];
    const inScale = scaleNotes.includes(noteIdx);
    const isRoot = noteIdx === root;
    const isNut = fret === 0;
    const inChord = triads.includes(noteName);
    const isExtension = extensions.includes(noteName);

    cells.push(
      <div
        key={fret}
        className={`fret-cell${isNut ? ' fret-cell--nut' : ''}`}
      >
        {!isNut && <div className="string-line" />}
        <FretNote
          note={noteName}
          isRoot={isRoot}
          inScale={inScale}
          inChord={inChord}
          isExtension={isExtension}
          hasChordSelected={hasChordSelected}
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
