/**
 * BeatForge Studio – Drum Kit Selector
 * Choose between different drum sound kits
 */

import { DRUM_KITS } from '@/lib/drumKits';
import { useDAWStore } from '@/lib/store';
import { Disc3 } from 'lucide-react';

interface DrumKitSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DrumKitSelector({ isOpen, onClose }: DrumKitSelectorProps) {
  const { activeDrumKit, setActiveDrumKit } = useDAWStore();

  const handleSelectKit = (kitId: string) => {
    setActiveDrumKit(kitId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="panel-surface w-full max-w-md p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Disc3 className="w-5 h-5 text-forge-orange" />
            <h3
              className="text-sm font-bold uppercase tracking-widest text-forge-orange"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              Drum Kits
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-lg"
          >
            ×
          </button>
        </div>

        {/* Kit List */}
        <div className="space-y-2">
          {DRUM_KITS.map((kit) => (
            <button
              key={kit.id}
              onClick={() => handleSelectKit(kit.id)}
              className={`w-full panel-inset p-4 text-left transition-all group ${
                activeDrumKit === kit.id
                  ? 'border-forge-orange/70 bg-forge-surface'
                  : 'hover:border-forge-orange/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-forge-orange transition-colors">
                    {kit.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">{kit.description}</p>
                </div>
                {activeDrumKit === kit.id && (
                  <div className="w-2 h-2 rounded-full bg-forge-orange mt-1 flex-shrink-0" />
                )}
              </div>

              {/* Specs */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                <div>
                  <span className="block text-forge-cyan">Kick</span>
                  <span>{kit.kickConfig.pitchDecay}s decay</span>
                </div>
                <div>
                  <span className="block text-forge-cyan">Snare</span>
                  <span>{kit.snareConfig.brightness}% bright</span>
                </div>
                <div>
                  <span className="block text-forge-cyan">HiHat</span>
                  <span>{kit.hihatConfig.resonance}Hz res</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
