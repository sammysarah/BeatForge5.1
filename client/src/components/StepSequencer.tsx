/**
 * BeatForge Studio – Step Sequencer
 * 4 tracks x 16 steps grid with glowing pads
 * Design: Neon Circuit – Luminous interaction, hardware fidelity
 */

import { useDAWStore, DRUM_ORDER } from '@/lib/store';
import { useAudio } from '@/hooks/useAudio';
import { useCallback } from 'react';

const TRACK_COLORS = {
  kick: { active: 'bg-forge-orange pad-glow', label: 'text-forge-orange' },
  snare: { active: 'bg-forge-cyan pad-glow-cyan', label: 'text-forge-cyan' },
  hihat: { active: 'bg-yellow-400 shadow-[0_0_12px_2px_rgba(250,204,21,0.6)]', label: 'text-yellow-400' },
  bass: { active: 'bg-purple-500 shadow-[0_0_12px_2px_rgba(168,85,247,0.6)]', label: 'text-purple-500' },
};

export function StepSequencer() {
  const { pattern, currentStep, channels, toggleStep } = useDAWStore();
  const { initAudio, triggerDrum } = useAudio();

  const handlePadClick = useCallback(
    async (track: number, step: number) => {
      await initAudio();
      toggleStep(track, step);
      // Preview sound when activating
      if (!pattern[track][step]) {
        triggerDrum(track);
      }
    },
    [initAudio, toggleStep, pattern, triggerDrum]
  );

  return (
    <div className="panel-surface p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
        <h2
          className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-muted-foreground"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          Step Sequencer
        </h2>
        {/* Step indicators */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 16 }, (_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-75 ${
                i === currentStep
                  ? 'bg-forge-cyan scale-150'
                  : i % 4 === 0
                  ? 'bg-muted-foreground/60'
                  : 'bg-muted-foreground/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-1 sm:space-y-2">
        {DRUM_ORDER.map((drumType, trackIndex) => {
          const colors = TRACK_COLORS[drumType];
          const channel = channels[trackIndex];

          return (
            <div key={drumType} className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1">
              {/* Track label */}
              <div className="w-12 sm:w-16 flex-shrink-0">
                <button
                  onClick={() => {
                    initAudio();
                    triggerDrum(trackIndex);
                  }}
                  className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${colors.label} hover:opacity-80 transition-opacity active:scale-95`}
                >
                  <span className="hidden sm:inline">{channel.name}</span>
                  <span className="sm:hidden">{channel.name.substring(0, 2)}</span>
                </button>
              </div>

              {/* Steps */}
              <div
                className="flex-1 grid gap-0.5 sm:gap-1 min-w-0"
                style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}
              >
                {Array.from({ length: 16 }, (_, stepIndex) => {
                  const isActive = pattern[trackIndex][stepIndex];
                  const isCurrentStep = stepIndex === currentStep;
                  const isBeatStart = stepIndex % 4 === 0;

                  return (
                    <button
                      key={stepIndex}
                      onClick={() => handlePadClick(trackIndex, stepIndex)}
                      className={`
                        w-8 h-8 sm:w-10 sm:h-10 rounded-sm transition-all duration-75 active:scale-90 touch-manipulation
                        ${isActive
                          ? colors.active
                          : isCurrentStep
                          ? 'bg-forge-surface border border-forge-cyan/40'
                          : isBeatStart
                          ? 'bg-forge-surface border border-forge-border/80'
                          : 'bg-forge-deep border border-forge-border/40'
                        }
                        ${isCurrentStep && isActive ? 'scale-105' : ''}
                        ${channel.muted ? 'opacity-30' : ''}
                        hover:border-forge-orange/50 sm:hover:border-forge-orange/50
                      `}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
