/**
 * BeatForge Studio – Loop Recorder
 * Record and overdub multiple takes
 */

import { Mic, Square, Play, Trash2, Volume2 } from 'lucide-react';
import { useLoopRecorder } from '@/hooks/useLoopRecorder';
import { useDAWStore } from '@/lib/store';
import { useState } from 'react';

interface LoopRecorderProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoopRecorder({ isOpen, onClose }: LoopRecorderProps) {
  const { bpm } = useDAWStore();
  const { isRecording, takes, startRecording, stopRecording, playTake, removeTake, setTakeVolume, toggleTakeMute } = useLoopRecorder((60 / bpm) * 4);
  const [loopBars, setLoopBars] = useState(4);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="panel-surface w-full max-w-md p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-forge-orange" />
            <h3
              className="text-sm font-bold uppercase tracking-widest text-forge-orange"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              Loop Recorder
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-lg"
          >
            ×
          </button>
        </div>

        {/* Loop Settings */}
        <div className="mb-4">
          <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
            Loop Länge (Takte)
          </label>
          <select
            value={loopBars}
            onChange={(e) => setLoopBars(Number(e.target.value))}
            className="w-full panel-inset px-3 py-2 text-sm bg-transparent border border-forge-border rounded text-foreground"
          >
            <option value={1} className="bg-forge-surface">1 Takt</option>
            <option value={2} className="bg-forge-surface">2 Takte</option>
            <option value={4} className="bg-forge-surface">4 Takte</option>
            <option value={8} className="bg-forge-surface">8 Takte</option>
          </select>
        </div>

        {/* Recording Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-full h-12 rounded flex items-center justify-center gap-2 font-semibold transition-all mb-4 ${
            isRecording
              ? 'bg-destructive/80 border border-destructive text-destructive-foreground hover:bg-destructive'
              : 'bg-forge-surface border border-forge-border text-muted-foreground hover:text-forge-orange hover:border-forge-orange/50'
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-4 h-4 animate-pulse" />
              AUFNAHME LÄUFT...
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              AUFNAHME STARTEN
            </>
          )}
        </button>

        {/* Takes List */}
        <div className="space-y-2">
          <h4 className="text-xs text-muted-foreground uppercase tracking-wider">
            Aufnahmen ({takes.length})
          </h4>
          {takes.length === 0 ? (
            <div className="panel-inset p-4 text-center text-xs text-muted-foreground">
              Keine Aufnahmen vorhanden
            </div>
          ) : (
            takes.map((take) => (
              <div
                key={take.id}
                className="panel-inset p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{take.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {take.buffer.duration.toFixed(2)}s
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playTake(take.id)}
                      className="w-8 h-8 rounded flex items-center justify-center bg-forge-surface border border-forge-border text-forge-cyan hover:border-forge-cyan/50 transition-all"
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                    <button
                      onClick={() => toggleTakeMute(take.id)}
                      className={`w-8 h-8 rounded flex items-center justify-center border transition-all ${
                        take.muted
                          ? 'bg-destructive/20 border-destructive/50 text-destructive'
                          : 'bg-forge-surface border-forge-border text-muted-foreground'
                      }`}
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeTake(take.id)}
                      className="w-8 h-8 rounded flex items-center justify-center bg-destructive/20 border border-destructive/50 text-destructive hover:bg-destructive/30 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Volume Slider */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={take.volume * 100}
                  onChange={(e) => setTakeVolume(take.id, Number(e.target.value) / 100)}
                  className="w-full h-1 bg-forge-deep rounded appearance-none cursor-pointer"
                />
              </div>
            ))
          )}
        </div>

        {/* Info */}
        <div className="mt-4 p-3 panel-inset text-xs text-muted-foreground">
          <p>
            Mehrfach über die gleiche Loop aufnehmen um Overdubs zu erstellen. Jede Aufnahme kann einzeln gesteuert werden.
          </p>
        </div>
      </div>
    </div>
  );
}
