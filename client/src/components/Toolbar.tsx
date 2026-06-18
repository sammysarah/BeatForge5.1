/**
 * BeatForge Studio – Toolbar
 * Transport controls: Play/Stop, BPM, Export
 * Design: Neon Circuit – Hardware panel aesthetic
 */

import { Play, Square, Download, Trash2, Usb, Music, Disc3, Zap, Save, Mic } from 'lucide-react';
import { useDAWStore } from '@/lib/store';
import { useAudio } from '@/hooks/useAudio';
import { useCallback, useState } from 'react';
import { MidiSettings } from './MidiSettings';
import { PresetsDialog } from './PresetsDialog';
import { DrumKitSelector } from './DrumKitSelector';
import { SamplerDialog } from './SamplerDialog';
import { PatternManager } from './PatternManager';
import { UndoRedoButtons } from './UndoRedoButtons';
import { LoopRecorder } from './LoopRecorder';

export function Toolbar() {
  const { isPlaying, bpm, setBpm, togglePlayback, stop, clearPattern, audioReady } = useDAWStore();
  const { initAudio, exportWAV } = useAudio();
  const [midiOpen, setMidiOpen] = useState(false);
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [kitOpen, setKitOpen] = useState(false);
  const [samplerOpen, setSamplerOpen] = useState(false);
  const [patternManagerOpen, setPatternManagerOpen] = useState(false);
  const [loopRecorderOpen, setLoopRecorderOpen] = useState(false);

  const handlePlay = useCallback(async () => {
    await initAudio();
    togglePlayback();
  }, [initAudio, togglePlayback]);

  const handleStop = useCallback(() => {
    stop();
  }, [stop]);

  const handleExport = useCallback(async () => {
    await initAudio();
    const blob = await exportWAV();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `beatforge-export-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [initAudio, exportWAV]);

  return (
    <div className="panel-surface px-4 py-3 flex items-center gap-4">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663758346396/CLdCVJph9FshgRHu4B3M5H/beatforge-logo-8gPbCPReEmEDRnmTwbsu9W.webp"
          alt="BeatForge"
          className="w-8 h-8"
        />
        <h1 className="text-lg font-bold tracking-wider text-forge-orange" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          BEATFORGE
        </h1>
      </div>

      {/* Transport Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePlay}
          className={`w-10 h-10 rounded flex items-center justify-center transition-all duration-100 active:scale-95 ${
            isPlaying
              ? 'bg-forge-orange text-white pad-glow'
              : 'bg-forge-surface border border-forge-border text-forge-orange hover:bg-forge-medium'
          }`}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          <Play className="w-5 h-5" fill={isPlaying ? 'currentColor' : 'none'} />
        </button>

        <button
          onClick={handleStop}
          className="w-10 h-10 rounded flex items-center justify-center bg-forge-surface border border-forge-border text-muted-foreground hover:text-foreground hover:bg-forge-medium transition-all duration-100 active:scale-95"
          title="Stop"
        >
          <Square className="w-4 h-4" fill="currentColor" />
        </button>
      </div>

      {/* BPM Control */}
      <div className="flex items-center gap-2 ml-4">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">BPM</span>
        <div className="panel-inset px-3 py-1.5 flex items-center gap-1">
          <button
            onClick={() => setBpm(bpm - 1)}
            className="text-muted-foreground hover:text-forge-orange transition-colors text-sm font-bold"
          >
            -
          </button>
          <input
            type="number"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-12 bg-transparent text-center text-forge-cyan font-bold text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min={60}
            max={200}
          />
          <button
            onClick={() => setBpm(bpm + 1)}
            className="text-muted-foreground hover:text-forge-orange transition-colors text-sm font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Audio Status */}
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${audioReady ? 'bg-green-500' : 'bg-muted-foreground'}`} />
        <span className="text-xs text-muted-foreground">
          {audioReady ? 'AUDIO' : 'CLICK TO START'}
        </span>
      </div>

      {/* Undo/Redo */}
      <UndoRedoButtons />

      {/* Action Buttons */}
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => setLoopRecorderOpen(true)}
          className="w-9 h-9 rounded flex items-center justify-center bg-forge-surface border border-forge-border text-muted-foreground hover:text-red-400 hover:border-red-400/50 transition-all duration-100 active:scale-95"
          title="Loop Recorder"
        >
          <Mic className="w-4 h-4" />
        </button>

        <button
          onClick={() => setPresetsOpen(true)}
          className="w-9 h-9 rounded flex items-center justify-center bg-forge-surface border border-forge-border text-muted-foreground hover:text-forge-orange hover:border-forge-orange/50 transition-all duration-100 active:scale-95"
          title="Beat Presets"
        >
          <Music className="w-4 h-4" />
        </button>

        <button
          onClick={() => setKitOpen(true)}
          className="w-9 h-9 rounded flex items-center justify-center bg-forge-surface border border-forge-border text-muted-foreground hover:text-yellow-400 hover:border-yellow-400/50 transition-all duration-100 active:scale-95"
          title="Drum Kits"
        >
          <Disc3 className="w-4 h-4" />
        </button>

        <button
          onClick={() => setSamplerOpen(true)}
          className="w-9 h-9 rounded flex items-center justify-center bg-forge-surface border border-forge-border text-muted-foreground hover:text-purple-400 hover:border-purple-400/50 transition-all duration-100 active:scale-95"
          title="Sampler"
        >
          <Zap className="w-4 h-4" />
        </button>

        <button
          onClick={() => setMidiOpen(true)}
          className="w-9 h-9 rounded flex items-center justify-center bg-forge-surface border border-forge-border text-muted-foreground hover:text-forge-cyan hover:border-forge-cyan/50 transition-all duration-100 active:scale-95"
          title="MIDI Controller"
        >
          <Usb className="w-4 h-4" />
        </button>

        <button
          onClick={clearPattern}
          className="w-9 h-9 rounded flex items-center justify-center bg-forge-surface border border-forge-border text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-all duration-100 active:scale-95"
          title="Pattern löschen"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => setPatternManagerOpen(true)}
          className="h-9 px-3 rounded flex items-center gap-2 bg-forge-surface border border-forge-border text-muted-foreground hover:text-forge-orange hover:border-forge-orange/50 transition-all duration-100 active:scale-95"
          title="Pattern speichern/laden"
        >
          <Save className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider hidden sm:inline">Save</span>
        </button>

        <button
          onClick={handleExport}
          className="h-9 px-3 rounded flex items-center gap-2 bg-forge-surface border border-forge-border text-muted-foreground hover:text-forge-cyan hover:border-forge-cyan/50 transition-all duration-100 active:scale-95"
          title="Als Audio exportieren"
        >
          <Download className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider hidden sm:inline">Export</span>
        </button>
      </div>

      {/* MIDI Settings Dialog */}
      <MidiSettings isOpen={midiOpen} onClose={() => setMidiOpen(false)} />

      {/* Presets Dialog */}
      <PresetsDialog isOpen={presetsOpen} onClose={() => setPresetsOpen(false)} />

      {/* Drum Kit Selector */}
      <DrumKitSelector isOpen={kitOpen} onClose={() => setKitOpen(false)} />

      {/* Sampler Dialog */}
      <SamplerDialog isOpen={samplerOpen} onClose={() => setSamplerOpen(false)} />

      {/* Pattern Manager */}
      <PatternManager isOpen={patternManagerOpen} onClose={() => setPatternManagerOpen(false)} />

      {/* Loop Recorder */}
      <LoopRecorder isOpen={loopRecorderOpen} onClose={() => setLoopRecorderOpen(false)} />
    </div>
  );
}
