import { NOTES, getScaleNotes } from '../utils/theory';
import './ScaleNotes.css';

export default function ScaleNotes({ root, mode, selectedChord }) {
  const scaleNotes = getScaleNotes(root, mode);

  return (
    <div className="scale-notes">
      {scaleNotes.map((noteIdx, i) => {
        const noteName = NOTES[noteIdx];
        const isRoot = noteIdx === root;
        const inChord = selectedChord ? selectedChord.notes.includes(noteName) : false;
        const dimmed = selectedChord && !inChord;

        return (
          <div
            key={i}
            className={[
              'scale-note-circle',
              isRoot ? 'scale-note-circle--root' : '',
              inChord ? 'scale-note-circle--chord' : '',
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
