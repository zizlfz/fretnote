import './FretNote.css';

export default function FretNote({ note, isRoot, inScale, inChord, isExtension, hasChordSelected, size = 'md' }) {
  let stateClass;
  if (isExtension) {
    stateClass = 'fret-note--extension';
  } else if (inChord) {
    stateClass = isRoot ? 'fret-note--chord-root' : 'fret-note--chord';
  } else if (hasChordSelected) {
    stateClass = inScale ? 'fret-note--dimmed' : 'fret-note--empty';
  } else {
    stateClass = isRoot ? 'fret-note--root' : inScale ? 'fret-note--scale' : 'fret-note--empty';
  }

  const cls = ['fret-note', `fret-note--${size}`, stateClass].join(' ');
  const showLabel = inChord || isExtension || (!hasChordSelected && inScale);

  return (
    <div className={cls}>
      {showLabel ? note : ''}
    </div>
  );
}
