import { reactive, watch, toRefs } from 'vue';
import type { Note } from './types';
import { notes, SCALE_TYPES } from './constants';

type ScaleState = {
  rootNote: Note;
  scaleType: typeof SCALE_TYPES[number];
};

export function useQueryState() {
  // Get initial query params from URL
  const urlParams = new URLSearchParams(window.location.search);

  // Validate rootNote from URL query
  const urlRootNote = urlParams.get('rootNote') as unknown as Note;
  const validatedRootNote = urlRootNote && notes.includes(urlRootNote) ? urlRootNote : 'C';

  // Validate scaleType from URL query
  const urlScaleType = urlParams.get('scaleType');
  const validatedScaleType = urlScaleType && SCALE_TYPES.includes(urlScaleType) ? urlScaleType : 'Major (Ionian)';

  // Initialize reactive state with validated or default values
  const selectedScale = reactive<ScaleState>({
    rootNote: validatedRootNote,
    scaleType: validatedScaleType,
  });

  // Method to update rootNote with validation
  const updateRootNote = (newRootNote: Note) => {
    selectedScale.rootNote = notes.includes(newRootNote) ? newRootNote : 'C';
  };

  // Method to update scaleType with validation
  const updateScaleType = (newScaleType: string) => {
    selectedScale.scaleType = SCALE_TYPES.includes(newScaleType) ? newScaleType : 'Major (Ionian)';
  };

  // Sync state to URL query whenever it changes
  watch(
    () => selectedScale,
    (newState) => {
      const params = new URLSearchParams();
      params.set('rootNote', newState.rootNote);
      params.set('scaleType', newState.scaleType);

      // Update URL without reloading
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    },
    { deep: true }
  );

  // Listen for popstate events (e.g., back/forward navigation)
  window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);
    const newRootNote = params.get('rootNote') as unknown as Note;
    const newScaleType = params.get('scaleType');
    selectedScale.rootNote = newRootNote && notes.includes(newRootNote) ? newRootNote : 'C';
    selectedScale.scaleType = newScaleType && SCALE_TYPES.includes(newScaleType) ? newScaleType : 'Major (Ionian)';
  });

  return {
    selectedScale,
    ...toRefs(selectedScale),
    updateRootNote,
    updateScaleType,
  };
}