/**
 * BeatForge Studio – Keyboard Shortcuts Hook
 * Provides keyboard shortcuts for common DAW actions
 */

import { useEffect } from 'react';
import { useDAWStore } from '@/lib/store';
import { useAudio } from './useAudio';

export function useKeyboardShortcuts() {
  const { togglePlayback, stop, undo, redo, clearPattern, setBpm, bpm, audioReady } = useDAWStore();
  const { initAudio } = useAudio();

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Ignore shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      switch (e.key) {
        case ' ':
          // Space: Play/Pause
          e.preventDefault();
          await initAudio();
          togglePlayback();
          break;

        case 'Escape':
          // Escape: Stop
          e.preventDefault();
          stop();
          break;

        case 'z':
          if (isCtrlOrCmd && !e.shiftKey) {
            // Ctrl+Z: Undo
            e.preventDefault();
            undo();
          } else if (isCtrlOrCmd && e.shiftKey) {
            // Ctrl+Shift+Z: Redo
            e.preventDefault();
            redo();
          }
          break;

        case 'y':
          if (isCtrlOrCmd) {
            // Ctrl+Y: Redo
            e.preventDefault();
            redo();
          }
          break;

        case 'Delete':
        case 'Backspace':
          if (isCtrlOrCmd) {
            // Ctrl+Delete/Backspace: Clear pattern
            e.preventDefault();
            clearPattern();
          }
          break;

        case '+':
        case '=':
          if (!isCtrlOrCmd) {
            // +: Increase BPM
            e.preventDefault();
            setBpm(bpm + 1);
          }
          break;

        case '-':
          if (!isCtrlOrCmd) {
            // -: Decrease BPM
            e.preventDefault();
            setBpm(bpm - 1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayback, stop, undo, redo, clearPattern, setBpm, bpm, audioReady, initAudio]);
}
