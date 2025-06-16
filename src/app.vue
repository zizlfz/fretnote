<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { Note } from "./types";
import { CHROMATIC_SCALE, SCALE_TYPES } from "./constants";
import { getScaleNotes, ensureUniqueLetters } from "./utils"
import { useQueryState } from "./composables"
import GuitarFretboard from "./components/guitar-fretboard.vue"

const { selectedScale } = useQueryState()

const scaleNotes = ref<Note[]>(getScaleNotes(selectedScale.rootNote, selectedScale.scaleType));
const uniqueNotes = computed(() => ensureUniqueLetters(scaleNotes.value))

watch(selectedScale, () => {
  scaleNotes.value = getScaleNotes(selectedScale.rootNote, selectedScale.scaleType);
});

const scaleDisplayName = () => {
  const scaleName = selectedScale.scaleType.replace(" (Ionian)", "").replace(" (Aeolian)", "");
  return `${selectedScale.rootNote} ${scaleName} Scale`;
};
</script>

<template>
  <div class="bg-[#fffcf1] min-h-screen">
    <header class="max-w-2xl mx-auto py-4 px-3">
      <div class="flex justify-between items-center flex-wrap">
        <div>
          <p>{{ scaleDisplayName() }}</p>
          <ul class="flex space-x-2">
            <li v-for="(note, index) in uniqueNotes" :key="index" class="relative text-2xl pb-3">
              {{ note }}
            </li>
          </ul>
        </div>
        <div class="flex items-center flex-nowrap space-x-2">
          <div>Pick scale:</div>
          <select
            v-model="selectedScale.rootNote"
            class="border border-zinc-300 rounded-lg px-2 py-1 bg-zinc-100"
            name="rootNote"
            id="rootNote"
          >
            <template v-for="note in CHROMATIC_SCALE" :key="note.sharp">
              <option
                :value="note.sharp"
              >
                {{ note.sharp }}
              </option>
              <option
                v-if="note.flat"
                :value="note.flat"
              >
                {{ note.flat }}
              </option>
            </template>
          </select>
          <select
            v-model="selectedScale.scaleType"
            class="border border-zinc-300 rounded-lg px-2 py-1 bg-zinc-100"
            name="scaleType"
            id="scaleType"
          >
            <option v-for="type in SCALE_TYPES" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>
      </div>
    </header>
    <main class="flex justify-center px-4">
      <GuitarFretboard :scale="{
        name: 'Scale',
        notes: scaleNotes,
        rootNote: scaleNotes[0],
        fretRange: { startFret: 0, endFret: 13 }
      }" :width="1250" :height="300" />
    </main>
  </div>
</template>