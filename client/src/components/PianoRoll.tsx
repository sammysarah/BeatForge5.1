/**
 * BeatForge Studio – Piano Roll Editor
 * Note sequencer for melodic bass lines
 */

import { useState, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const NOTES = ['C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3'];
const NOTE_FREQUENCIES: Record<string, number> = {
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

interface PianoRollProps {
  notes: (string | null)[];
  onNoteChange: (step: number, note: string | null) => void;
  onTriggerNote: (note: string) => void;
  currentStep: number;
}

export function PianoRoll({ notes, onNoteChange, onTriggerNote, currentStep }: PianoRollProps) {
  const [octaveOffset, setOctaveOffset] = useState(0);

  const handleNoteClick = useCallback(
    (step: number, note: string) => {
      if (notes[step] === note) {
        onNoteChange(step, null);
      } else {
        onNoteChange(step, note);
        onTriggerNote(note);
      }
    },
    [notes, onNoteChange, onTriggerNote]
  );

  const visibleNotes = NOTES.slice(octaveOffset, octaveOffset + 8);

  return (
    <div className="panel-surface p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-sm font-semibold uppercase tracking-widest text-muted-foreground"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          Piano Roll (Bass)
        </h2>

        {/* Octave Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOctaveOffset(Math.max(0, octaveOffset - 1))}
            className="w-6 h-6 rounded flex items-center justify-center bg-forge-surface border border-forge-border text-muted-foreground hover:text-foreground transition-colors"
            disabled={octaveOffset === 0}
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          <span className="text-xs text-muted-foreground font-mono w-8 text-center">
            Oct {octaveOffset + 1}
          </span>
          <button
            onClick={() => setOctaveOffset(Math.min(4, octaveOffset + 1))}
            className="w-6 h-6 rounded flex items-center justify-center bg-forge-surface border border-forge-border text-muted-foreground hover:text-foreground transition-colors"
            disabled={octaveOffset === 4}
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Piano Roll Grid */}
      <div className="flex gap-3">
        {/* Note Labels */}
        <div className="flex flex-col gap-1 justify-center">
          {visibleNotes.map((note) => (
            <div
              key={note}
              className="h-8 flex items-center justify-end pr-2 text-xs font-mono text-muted-foreground"
            >
              {note}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 flex flex-col gap-1">
          {visibleNotes.map((note) => (
            <div
              key={note}
              className="flex gap-1 h-8"
              style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}
            >
              {Array.from({ length: 16 }, (_, stepIdx) => {
                const isActive = notes[stepIdx] === note;
                const isCurrentStep = stepIdx === currentStep;

                return (
                  <button
                    key={stepIdx}
                    onClick={() => handleNoteClick(stepIdx, note)}
                    className={`
                      flex-1 rounded-sm transition-all duration-75 active:scale-90
                      ${isActive
                        ? 'bg-forge-cyan shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                        : isCurrentStep
                        ? 'bg-forge-surface border border-forge-cyan/40'
                        : stepIdx % 4 === 0
                        ? 'bg-forge-deep border border-forge-border/80'
                        : 'bg-forge-deep border border-forge-border/40'
                      }
                      ${isCurrentStep && isActive ? 'scale-105' : ''}
                      hover:border-forge-cyan/50
                    `}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 text-xs text-muted-foreground">
        {notes.some((n) => n !== null) ? (
          <span>
            {notes.filter((n) => n !== null).length} Note(n) programmiert
          </span>
        ) : (
          <span>Klicke auf die Pads um Noten zu programmieren</span>
        )}
      </div>
    </div>
  );
}
