/**
 * BeatForge Studio – Drum Kits
 * Different drum sound sets with varying characteristics
 */

export interface DrumKitConfig {
  id: string;
  name: string;
  description: string;
  kickConfig: {
    pitchDecay: number;
    octaves: number;
    decayTime: number;
  };
  snareConfig: {
    decayTime: number;
    brightness: number;
  };
  hihatConfig: {
    harmonicity: number;
    modulationIndex: number;
    resonance: number;
  };
}

export const DRUM_KITS: DrumKitConfig[] = [
  {
    id: 'classic-808',
    name: '808 Classic',
    description: 'Klassischer 808 Sound mit tiefem Kick',
    kickConfig: {
      pitchDecay: 0.08,
      octaves: 6,
      decayTime: 0.5,
    },
    snareConfig: {
      decayTime: 0.2,
      brightness: 0.8,
    },
    hihatConfig: {
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
    },
  },
  {
    id: 'acoustic-kit',
    name: 'Acoustic',
    description: 'Warmer, akustischer Drum-Sound',
    kickConfig: {
      pitchDecay: 0.05,
      octaves: 5,
      decayTime: 0.35,
    },
    snareConfig: {
      decayTime: 0.15,
      brightness: 0.6,
    },
    hihatConfig: {
      harmonicity: 4.2,
      modulationIndex: 24,
      resonance: 3500,
    },
  },
  {
    id: 'lofi-kit',
    name: 'Lo-Fi',
    description: 'Verwaschener, Lo-Fi Drum-Sound',
    kickConfig: {
      pitchDecay: 0.12,
      octaves: 4,
      decayTime: 0.6,
    },
    snareConfig: {
      decayTime: 0.25,
      brightness: 0.4,
    },
    hihatConfig: {
      harmonicity: 3.5,
      modulationIndex: 16,
      resonance: 2500,
    },
  },
  {
    id: 'deep-house',
    name: 'Deep House',
    description: 'Tiefer, resonanter House-Sound',
    kickConfig: {
      pitchDecay: 0.1,
      octaves: 7,
      decayTime: 0.55,
    },
    snareConfig: {
      decayTime: 0.18,
      brightness: 0.7,
    },
    hihatConfig: {
      harmonicity: 6.0,
      modulationIndex: 40,
      resonance: 4500,
    },
  },
  {
    id: 'trap-kit',
    name: 'Trap',
    description: 'Scharfer, moderner Trap-Sound',
    kickConfig: {
      pitchDecay: 0.04,
      octaves: 5,
      decayTime: 0.3,
    },
    snareConfig: {
      decayTime: 0.12,
      brightness: 0.95,
    },
    hihatConfig: {
      harmonicity: 7.0,
      modulationIndex: 48,
      resonance: 5000,
    },
  },
];

export const DEFAULT_KIT = DRUM_KITS[0];
