import { CHROMATIC_SCALE, GUITAR_TUNING, SCALE_INTERVALS, SCALE_TYPES } from "./constants";
import type { ExactNote, Note } from "./types";

// Type guard to check if a note is an ExactNote
export const isExactNote = (note: Note | ExactNote): note is ExactNote => {
  return typeof note === 'object' && 'string' in note && 'fret' in note && 'name' in note;
};

export const noteToIndex = (note: Note): number => {
  // Handle special enharmonic cases first
  if (note === 'E♯' || note === 'F♭') return 5; // E♯ = Fb = F
  if (note === 'B♯' || note === 'C♭') return 0; // B♯ = Cb = C
  if (note === 'C♯♯' || note === 'D♭♭') return 2; // C♯♯ = Dbb = D
  if (note === 'D♯♯' || note === 'E♭♭') return 4; // D♯♯ = Ebb = E
  if (note === 'E♯♯' || note === 'F♭♭') return 6; // E♯♯ = Fbb = F♯/Gb
  if (note === 'F♯♯' || note === 'G♭♭') return 7; // F♯♯ = Gbb = G
  if (note === 'G♯♯' || note === 'A♭♭') return 9; // G♯♯ = Abb = A
  if (note === 'A♯♯' || note === 'B♭♭') return 11; // A♯♯ = Bbb = B
  if (note === 'B♯♯' || note === 'C♭♭') return 1; // B♯♯ = Cbb = C♯/Db

  // Search for the note in both sharp and flat properties
  const index = CHROMATIC_SCALE.findIndex(
    n => n.sharp === note || n.flat === note
  );
  if (index === -1) {
    throw new Error(`Invalid note: ${note}`);
  }
  return index;
};

// Get note at specific string and fret
export const getNoteAtFret = (
  stringIndex: number,
  fret: number,
  key?: { rootNote: Note; scaleType: string }
): Note => {
  const openStringNote = GUITAR_TUNING[stringIndex];
  const openIndex = noteToIndex(openStringNote);
  const fretIndex = (openIndex + fret) % 12;
  const note = CHROMATIC_SCALE[fretIndex];

  // Determine notation based on key context, if provided
  const notation = key ? getPreferredNotation(key.rootNote) : 'sharp';
  return notation === 'flat' && note.flat ? note.flat : note.sharp;
};

export const getScaleNotes = (rootNote: Note, scaleType: string): Note[] => {
  // Validate scale type first
  if (!SCALE_TYPES.includes(scaleType)) {
    throw new Error('Invalid scale type');
  }

  // Find the chromatic index of the root note
  const rootIndex = noteToIndex(rootNote);
  const scaleIntervals = SCALE_INTERVALS[scaleType];

  // Get the letter sequence starting from root note
  const rootLetter = rootNote.charAt(0);
  const letterSequence = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const rootLetterIndex = letterSequence.indexOf(rootLetter);

  console.log("Root note:", rootNote, "Scale type:", scaleType);

  const scaleNotes: Note[] = [];

  for (let i = 0; i < scaleIntervals.length; i++) {
    const interval = scaleIntervals[i];
    const noteIndex = (rootIndex + interval) % 12;
    const chromaticNote = CHROMATIC_SCALE[noteIndex];

    // Calculate expected letter for this scale degree
    const expectedLetterIndex = (rootLetterIndex + i) % 7;
    const expectedLetter = letterSequence[expectedLetterIndex];

    let selectedNote: Note;

    // Check if the natural note matches
    if (chromaticNote.sharp === expectedLetter) {
      selectedNote = chromaticNote.sharp;
    }
    // Check if sharp version matches expected letter
    else if (chromaticNote.sharp.charAt(0) === expectedLetter) {
      selectedNote = chromaticNote.sharp;
    }
    // Check if flat version matches expected letter
    else if (chromaticNote.flat && chromaticNote.flat.charAt(0) === expectedLetter) {
      selectedNote = chromaticNote.flat;
    }
    // Handle special cases where we need double sharps/flats or unusual enharmonics
    else {
      // For cases where the chromatic note doesn't match expected letter,
      // we need to use enharmonic equivalents
      selectedNote = getEnharmonicEquivalent(noteIndex, expectedLetter);
    }

    scaleNotes.push(selectedNote);
  }

  return scaleNotes;
};

const getEnharmonicEquivalent = (chromaticIndex: number, expectedLetter: string): Note => {
  // Map of chromatic indexes to their possible enharmonic spellings
  const enharmonicMap: { [key: number]: { [letter: string]: Note } } = {
    0: { 'C': 'C' }, // C 
    1: { 'C': 'C♯', 'D': 'D♭' },
    2: { 'D': 'D' },
    3: { 'D': 'D♯', 'E': 'E♭' },
    4: { 'E': 'E' }, // E
    5: { 'F': 'F', 'E': 'E♯' }, // F or E♯
    6: { 'F': 'F♯', 'G': 'G♭' },
    7: { 'G': 'G' },
    8: { 'G': 'G♯', 'A': 'A♭' },
    9: { 'A': 'A' },
    10: { 'A': 'A♯', 'B': 'B♭' },
    11: { 'B': 'B', 'C': 'C♭' } // B or Cb
  };

  const possibilities = enharmonicMap[chromaticIndex];
  if (possibilities && possibilities[expectedLetter]) {
    return possibilities[expectedLetter];
  }

  // Fallback to the chromatic note's standard representation
  const chromaticNote = CHROMATIC_SCALE[chromaticIndex];
  return chromaticNote.flat && expectedLetter === chromaticNote.flat.charAt(0)
    ? chromaticNote.flat
    : chromaticNote.sharp;
};

export const ensureUniqueLetters = (notes: Note[]): Note[] => {
  const result: Note[] = [];
  const letterSequence = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  // Find the starting letter from the first note
  const firstLetter = notes[0].charAt(0);
  const startIndex = letterSequence.indexOf(firstLetter);

  // Use pentatonic degrees only for 5-note scales
  let degreeIndices: number[];
  if (notes.length === 5) {
    degreeIndices = isMajorPentatonic(notes) ? [0, 1, 2, 4, 5] : [0, 2, 3, 4, 6];
  } else {
    // For 7-note scales or others, use sequential indices
    degreeIndices = Array.from({ length: notes.length }, (_, i) => i);
  }

  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const chromaticIndex = noteToIndex(note);

    // Calculate the expected letter based on the degree index
    const degreeIndex = degreeIndices[i];
    const expectedLetterIndex = (startIndex + degreeIndex) % 7;
    const expectedLetter = letterSequence[expectedLetterIndex];

    // Find the enharmonic equivalent that uses the expected letter
    const correctNote = findEnharmonicForLetter(chromaticIndex, expectedLetter);
    result.push(correctNote);
  }

  return result;
};

// Helper function to detect if the scale is major pentatonic
const isMajorPentatonic = (notes: Note[]): boolean => {
  if (notes.length !== 5) return false;
  // Convert notes to chromatic indices
  const indices = notes.map(note => noteToIndex(note) % 12);
  // Normalize to start from 0
  const normalized = indices.map(idx => (idx - indices[0] + 12) % 12).sort((a, b) => a - b);
  // Major pentatonic intervals: 0, 2, 4, 7, 9
  const majorPentatonicPattern = [0, 2, 4, 7, 9];
  return normalized.every((val, i) => val === majorPentatonicPattern[i]);
};

// Existing findEnharmonicForLetter function (with typo fix)
const findEnharmonicForLetter = (chromaticIndex: number, targetLetter: string): Note => {
  const enharmonicByLetter: { [key: number]: { [letter: string]: Note } } = {
    0: { 'C': 'C', 'B': 'B♯', 'D': 'D♭♭' },
    1: { 'C': 'C♯', 'D': 'D♭', 'B': 'B♯♯' },
    2: { 'D': 'D', 'C': 'C♯♯', 'E': 'E♭♭' },
    3: { 'D': 'D♯', 'E': 'E♭', 'F': 'F♭♭' },
    4: { 'E': 'E', 'D': 'D♯♯', 'F': 'F♭' },
    5: { 'F': 'F', 'E': 'E♯', 'G': 'G♭♭' },
    6: { 'F': 'F♯', 'G': 'G♭', 'E': 'E♯♯' },
    7: { 'G': 'G', 'F': 'F♯♯', 'A': 'A♭♭' },
    8: { 'G': 'G♯', 'A': 'A♭' },
    9: { 'A': 'A', 'G': 'G♯♯', 'B': 'B♭♭' },
    10: { 'A': 'A♯', 'B': 'B♭', 'C': 'C♭♭' },
    11: { 'B': 'B', 'A': 'A♯♯', 'C': 'C♭' }
  };

  const letterOptions = enharmonicByLetter[chromaticIndex];

  if (letterOptions && letterOptions[targetLetter]) {
    return letterOptions[targetLetter];
  }

  // Fallback: return the most common spelling
  const chromaticNote = CHROMATIC_SCALE[chromaticIndex];
  return chromaticNote.sharp;
};

// Utility function to determine preferred notation (sharp or flat) based on root note and scale type
export const getPreferredNotation = (rootNote: string): 'sharp' | 'flat' => {
  // Define sharp/flat preferences based on the actual root note used
  const sharpKeys = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'C♯', 'G♯', 'D♯', 'A♯'];
  const flatKeys = ['F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭'];

  // Check if the root note itself indicates sharp or flat preference
  if (sharpKeys.includes(rootNote)) {
    return 'sharp';
  } else if (flatKeys.includes(rootNote)) {
    return 'flat';
  }

  // Default to sharp for natural notes in ambiguous cases
  return 'sharp';
};