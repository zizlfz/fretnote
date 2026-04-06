export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const NOTE_DISPLAY = {
  'C#': 'C#',
  'D#': 'D#',
  'F#': 'F#',
  'G#': 'G#',
  'A#': 'A#',
};

export const STRINGS = ['E', 'B', 'G', 'D', 'A', 'E'];
export const STRING_MIDI = [64, 59, 55, 50, 45, 40];

export const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
export const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10];
export const POSITION_MARKERS = [3, 5, 7, 9, 12, 15, 17, 19, 21];

export const MAJOR_CHORD_TYPES = [
  { degree: 'I',    suffix: '',  intervals: [0, 4, 7] },
  { degree: 'ii',   suffix: 'm', intervals: [0, 3, 7] },
  { degree: 'iii',  suffix: 'm', intervals: [0, 3, 7] },
  { degree: 'IV',   suffix: '',  intervals: [0, 4, 7] },
  { degree: 'V',    suffix: '',  intervals: [0, 4, 7] },
  { degree: 'vi',   suffix: 'm', intervals: [0, 3, 7] },
  { degree: 'vii°', suffix: '°', intervals: [0, 3, 6] },
];

export const MINOR_CHORD_TYPES = [
  { degree: 'i',    suffix: 'm', intervals: [0, 3, 7] },
  { degree: 'ii°',  suffix: '°', intervals: [0, 3, 6] },
  { degree: 'III',  suffix: '',  intervals: [0, 4, 7] },
  { degree: 'iv',   suffix: 'm', intervals: [0, 3, 7] },
  { degree: 'v',    suffix: 'm', intervals: [0, 3, 7] },
  { degree: 'VI',   suffix: '',  intervals: [0, 4, 7] },
  { degree: 'VII',  suffix: '',  intervals: [0, 4, 7] },
];

export function getScaleNotes(rootIndex, mode = 'major') {
  const intervals = mode === 'minor' ? MINOR_SCALE_INTERVALS : MAJOR_SCALE_INTERVALS;
  return intervals.map(i => (rootIndex + i) % 12);
}

export function getChordsInKey(rootIndex, mode = 'major') {
  const scale = getScaleNotes(rootIndex, mode);
  const chordTypes = mode === 'minor' ? MINOR_CHORD_TYPES : MAJOR_CHORD_TYPES;
  return chordTypes.map((type, i) => {
    const chordRoot = scale[i];
    const notes = type.intervals.map(iv => NOTES[(chordRoot + iv) % 12]);
    return {
      name: NOTES[chordRoot] + type.suffix,
      suffix: type.suffix,
      degree: type.degree,
      notes,
    };
  });
}

export function getFretNote(stringIndex, fret) {
  return (STRING_MIDI[stringIndex] + fret) % 12;
}

export const CHORD_MODIFIERS = {
  major: [
    { id: 'triad', label: 'maj',  intervals: [0, 4, 7] },
    { id: 'maj7',  label: 'maj7', intervals: [0, 4, 7, 11] },
    { id: 'dom7',  label: '7',    intervals: [0, 4, 7, 10] },
    { id: 'add9',  label: 'add9', intervals: [0, 4, 7, 14] },
    { id: 'maj9',  label: 'maj9', intervals: [0, 4, 7, 11, 14] },
    { id: 'sus2',  label: 'sus2', intervals: [0, 2, 7] },
    { id: 'sus4',  label: 'sus4', intervals: [0, 5, 7] },
  ],
  minor: [
    { id: 'triad', label: 'm',     intervals: [0, 3, 7] },
    { id: 'm7',    label: 'm7',    intervals: [0, 3, 7, 10] },
    { id: 'madd9', label: 'madd9', intervals: [0, 3, 7, 14] },
    { id: 'm9',    label: 'm9',    intervals: [0, 3, 7, 10, 14] },
    { id: 'm6',    label: 'm6',    intervals: [0, 3, 7, 9] },
  ],
  dim: [
    { id: 'triad', label: 'dim',  intervals: [0, 3, 6] },
    { id: 'dim7',  label: 'dim7', intervals: [0, 3, 6, 9] },
    { id: 'hdim',  label: 'm7♭5', intervals: [0, 3, 6, 10] },
  ],
};

export function getChordType(suffix) {
  if (suffix === '°') return 'dim';
  if (suffix === 'm') return 'minor';
  return 'major';
}

// Returns { triads: string[], extensions: string[] }
// triads = base 3 notes, extensions = added tones beyond the triad
export function resolveChordNotes(chordRootIndex, intervals) {
  const triadIntervals = intervals.slice(0, 3);
  const extIntervals = intervals.slice(3);
  const triads = triadIntervals.map(iv => NOTES[(chordRootIndex + iv) % 12]);
  const extensions = extIntervals.map(iv => NOTES[(chordRootIndex + iv) % 12]);
  return { triads, extensions };
}
