/**
 * BeatForge Studio – Undo/Redo Buttons
 * Undo and redo changes with keyboard shortcuts
 */

import { RotateCcw, RotateCw } from 'lucide-react';
import { useDAWStore } from '@/lib/store';
import { useEffect } from 'react';

export function UndoRedoButtons() {
  const { canUndo, canRedo, undo, redo } = useDAWStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Ctrl+Shift+Z or Cmd+Shift+Z for redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'y') && e.shiftKey) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={undo}
        disabled={!canUndo}
        className="w-8 h-8 rounded flex items-center justify-center bg-forge-surface border border-forge-border text-muted-foreground hover:text-forge-cyan hover:border-forge-cyan/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        title="Undo (Ctrl+Z)"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className="w-8 h-8 rounded flex items-center justify-center bg-forge-surface border border-forge-border text-muted-foreground hover:text-forge-cyan hover:border-forge-cyan/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        title="Redo (Ctrl+Shift+Z)"
      >
        <RotateCw className="w-4 h-4" />
      </button>
    </div>
  );
}
