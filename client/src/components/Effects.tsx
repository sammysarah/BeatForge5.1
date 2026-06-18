/**
 * BeatForge Studio – Effects Panel
 * Reverb and Delay controls with visual feedback
 * Design: Neon Circuit – Knob-style controls
 */

import { useDAWStore } from '@/lib/store';

export function Effects() {
  const { reverbWet, delayWet, setReverbWet, setDelayWet } = useDAWStore();

  return (
    <div className="panel-surface p-4 h-full">
      {/* Header */}
      <h2
        className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        Effects
      </h2>

      <div className="space-y-6">
        {/* Reverb */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-forge-cyan">
              Reverb
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {Math.round(reverbWet * 100)}%
            </span>
          </div>
          <div className="panel-inset p-2">
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(reverbWet * 100)}
              onChange={(e) => setReverbWet(Number(e.target.value) / 100)}
              className="w-full h-2 accent-[#00E5FF] cursor-pointer"
            />
          </div>
          {/* Visual feedback bar */}
          <div className="h-1 rounded-full bg-forge-deep overflow-hidden">
            <div
              className="h-full rounded-full bg-forge-cyan transition-all duration-100"
              style={{ width: `${reverbWet * 100}%` }}
            />
          </div>
        </div>

        {/* Delay */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-forge-orange">
              Delay
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {Math.round(delayWet * 100)}%
            </span>
          </div>
          <div className="panel-inset p-2">
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(delayWet * 100)}
              onChange={(e) => setDelayWet(Number(e.target.value) / 100)}
              className="w-full h-2 accent-[#FF6B00] cursor-pointer"
            />
          </div>
          {/* Visual feedback bar */}
          <div className="h-1 rounded-full bg-forge-deep overflow-hidden">
            <div
              className="h-full rounded-full bg-forge-orange transition-all duration-100"
              style={{ width: `${delayWet * 100}%` }}
            />
          </div>
        </div>

        {/* Effect visualization */}
        <div className="panel-inset p-3 mt-4">
          <div className="flex items-end justify-center gap-1 h-16">
            {Array.from({ length: 16 }, (_, i) => {
              const reverbHeight = Math.sin((i / 16) * Math.PI) * reverbWet * 100;
              const delayHeight = Math.cos((i / 8) * Math.PI) * delayWet * 50 + 20;
              const height = Math.max(4, (reverbHeight + delayHeight) / 2);

              return (
                <div
                  key={i}
                  className="w-1.5 rounded-full transition-all duration-200"
                  style={{
                    height: `${height}%`,
                    background: `linear-gradient(to top, #FF6B00, #00E5FF)`,
                    opacity: 0.6 + (height / 100) * 0.4,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
