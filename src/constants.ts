import type { Note } from "./types";

export const notes: Note[] = [
  'C', 'C♯', 'D♭', 'D', 'D♯', 'E♭', 'E',
  'F', 'F♯', 'G♭', 'G', 'G♯', 'A♭', 'A',
  'A♯', 'B♭', 'B'];

export const GUITAR_TUNING: Note[] = ['E', 'A', 'D', 'G', 'B', 'E'];

export const CHROMATIC_SCALE: { sharp: Note; flat?: Note }[] = [
  { sharp: 'C' },
  { sharp: 'C♯', flat: 'D♭' },
  { sharp: 'D' },
  { sharp: 'D♯', flat: 'E♭' },
  { sharp: 'E' },
  { sharp: 'F' },
  { sharp: 'F♯', flat: 'G♭' },
  { sharp: 'G' },
  { sharp: 'G♯', flat: 'A♭' },
  { sharp: 'A' },
  { sharp: 'A♯', flat: 'B♭' },
  { sharp: 'B' }
];

export const SCALE_INTERVALS: { [key: string]: number[] } = {
  // Major (Ionian): 1, 2, 3, 4, 5, 6, 7 (W-W-H-W-W-W-H)
  'Major (Ionian)': [0, 2, 4, 5, 7, 9, 11],
  // Minor (Aeolian): 1, 2, ♭3, 4, 5, ♭6, ♭7 (W-H-W-W-H-W-W)
  'Minor (Aeolian)': [0, 2, 3, 5, 7, 8, 10],
  // Harmonic Minor: 1, 2, ♭3, 4, 5, ♭6, 7 (W-H-W-W-H-WH-H)
  'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11],
  // Melodic Minor (ascending): 1, 2, ♭3, 4, 5, 6, 7 (W-H-W-W-W-W-H)
  'Melodic Minor': [0, 2, 3, 5, 7, 9, 11],
  // Dorian: 1, 2, ♭3, 4, 5, 6, ♭7 (W-H-W-W-W-H-W)
  'Dorian': [0, 2, 3, 5, 7, 9, 10],
  // Phrygian: 1, ♭2, ♭3, 4, 5, ♭6, ♭7 (H-W-W-W-H-W-W)
  'Phrygian': [0, 1, 3, 5, 7, 8, 10],
  // Lydian: 1, 2, 3, ♯4, 5, 6, 7 (W-W-W-H-W-W-H)
  'Lydian': [0, 2, 4, 6, 7, 9, 11],
  // Mixolydian: 1, 2, 3, 4, 5, 6, ♭7 (W-W-H-W-W-H-W)
  'Mixolydian': [0, 2, 4, 5, 7, 9, 10],
  // Locrian: 1, ♭2, ♭3, 4, ♭5, ♭6, ♭7 (H-W-W-H-W-W-W)
  'Locrian': [0, 1, 3, 5, 6, 8, 10],
  // Major Pentatonic: 1, 2, 3, 5, 6 (W-W-WH-W)
  'Major Pentatonic': [0, 2, 4, 7, 9],
  // Minor Pentatonic: 1, ♭3, 4, 5, ♭7 (WH-W-W-WH)
  'Minor Pentatonic': [0, 3, 5, 7, 10]
};

export const SCALE_TYPES = Object.keys(SCALE_INTERVALS);