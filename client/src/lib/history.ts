/**
 * BeatForge Studio – Undo/Redo History Manager
 * Track state changes for undo/redo functionality
 */

import type { DrumType } from './audioEngine';

export interface HistoryState {
  pattern: boolean[][];
  bassNotes: (string | null)[];
  bpm: number;
  channels: Array<{
    id: DrumType;
    name: string;
    volume: number;
    muted: boolean;
    solo: boolean;
  }>;
  effects: {
    reverbWet: number;
    delayWet: number;
  };
}

export class HistoryManager {
  private history: HistoryState[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number = 50;

  push(state: HistoryState): void {
    // Deduplicate: don't push if identical to current state
    if (this.currentIndex >= 0) {
      const current = this.history[this.currentIndex];
      if (JSON.stringify(current) === JSON.stringify(state)) {
        return;
      }
    }

    // Remove any future history if we're not at the end
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    // Add new state
    this.history.push(JSON.parse(JSON.stringify(state)));
    this.currentIndex++;

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  undo(): HistoryState | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
    }
    return null;
  }

  redo(): HistoryState | null {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
    }
    return null;
  }

  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  getHistorySize(): number {
    return this.history.length;
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }
}

export const historyManager = new HistoryManager();
