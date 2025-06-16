export type Note =
  | 'C' | 'C♯' | 'D♭' | 'C♯♯' | 'D♭♭'
  | 'D' | 'D♯' | 'E♭' | 'D♯♯' | 'E♭♭'
  | 'E' | 'E♯' | 'F♭' | 'E♯♯' | 'F♭♭'
  | 'F' | 'F♯' | 'G♭' | 'F♯♯' | 'G♭♭'
  | 'G' | 'G♯' | 'A♭' | 'G♯♯' | 'A♭♭'
  | 'A' | 'A♯' | 'B♭' | 'A♯♯' | 'B♭♭'
  | 'B' | 'B♯' | 'C♭' | 'B♯♯' | 'C♭♭';

export interface ExactNote {
  name: Note;
  string: number; // 0-based index (0 = lowest string)
  fret: number;
}

export interface FretRange {
  startFret: number;
  endFret: number;
}

export interface Scale {
  name: string;
  notes: (Note | ExactNote)[];
  rootNote: Note;
  fretRange?: FretRange;
}

export interface NotePosition {
  x: number;
  y: number;
  radius: number;
  note: Note;
  string: number;
  fret: number;
  isRoot: boolean;
  isExact: boolean;
}

export interface DrawingDimensions {
  noteRadius: number;
  fretWidth: number;
  margin: number;
  stringSpacing: number;
  numFretSpaces: number;
  numStrings: number;
}