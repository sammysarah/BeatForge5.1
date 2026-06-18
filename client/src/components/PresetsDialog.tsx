/**
 * BeatForge Studio – Presets Dialog
 * Load pre-programmed beat patterns
 */

import { PATTERN_PRESETS } from '@/lib/presets';
import { useDAWStore } from '@/lib/store';
import { Music } from 'lucide-react';

interface PresetsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PresetsDialog({ isOpen, onClose }: PresetsDialogProps) {
  const { setBpm, pattern: currentPattern } = useDAWStore();

  const handleLoadPreset = (presetId: string) => {
    const preset = PATTERN_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      // Set BPM
      setBpm(preset.bpm);

      // Load pattern
      const { toggleStep } = useDAWStore.getState();
      
      // Clear current pattern
      for (let track = 0; track < 4; track++) {
        for (let step = 0; step < 16; step++) {
          if (currentPattern[track][step]) {
            toggleStep(track, step);
          }
        }
      }

      // Load new pattern
      for (let track = 0; track < 4; track++) {
        for (let step = 0; step < 16; step++) {
          if (preset.pattern[track][step] && !currentPattern[track][step]) {
            toggleStep(track, step);
          }
        }
      }

      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="panel-surface w-full max-w-2xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-forge-orange" />
            <h3
              className="text-sm font-bold uppercase tracking-widest text-forge-orange"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              Beat Presets
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-lg"
          >
            ×
          </button>
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PATTERN_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleLoadPreset(preset.id)}
              className="panel-inset p-4 text-left hover:border-forge-orange/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-forge-orange transition-colors">
                    {preset.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">{preset.genre}</p>
                </div>
                <span className="text-xs font-mono bg-forge-surface px-2 py-1 rounded text-forge-cyan">
                  {preset.bpm} BPM
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{preset.description}</p>

              {/* Visual pattern preview */}
              <div className="mt-3 flex gap-1">
                {preset.pattern.map((track, trackIdx) => (
                  <div key={trackIdx} className="flex-1 flex flex-col gap-0.5">
                    {track.map((step, stepIdx) => (
                      <div
                        key={stepIdx}
                        className={`h-1 rounded-[1px] ${
                          step ? 'bg-forge-orange' : 'bg-forge-deep'
                        }`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
