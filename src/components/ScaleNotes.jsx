import { useState, useRef } from 'react';
import { NOTES, getScaleNotes } from '../utils/theory';
import { audioService } from '../utils/NoteAudioService';
import './ScaleNotes.css';

const SINGLE_INTERVAL_MS = 500;
const STRUM_INTERVAL_S  = 0.005;
const BASE_OCTAVE = 4;

// Assign ascending octaves to a sequence of chromatic note indices.
// Whenever the next index is <= the previous, we've wrapped and need to bump the octave.
function assignOctaves(noteIndices, startOctave = BASE_OCTAVE) {
  let octave = startOctave;
  return noteIndices.map((idx, i) => {
    if (i > 0 && idx <= noteIndices[i - 1]) octave++;
    return { idx, octave };
  });
}

export default function ScaleNotes({ root, mode, highlightedNotes, playMode = 'single' }) {
  const scaleNotes = getScaleNotes(root, mode);
  const triads     = highlightedNotes?.triads     ?? [];
  const extensions = highlightedNotes?.extensions ?? [];
  const hasSelection = !!highlightedNotes;

  const [playingIndex, setPlayingIndex] = useState(null);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const timeoutsRef = useRef([]);

  // Returns { name: string, octave: number }[] in ascending pitch order.
  function getActiveNotes() {
    if (hasSelection) {
      const allChordNotes = [...triads, ...extensions];

      // Scale-order indices for notes that belong to the chord
      const inScaleIndices = scaleNotes.filter(idx => allChordNotes.includes(NOTES[idx]));

      // Out-of-scale extensions (e.g. 9th): find their chromatic index and
      // append after the last in-scale note so octave logic continues upward.
      const inScaleNames = inScaleIndices.map(idx => NOTES[idx]);
      const outOfScaleNames = extensions.filter(n => !inScaleNames.includes(n));

      const lastInScaleIdx = inScaleIndices[inScaleIndices.length - 1] ?? 0;
      const outOfScaleIndices = outOfScaleNames.map(name => {
        const idx = NOTES.indexOf(name);
        return idx;
      });

      const allIndices = [...inScaleIndices, ...outOfScaleIndices];
      return assignOctaves(allIndices).map(({ idx, octave }) => ({
        name: NOTES[idx],
        octave,
      }));
    }

    return assignOctaves(scaleNotes).map(({ idx, octave }) => ({
      name: NOTES[idx],
      octave,
    }));
  }

  function stopAll() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setIsPlaying(false);
    setPlayingIndex(null);
  }

  function playSingle(notes) {
    setIsPlaying(true);
    setPlayingIndex(null);

    notes.forEach(({ name, octave }, i) => {
      const t = setTimeout(() => {
        audioService.play(name, octave);
        setPlayingIndex(i);

        const clearT = setTimeout(() => {
          setPlayingIndex(null);
          if (i === notes.length - 1) setIsPlaying(false);
        }, SINGLE_INTERVAL_MS - 80);
        timeoutsRef.current.push(clearT);
      }, i * SINGLE_INTERVAL_MS);
      timeoutsRef.current.push(t);
    });
  }

  function playStrum(notes) {
    audioService.init();
    const baseTime = audioService.audioContext.currentTime + 0.02;

    notes.forEach(({ name, octave }, i) => {
      audioService.playAtTime(name, octave, baseTime + i * STRUM_INTERVAL_S);
    });

    setPlayingIndex('strum');
    setIsPlaying(true);

    const totalMs = notes.length * STRUM_INTERVAL_S * 1000 + 300;
    const t = setTimeout(() => {
      setPlayingIndex(null);
      setIsPlaying(false);
    }, totalMs);
    timeoutsRef.current.push(t);
  }

  function handlePlay() {
    if (isPlaying) { stopAll(); return; }

    const notes = getActiveNotes();
    if (playMode === 'strum') {
      playStrum(notes);
    } else {
      playSingle(notes);
    }
  }

  const activeNotes = getActiveNotes();

  return (
    <div className="scale-notes">
      {scaleNotes.map((noteIdx, i) => {
        const noteName    = NOTES[noteIdx];
        const isRoot      = noteIdx === root;
        const inChord     = triads.includes(noteName);
        const isExtension = extensions.includes(noteName);
        const dimmed      = hasSelection && !inChord && !isExtension;
        const activeIdx   = activeNotes.findIndex(n => n.name === noteName);

        // Single mode: highlight the note being played sequentially
        // Strum mode: flash all active notes at once
        const isPlayingNote =
          playMode === 'strum'
            ? playingIndex === 'strum' && (activeIdx !== -1)
            : playingIndex === activeIdx && activeIdx !== -1;

        return (
          <div
            key={i}
            className={[
              'scale-note-circle',
              isRoot && !inChord && !isExtension ? 'scale-note-circle--root' : '',
              inChord ? (isRoot ? 'scale-note-circle--root scale-note-circle--chord' : 'scale-note-circle--chord') : '',
              isExtension ? 'scale-note-circle--extension' : '',
              dimmed ? 'scale-note-circle--dimmed' : '',
              isPlayingNote ? 'scale-note-circle--playing' : '',
            ].filter(Boolean).join(' ')}
            title={noteName}
          >
            {noteName}
          </div>
        );
      })}

      <button
        className={`scale-play-btn${isPlaying ? ' scale-play-btn--active' : ''}`}
        onClick={handlePlay}
        title={isPlaying ? 'Stop' : playMode === 'strum' ? 'Strum chord' : 'Play scale'}
      >
        {isPlaying ? (
          <svg width="10" height="10" viewBox="0 0 10 10">
            <rect x="1" y="1" width="3" height="8" rx="1" fill="currentColor"/>
            <rect x="6" y="1" width="3" height="8" rx="1" fill="currentColor"/>
          </svg>
        ) : playMode === 'strum' ? (
          // Strum icon: three diagonal lines like guitar strings being swept
          <svg width="11" height="11" viewBox="0 0 11 11">
            <line x1="2" y1="2" x2="9" y2="5"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2" y1="5" x2="9" y2="5"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2" y1="8" x2="9" y2="5"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="2,1 9,5 2,9" fill="currentColor"/>
          </svg>
        )}
      </button>
    </div>
  );
}

