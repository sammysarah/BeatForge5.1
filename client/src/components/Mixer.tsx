/**
 * BeatForge Studio – Mixer
 * Channel strips with volume faders and mute buttons
 * Design: Neon Circuit – VU-meter inspired, hardware fidelity
 */

import { useDAWStore } from '@/lib/store';
import { Volume2, VolumeX } from 'lucide-react';

const CHANNEL_COLORS = ['#FF6B00', '#00E5FF', '#FACC15', '#A855F7'];

export function Mixer() {
  const { channels, masterVolume, setChannelVolume, toggleMute, setMasterVolume } = useDAWStore();

  return (
    <div className="panel-surface p-4 h-full">
      {/* Header */}
      <h2
        className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        Mixer
      </h2>

      {/* Channel Strips */}
      <div className="flex gap-3 justify-center">
        {channels.map((channel, index) => (
          <div key={channel.id} className="flex flex-col items-center gap-2">
            {/* Channel name */}
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: CHANNEL_COLORS[index] }}
            >
              {channel.name}
            </span>

            {/* Volume meter visualization */}
            <div className="panel-inset w-8 h-32 relative flex flex-col-reverse items-center p-1 gap-0.5">
              {Array.from({ length: 10 }, (_, i) => {
                const threshold = (i + 1) / 10;
                const isLit = channel.volume >= threshold && !channel.muted;
                const color =
                  i >= 8
                    ? 'bg-red-500'
                    : i >= 6
                    ? 'bg-yellow-400'
                    : `bg-[${CHANNEL_COLORS[index]}]`;

                return (
                  <div
                    key={i}
                    className={`w-full h-full rounded-[2px] transition-all duration-100 ${
                      isLit
                        ? i >= 8
                          ? 'bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]'
                          : i >= 6
                          ? 'bg-yellow-400 shadow-[0_0_4px_rgba(250,204,21,0.5)]'
                          : 'shadow-[0_0_4px_rgba(255,107,0,0.3)]'
                        : 'bg-forge-deep'
                    }`}
                    style={
                      isLit && i < 6
                        ? { backgroundColor: CHANNEL_COLORS[index], opacity: 0.9 }
                        : undefined
                    }
                  />
                );
              })}
            </div>

            {/* Volume slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(channel.volume * 100)}
              onChange={(e) => setChannelVolume(index, Number(e.target.value) / 100)}
              className="w-24 h-2 -rotate-0 accent-forge-orange cursor-pointer"
              style={{ writingMode: 'vertical-lr', direction: 'rtl', width: '2rem', height: '4rem' }}
            />

            {/* Mute button */}
            <button
              onClick={() => toggleMute(index)}
              className={`w-8 h-8 rounded flex items-center justify-center transition-all duration-100 active:scale-90 ${
                channel.muted
                  ? 'bg-destructive/20 border border-destructive/50 text-destructive'
                  : 'bg-forge-surface border border-forge-border text-muted-foreground hover:text-foreground'
              }`}
              title={channel.muted ? 'Unmute' : 'Mute'}
            >
              {channel.muted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Volume value */}
            <span className="text-[10px] text-muted-foreground font-mono">
              {Math.round(channel.volume * 100)}%
            </span>
          </div>
        ))}

        {/* Master Volume */}
        <div className="flex flex-col items-center gap-2 ml-4 pl-4 border-l border-forge-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">
            Master
          </span>

          <div className="panel-inset w-8 h-32 relative flex flex-col-reverse items-center p-1 gap-0.5">
            {Array.from({ length: 10 }, (_, i) => {
              const threshold = (i + 1) / 10;
              const isLit = masterVolume >= threshold;
              return (
                <div
                  key={i}
                  className={`w-full h-full rounded-[2px] transition-all duration-100 ${
                    isLit
                      ? i >= 8
                        ? 'bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]'
                        : i >= 6
                        ? 'bg-yellow-400 shadow-[0_0_4px_rgba(250,204,21,0.5)]'
                        : 'bg-forge-orange shadow-[0_0_4px_rgba(255,107,0,0.3)]'
                      : 'bg-forge-deep'
                  }`}
                />
              );
            })}
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(masterVolume * 100)}
            onChange={(e) => setMasterVolume(Number(e.target.value) / 100)}
            className="w-24 h-2 accent-forge-orange cursor-pointer"
            style={{ writingMode: 'vertical-lr', direction: 'rtl', width: '2rem', height: '4rem' }}
          />

          <span className="text-[10px] text-muted-foreground font-mono">
            {Math.round(masterVolume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
