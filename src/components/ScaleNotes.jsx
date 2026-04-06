import { NOTES, getScaleNotes } from '../utils/theory';
import './ScaleNotes.css';

export default function ScaleNotes({ root, mode, highlightedNotes }) {
  const scaleNotes = getScaleNotes(root, mode);
  const triads = highlightedNotes?.triads ?? [];
  const extensions = highlightedNotes?.extensions ?? [];
  const hasSelection = !!highlightedNotes;

  return (
    <div className="scale-notes">
      {scaleNotes.map((noteIdx, i) => {
        const noteName = NOTES[noteIdx];
        const isRoot = noteIdx === root;
        const inChord = triads.includes(noteName);
        const isExtension = extensions.includes(noteName);
        const dimmed = hasSelection && !inChord && !isExtension;

        return (
          <div
            key={i}
            className={[
              'scale-note-circle',
              isRoot && !inChord && !isExtension ? 'scale-note-circle--root' : '',
              inChord ? (isRoot ? 'scale-note-circle--root scale-note-circle--chord' : 'scale-note-circle--chord') : '',
              isExtension ? 'scale-note-circle--extension' : '',
              dimmed ? 'scale-note-circle--dimmed' : '',
            ].filter(Boolean).join(' ')}
            title={noteName}
          >
            {noteName}
          </div>
        );
      })}
    </div>
  );
}
