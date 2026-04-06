import { POSITION_MARKERS } from '../utils/theory';
import './FretboardHeader.css';

const NUM_FRETS = 22;

export default function FretboardHeader() {
  return (
    <div className="fretboard-header">
      <div className="fretboard-header__spacer" />
      <div className="fretboard-header__nut" />
      {Array.from({ length: NUM_FRETS }, (_, i) => i + 1).map(fret => (
        <div
          key={fret}
          className={`fretboard-header__fret${POSITION_MARKERS.includes(fret) ? ' fretboard-header__fret--marker' : ''}`}
        >
          {POSITION_MARKERS.includes(fret) ? fret : ''}
        </div>
      ))}
    </div>
  );
}
