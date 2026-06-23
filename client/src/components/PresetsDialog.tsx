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
  const { setBpm, setPattern } = useDAWStore();

  const handleLoadPreset = (presetId: string) => {
    const preset = PATTERN_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      // Set BPM
      setBpm(preset.bpm);

      // Load pattern atomically
      setPattern(preset.pattern.map((row) => [...row]));

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
        className="panel-surface w-full max-w-lg p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
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

        {/* Preset List */}
        <div className="space-y-2">
          {PATTERN_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleLoadPreset(preset.id)}
              className="w-full panel-inset p-4 text-left transition-all group hover:border-forge-orange/50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-forge-orange transition-colors">
                    {preset.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-forge-cyan font-mono">{preset.bpm} BPM</span>
                  <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-forge-deep">
                    {preset.genre}
                  </span>
                </div>
              </div>

              {/* Pattern Preview */}
              <div className="mt-3 grid grid-cols-16 gap-px">
                {preset.pattern[0].map((active, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-sm ${
                      active ? 'bg-forge-orange/70' : 'bg-forge-deep'
                    }`}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
