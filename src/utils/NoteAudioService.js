export class NoteAudioService {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.sustainEnabled = false;

    this.octave4Frequencies = {
      'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
      'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
      'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
    };
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  setVolume(value) {
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.setValueAtTime(value / 100, this.audioContext.currentTime);
    }
  }

  setSustain(enabled) {
    this.sustainEnabled = enabled;
  }

  getFrequency(noteName, octave) {
    const baseFreq = this.octave4Frequencies[noteName];
    if (!baseFreq) return 0;
    return baseFreq * Math.pow(2, octave - 4);
  }

  play(noteName, octave) {
    this.init();
    this._playAt(noteName, octave, this.audioContext.currentTime);
  }

  // Play a note starting at a specific AudioContext time (seconds).
  // Using scheduled time means each note's full envelope runs independently —
  // no note cancels another even when they start just milliseconds apart.
  playAtTime(noteName, octave, startTime) {
    this.init();
    this._playAt(noteName, octave, startTime);
  }

  _playAt(noteName, octave, startTime) {
    const frequency = this.getFrequency(noteName, octave);
    if (frequency === 0) return;
    const now = startTime;
    const oscillators = [];
    const gainNodes = [];

    const harmonicData = [
      { type: 'triangle', mult: 1, gain: 0.45 },
      { type: 'sine',     mult: 2, gain: 0.18 },
      { type: 'sine',     mult: 3, gain: 0.08 },
      { type: 'sine',     mult: 4, gain: 0.04 }
    ];

    harmonicData.forEach(h => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.type = h.type;
      osc.frequency.setValueAtTime(frequency * h.mult, now);
      gain.gain.setValueAtTime(h.gain, now);
      oscillators.push(osc);
      gainNodes.push(gain);
    });

    const envelope = this.audioContext.createGain();
    const attackTime = 0.008;
    const decayTime = 0.12;
    const sustainLevel = 0.35;
    const releaseTime = this.sustainEnabled ? 3.5 : 1.8;

    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(0.85, now + attackTime);
    envelope.gain.exponentialRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + releaseTime);

    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(4000, frequency * 6), now);
    filter.frequency.exponentialRampToValueAtTime(Math.min(1500, frequency * 3), now + 0.4);
    filter.Q.setValueAtTime(0.8, now);

    oscillators.forEach((osc, i) => {
      osc.connect(gainNodes[i]);
      gainNodes[i].connect(envelope);
    });
    envelope.connect(filter);
    filter.connect(this.masterGain);

    oscillators.forEach(osc => osc.start(now));
    oscillators.forEach(osc => osc.stop(now + releaseTime + 0.1));
  }
}

// Singleton instance shared across the app
export const audioService = new NoteAudioService();
