import './FretNote.css';

export default function FretNote({ note, isRoot, inScale, inChord, hasChordSelected, size = 'md' }) {
  let stateClass;
  if (inChord) {
    stateClass = isRoot ? 'fret-note--chord-root' : 'fret-note--chord';
  } else if (hasChordSelected) {
    stateClass = inScale ? 'fret-note--dimmed' : 'fret-note--empty';
  } else {
    stateClass = isRoot ? 'fret-note--root' : inScale ? 'fret-note--scale' : 'fret-note--empty';
  }

  const cls = ['fret-note', `fret-note--${size}`, stateClass].join(' ');

  return (
    <div className={cls}>
      {inScale ? note : ''}
    </div>
  );
}
