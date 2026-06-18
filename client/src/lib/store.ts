/**
 * BeatForge Studio – State Management (Zustand)
 * Manages sequencer patterns, mixer state, effects, and playback
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DrumType } from './audioEngine';

export interface Channel {
  id: DrumType;
  name: string;
  volume: number;
  muted: boolean;
}

export interface DAWState {
  // Playback
  isPlaying: boolean;
  currentStep: number;
  bpm: number;

  // Pattern (4 tracks x 16 steps)
  pattern: boolean[][];
  
  // Channels
  channels: Channel[];
  masterVolume: number;

  // Effects
  reverbWet: number;
  delayWet: number;

  // Audio initialized
  audioReady: boolean;

  // Actions
  togglePlayback: () => void;
  stop: () => void;
  setBpm: (bpm: number) => void;
  setCurrentStep: (step: number) => void;
  toggleStep: (track: number, step: number) => void;
  setChannelVolume: (trackIndex: number, volume: number) => void;
  toggleMute: (trackIndex: number) => void;
  setReverbWet: (value: number) => void;
  setDelayWet: (value: number) => void;
  setMasterVolume: (volume: number) => void;
  setAudioReady: (ready: boolean) => void;
  clearPattern: () => void;
}

const DRUM_ORDER: DrumType[] = ['kick', 'snare', 'hihat', 'bass'];

const createEmptyPattern = (): boolean[][] =>
  Array(4).fill(null).map(() => Array(16).fill(false));

export const useDAWStore = create<DAWState>()(
  persist(
    (set) => ({
      // Initial state
      isPlaying: false,
      currentStep: -1,
      bpm: 120,
      pattern: createEmptyPattern(),
      channels: [
        { id: 'kick', name: 'Kick', volume: 0.8, muted: false },
        { id: 'snare', name: 'Snare', volume: 0.7, muted: false },
        { id: 'hihat', name: 'HiHat', volume: 0.6, muted: false },
        { id: 'bass', name: 'Bass', volume: 0.75, muted: false },
      ],
      masterVolume: 0.8,
      reverbWet: 0.2,
      delayWet: 0.15,
      audioReady: false,

      // Actions
      togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),

      stop: () => set({ isPlaying: false, currentStep: -1 }),

      setBpm: (bpm) => set({ bpm: Math.max(60, Math.min(200, bpm)) }),

      setCurrentStep: (step) => set({ currentStep: step }),

      toggleStep: (track, step) =>
        set((state) => {
          const newPattern = state.pattern.map((row) => [...row]);
          newPattern[track][step] = !newPattern[track][step];
          return { pattern: newPattern };
        }),

      setChannelVolume: (trackIndex, volume) =>
        set((state) => ({
          channels: state.channels.map((ch, i) =>
            i === trackIndex ? { ...ch, volume: Math.max(0, Math.min(1, volume)) } : ch
          ),
        })),

      toggleMute: (trackIndex) =>
        set((state) => ({
          channels: state.channels.map((ch, i) =>
            i === trackIndex ? { ...ch, muted: !ch.muted } : ch
          ),
        })),

      setReverbWet: (value) => set({ reverbWet: Math.max(0, Math.min(1, value)) }),

      setDelayWet: (value) => set({ delayWet: Math.max(0, Math.min(1, value)) }),

      setMasterVolume: (volume) => set({ masterVolume: Math.max(0, Math.min(1, volume)) }),

      setAudioReady: (ready) => set({ audioReady: ready }),

      clearPattern: () => set({ pattern: createEmptyPattern() }),
    }),
    {
      name: 'beatforge-studio-state',
      partialize: (state) => ({
        pattern: state.pattern,
        bpm: state.bpm,
        channels: state.channels,
        masterVolume: state.masterVolume,
        reverbWet: state.reverbWet,
        delayWet: state.delayWet,
      }),
    }
  )
);

export { DRUM_ORDER };
