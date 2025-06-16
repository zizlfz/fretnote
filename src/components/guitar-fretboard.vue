<template>
  <div class="overflow-x-auto">
      <canvas
        ref="canvasRef"
        :width="width"
        :height="height"
        class="cursor-pointer"
        @click="handleCanvasClick"
      />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, type Ref } from 'vue'
import type { Note, ExactNote, FretRange, Scale, NotePosition, DrawingDimensions } from "../types"
import { GUITAR_TUNING, CHROMATIC_SCALE } from "../constants"
import { noteToIndex, getNoteAtFret, isExactNote } from "../utils"

interface Props {
  scale: Scale;
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 300
})

const canvasRef: Ref<HTMLCanvasElement | null> = ref(null);
const notePositions: Ref<NotePosition[]> = ref([]);

const calculateDimensions = (
  startFret: number, 
  endFret: number, 
  height: number
): DrawingDimensions => {
  const noteRadius = 15;
  const fretWidth = noteRadius * 6;
  const margin = 40;
  const numStrings = GUITAR_TUNING.length;
  const stringSpacing = (height - 2 * margin) / (numStrings - 1);
  const numFretSpaces = startFret === 0 ? endFret : endFret - startFret + 1;

  return {
    noteRadius,
    fretWidth,
    margin,
    stringSpacing,
    numFretSpaces,
    numStrings
  };
};

const drawStrings = (
  ctx: CanvasRenderingContext2D,
  dimensions: DrawingDimensions,
  height: number
) => {
  const { margin, stringSpacing, numStrings, numFretSpaces, fretWidth } = dimensions;
  
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < numStrings; i++) {
    const y = margin + i * stringSpacing;
    ctx.beginPath();
    ctx.moveTo(margin, y);
    ctx.lineTo(margin + numFretSpaces * fretWidth, y);
    ctx.stroke();
  }
};

const drawFretLines = (
  ctx: CanvasRenderingContext2D,
  dimensions: DrawingDimensions,
  startFret: number,
  height: number
) => {
  const { margin, fretWidth, numFretSpaces } = dimensions;
  
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  
  const fretLinesToDraw = startFret === 0 ? numFretSpaces + 1 : numFretSpaces + 1;
  for (let i = 0; i < fretLinesToDraw; i++) {
    const x = margin + i * fretWidth;
    ctx.beginPath();
    ctx.moveTo(x, margin);
    ctx.lineTo(x, height - margin);
    ctx.stroke();
  }
};

const drawFretNumbers = (
  ctx: CanvasRenderingContext2D,
  dimensions: DrawingDimensions,
  startFret: number
) => {
  const { margin, fretWidth, numFretSpaces } = dimensions;
  
  ctx.fillStyle = '#333';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  
  if (startFret === 0) {
    // When starting from 0, label the spaces 1, 2, 3, etc.
    for (let i = 0; i < numFretSpaces; i++) {
      const fretNumber = i + 1;
      const x = margin + (i + 0.5) * fretWidth;
      ctx.fillText(fretNumber.toString(), x, margin - 10);
    }
  } else {
    // When starting from higher fret, label normally
    for (let i = 0; i < numFretSpaces; i++) {
      const fretNumber = startFret + i;
      const x = margin + (i + 0.5) * fretWidth;
      ctx.fillText(fretNumber.toString(), x, margin - 10);
    }
  }
};

const drawStringNames = (
  ctx: CanvasRenderingContext2D,
  dimensions: DrawingDimensions
) => {
  const { margin, stringSpacing, numStrings } = dimensions;
  
  ctx.fillStyle = '#333';
  ctx.font = '12px Arial';
  ctx.textAlign = 'right';
  
  for (let i = 0; i < numStrings; i++) {
    // Display strings in reverse order: high E at top, low E at bottom
    const stringName = GUITAR_TUNING[numStrings - 1 - i];
    const y = margin + i * stringSpacing + 4;
    ctx.fillText(stringName, margin - 10, y);
  }
};

const calculateNotePosition = (
  fret: number,
  stringIndex: number,
  startFret: number,
  dimensions: DrawingDimensions
): { x: number; y: number } => {
  const { margin, fretWidth, stringSpacing, numStrings } = dimensions;
  
  let x: number;
  if (fret === 0 && startFret === 0) {
    // For open strings when starting from 0, place on the left fret line
    x = margin;
  } else if (startFret === 0) {
    // For fretted notes when starting from 0, place in the middle of fret space
    x = margin + (fret - 0.5) * fretWidth;
  } else {
    // For ranges not starting from 0, place normally
    const spaceIndex = fret - startFret;
    x = margin + (spaceIndex + 0.5) * fretWidth;
  }
  
  // Display strings in reverse order: high E at top, low E at bottom
  const displayStringIndex = numStrings - 1 - stringIndex;
  const y = margin + displayStringIndex * stringSpacing;
  
  return { x, y };
};

const isNoteInScale = (
  noteAtFret: Note,
  stringIndex: number,
  fret: number,
  scale: Scale
): boolean => {
  return scale.notes.some(scaleNote => {
    if (isExactNote(scaleNote)) {
      // For ExactNote, match exact position and note name
      return scaleNote.string === stringIndex && 
             scaleNote.fret === fret && 
             noteToIndex(scaleNote.name) === noteToIndex(noteAtFret);
    } else {
      // For regular Note, match note name regardless of position
      return noteToIndex(scaleNote) === noteToIndex(noteAtFret);
    }
  });
};

const findExactNote = (
  stringIndex: number,
  fret: number,
  scale: Scale
): ExactNote | undefined => {
  return scale.notes.find(scaleNote => 
    isExactNote(scaleNote) && 
    scaleNote.string === stringIndex && 
    scaleNote.fret === fret
  ) as ExactNote | undefined;
};

const drawNoteCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  note: Note,
  isRoot: boolean,
  isExact: boolean,
  noteRadius: number
) => {
  // Choose color based on note type
  if (isRoot) {
    ctx.fillStyle = '#E74C3C'; // Red for root notes
  } else if (isExact) {
    ctx.fillStyle = '#9B59B6'; // Purple for exact notes
  } else {
    ctx.fillStyle = '#4A90E2'; // Blue for regular scale notes
  }
  
  // Draw circle
  ctx.beginPath();
  ctx.arc(x, y, noteRadius, 0, 2 * Math.PI);
  ctx.fill();

  // Add borders for special notes
  if (isRoot) {
    ctx.strokeStyle = '#C0392B';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else if (isExact) {
    ctx.strokeStyle = '#8E44AD';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Draw note name
  ctx.fillStyle = 'white';
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(note, x, y + 4);
};

const drawScaleNotes = (
  ctx: CanvasRenderingContext2D,
  scale: Scale,
  startFret: number,
  endFret: number,
  dimensions: DrawingDimensions,
  notePositions: NotePosition[]
) => {
  const { numStrings, noteRadius } = dimensions;
  
  for (let stringIndex = 0; stringIndex < numStrings; stringIndex++) {
    for (let fret = startFret; fret <= endFret; fret++) {
      const noteAtFret = getNoteAtFret(stringIndex, fret);
      
      if (isNoteInScale(noteAtFret, stringIndex, fret, scale)) {
        const { x, y } = calculateNotePosition(fret, stringIndex, startFret, dimensions);
        const exactNote = findExactNote(stringIndex, fret, scale);
        const isRoot = noteToIndex(noteAtFret) === noteToIndex(scale.rootNote);
        const isExact = exactNote !== undefined;

        // Store note position for click detection
        notePositions.push({
          x,
          y,
          radius: noteRadius,
          note: noteAtFret,
          string: stringIndex,
          fret,
          isRoot,
          isExact
        });

        // Draw the note circle
        drawNoteCircle(ctx, x, y, noteAtFret, isRoot, isExact, noteRadius);
      }
    }
  }
};

const drawInlays = (
  ctx: CanvasRenderingContext2D,
  dimensions: DrawingDimensions,
  startFret: number,
  endFret: number,
  height: number
) => {
  const { margin, fretWidth, stringSpacing, numStrings } = dimensions;
  const inlayRadius = 8;
  
  // Frets that have single dots
  const singleDotFrets = [3, 5, 7, 9, 15, 17, 19, 21];
  // Frets that have double dots
  const doubleDotFrets = [12, 24];
  
  ctx.fillStyle = '#DDD';
  
  for (let fret = startFret; fret <= endFret; fret++) {
    if (fret === 0) continue; // No inlays on open string position
    
    let fretCenterX: number;
    if (startFret === 0) {
      // When starting from 0, fret positions are offset
      fretCenterX = margin + (fret - 0.5) * fretWidth;
    } else {
      // When starting from higher fret
      const spaceIndex = fret - startFret;
      fretCenterX = margin + (spaceIndex + 0.5) * fretWidth;
    }
    
    if (doubleDotFrets.includes(fret)) {
      // Draw double dots for octave markers (12th, 24th fret)
      const centerY = margin + (numStrings - 1) * stringSpacing / 2;
      const dotOffset = stringSpacing * 0.8;
      
      // Upper dot
      ctx.beginPath();
      ctx.arc(fretCenterX, centerY - dotOffset, inlayRadius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Lower dot
      ctx.beginPath();
      ctx.arc(fretCenterX, centerY + dotOffset, inlayRadius, 0, 2 * Math.PI);
      ctx.fill();
      
    } else if (singleDotFrets.includes(fret)) {
      // Draw single dot for standard position markers
      const centerY = margin + (numStrings - 1) * stringSpacing / 2;
      
      ctx.beginPath();
      ctx.arc(fretCenterX, centerY, inlayRadius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
};

const drawFretboard = (
  ctx: CanvasRenderingContext2D,
  scale: Scale,
  width: number,
  height: number,
  notePositions: NotePosition[]
) => {
  // Clear canvas and reset note positions
  ctx.clearRect(0, 0, width, height);
  notePositions.length = 0;

  if (!scale.fretRange) return;

  const { startFret, endFret } = scale.fretRange;
  const dimensions = calculateDimensions(startFret, endFret, height);

  // Draw all fretboard components in order
  drawStrings(ctx, dimensions, height);
  drawFretLines(ctx, dimensions, startFret, height);
  drawFretNumbers(ctx, dimensions, startFret);
  drawStringNames(ctx, dimensions);
  drawInlays(ctx, dimensions, startFret, endFret, height);
  drawScaleNotes(ctx, scale, startFret, endFret, dimensions, notePositions);
};

const handleCanvasClick = (event: MouseEvent) => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  // Check if click is within any note circle
  for (const notePos of notePositions.value) {
    const distance = Math.sqrt(
      Math.pow(clickX - notePos.x, 2) + Math.pow(clickY - notePos.y, 2)
    );

    if (distance <= notePos.radius) {
      console.log('Note clicked:', {
        note: notePos.note,
        string: notePos.string,
        fret: notePos.fret,
        isRoot: notePos.isRoot,
        isExact: notePos.isExact
      });
      break;
    }
  }
};

const drawCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Update canvas width if needed
  if (props.scale.fretRange) {
    const dimensions = calculateDimensions(
      props.scale.fretRange.startFret, 
      props.scale.fretRange.endFret, 
      props.height
    );
    const requiredWidth = dimensions.margin * 2 + dimensions.numFretSpaces * dimensions.fretWidth;
    if (props.width < requiredWidth) {
      canvas.width = requiredWidth;
    }
  }

  // Draw the entire fretboard
  drawFretboard(ctx, props.scale, props.width, props.height, notePositions.value);
};

watch([() => props.scale, () => props.width, () => props.height], () => {
  nextTick(() => {
    drawCanvas();
  });
}, { deep: true });

onMounted(() => {
  drawCanvas();
});

defineExpose({
  drawCanvas,
  notePositions
});
</script>