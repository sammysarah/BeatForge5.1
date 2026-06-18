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

  // Piano Roll (Bass notes)
  bassNotes: (string | null)[];

  // Drum Kit selection
  activeDrumKit: string;

  // Undo/Redo state
  canUndo: boolean;
  canRedo: boolean;

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
  setBassNote: (step: number, note: string | null) => void;
  setActiveDrumKit: (kitId: string) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
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
      bassNotes: Array(16).fill(null),
      activeDrumKit: 'classic-808',
      canUndo: false,
      canRedo: false,
      audioReady: false,

      // Actions
      togglePlayback: () => {
        set((state) => ({ isPlaying: !state.isPlaying }));
        setTimeout(() => {
          useDAWStore.getState().pushHistory();
        }, 0);
      },

      stop: () => {
        set({ isPlaying: false, currentStep: -1 });
        setTimeout(() => {
          useDAWStore.getState().pushHistory();
        }, 0);
      },

      setBpm: (bpm) => {
        set({ bpm: Math.max(60, Math.min(200, bpm)) });
        setTimeout(() => {
          useDAWStore.getState().pushHistory();
        }, 0);
      },

      setCurrentStep: (step) => set({ currentStep: step }),

      toggleStep: (track, step) =>
        set((state) => {
          const newPattern = state.pattern.map((row) => [...row]);
          newPattern[track][step] = !newPattern[track][step];
          setTimeout(() => {
            useDAWStore.getState().pushHistory();
          }, 0);
          return { pattern: newPattern };
        }),

      setChannelVolume: (trackIndex, volume) =>
        set((state) => {
          setTimeout(() => {
            useDAWStore.getState().pushHistory();
          }, 0);
          return {
            channels: state.channels.map((ch, i) =>
              i === trackIndex ? { ...ch, volume: Math.max(0, Math.min(1, volume)) } : ch
            ),
          };
        }),

      toggleMute: (trackIndex) =>
        set((state) => {
          setTimeout(() => {
            useDAWStore.getState().pushHistory();
          }, 0);
          return {
            channels: state.channels.map((ch, i) =>
              i === trackIndex ? { ...ch, muted: !ch.muted } : ch
            ),
          };
        }),

      setReverbWet: (value) => {
        set({ reverbWet: Math.max(0, Math.min(1, value)) });
        setTimeout(() => {
          useDAWStore.getState().pushHistory();
        }, 0);
      },

      setDelayWet: (value) => {
        set({ delayWet: Math.max(0, Math.min(1, value)) });
        setTimeout(() => {
          useDAWStore.getState().pushHistory();
        }, 0);
      },

      setMasterVolume: (volume) => {
        set({ masterVolume: Math.max(0, Math.min(1, volume)) });
        setTimeout(() => {
          useDAWStore.getState().pushHistory();
        }, 0);
      },

      setAudioReady: (ready) => set({ audioReady: ready }),

      clearPattern: () => {
        set({ pattern: createEmptyPattern() });
        setTimeout(() => {
          useDAWStore.getState().pushHistory();
        }, 0);
      },

      setBassNote: (step, note) =>
        set((state) => {
          const newNotes = [...state.bassNotes];
          newNotes[step] = note;
          setTimeout(() => {
            useDAWStore.getState().pushHistory();
          }, 0);
          return { bassNotes: newNotes };
        }),

      setActiveDrumKit: (kitId) => {
        set({ activeDrumKit: kitId });
        setTimeout(() => {
          useDAWStore.getState().pushHistory();
        }, 0);
      },

      pushHistory: () => {
        const state = useDAWStore.getState();
        const { historyManager } = require('@/lib/history');
        historyManager.push({
          pattern: state.pattern,
          bassNotes: state.bassNotes,
          bpm: state.bpm,
          channels: state.channels,
          effects: {
            reverbWet: state.reverbWet,
            delayWet: state.delayWet,
          },
        });
        set({
          canUndo: historyManager.canUndo(),
          canRedo: historyManager.canRedo(),
        });
      },

      undo: () => {
        const { historyManager } = require('@/lib/history');
        const undoState = historyManager.undo();
        if (undoState) {
          set({
            pattern: undoState.pattern,
            bassNotes: undoState.bassNotes,
            bpm: undoState.bpm,
            channels: undoState.channels,
            reverbWet: undoState.effects.reverbWet,
            delayWet: undoState.effects.delayWet,
            canUndo: historyManager.canUndo(),
            canRedo: historyManager.canRedo(),
          });
        }
      },

      redo: () => {
        const { historyManager } = require('@/lib/history');
        const redoState = historyManager.redo();
        if (redoState) {
          set({
            pattern: redoState.pattern,
            bassNotes: redoState.bassNotes,
            bpm: redoState.bpm,
            channels: redoState.channels,
            reverbWet: redoState.effects.reverbWet,
            delayWet: redoState.effects.delayWet,
            canUndo: historyManager.canUndo(),
            canRedo: historyManager.canRedo(),
          });
        }
      },
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
        bassNotes: state.bassNotes,
        activeDrumKit: state.activeDrumKit,
        canUndo: state.canUndo,
        canRedo: state.canRedo,
      }),
    }
  )
);

// Initialize history manager
const { historyManager } = require('@/lib/history');

export const DRUM_KITS_EXPORT = {
  'classic-808': 'Classic 808',
  'acoustic-kit': 'Acoustic',
  'lofi-kit': 'Lo-Fi',
  'deep-house': 'Deep House',
  'trap-kit': 'Trap',
};

export const NOTE_FREQUENCIES: Record<string, number> = {
  'C2': 65.41,
  'D2': 73.42,
  'E2': 82.41,
  'F2': 87.31,
  'G2': 98.00,
  'A2': 110.00,
  'B2': 123.47,
  'C3': 130.81,
  'D3': 146.83,
  'E3': 164.81,
  'F3': 174.61,
  'G3': 196.00,
};

export { DRUM_ORDER };
