/**
 * BeatForge Studio – Pattern Presets
 * Pre-programmed beat patterns for different genres
 */

export interface PatternPreset {
  id: string;
  name: string;
  genre: string;
  bpm: number;
  pattern: boolean[][];
  description: string;
}

// Pattern format: [kick, snare, hihat, bass] x 16 steps
export const PATTERN_PRESETS: PatternPreset[] = [
  {
    id: 'basic-rock',
    name: 'Basic Rock',
    genre: 'Rock',
    bpm: 120,
    description: 'Klassischer Rock-Beat mit Kick auf 1 und 3',
    pattern: [
      // Kick
      [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
      // Snare
      [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
      // HiHat
      [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
      // Bass
      [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    ],
  },
  {
    id: 'trap',
    name: 'Trap',
    genre: 'Trap',
    bpm: 140,
    description: 'Moderner Trap-Beat mit schnellen Hi-Hats',
    pattern: [
      // Kick
      [true, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false],
      // Snare
      [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
      // HiHat
      [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
      // Bass
      [true, false, false, true, false, false, true, false, true, false, false, true, false, false, true, false],
    ],
  },
  {
    id: 'house',
    name: 'House',
    genre: 'House',
    bpm: 128,
    description: 'Klassischer House-Beat mit durchgehender Kick',
    pattern: [
      // Kick
      [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
      // Snare
      [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      // HiHat
      [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true],
      // Bass
      [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    ],
  },
  {
    id: 'lofi',
    name: 'Lo-Fi',
    genre: 'Lo-Fi',
    bpm: 85,
    description: 'Entspannter Lo-Fi Beat mit offbeats',
    pattern: [
      // Kick
      [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
      // Snare
      [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      // HiHat
      [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true],
      // Bass
      [true, false, false, false, true, false, false, true, true, false, false, false, true, false, false, false],
    ],
  },
  {
    id: 'funk',
    name: 'Funk',
    genre: 'Funk',
    bpm: 110,
    description: 'Groovy Funk-Beat mit synkopierten Elementen',
    pattern: [
      // Kick
      [true, false, false, true, false, false, true, false, true, false, false, true, false, false, true, false],
      // Snare
      [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
      // HiHat
      [true, true, false, true, true, false, true, true, true, true, false, true, true, false, true, true],
      // Bass
      [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
    ],
  },
  {
    id: 'techno',
    name: 'Techno',
    genre: 'Techno',
    bpm: 130,
    description: 'Industrieller Techno mit durchgehender Kick',
    pattern: [
      // Kick
      [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
      // Snare
      [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      // HiHat
      [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
      // Bass
      [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    ],
  },
];
