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
      degree: type.degree,
      notes,
    };
  });
}

export function getFretNote(stringIndex, fret) {
  return (STRING_MIDI[stringIndex] + fret) % 12;
}
