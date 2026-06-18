/**
 * BeatForge Studio – Pattern Manager
 * Save, load, export, and share beat patterns
 */

import { Save, Download, Upload, Copy, Clipboard } from 'lucide-react';
import { useRef, useState, useCallback } from 'react';
import { useDAWStore } from '@/lib/store';
import {
  exportPattern,
  downloadPattern,
  importPattern,
  copyPatternToClipboard,
  pastePatternFromClipboard,
} from '@/lib/patternIO';
import { toast } from 'sonner';

interface PatternManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PatternManager({ isOpen, onClose }: PatternManagerProps) {
  const {
    pattern,
    bassNotes,
    bpm,
    channels,
    reverbWet,
    delayWet,
    activeDrumKit,
    setBpm,
    toggleStep,
    setBassNote,
    setChannelVolume,
    toggleMute,
    setReverbWet,
    setDelayWet,
    setActiveDrumKit,
  } = useDAWStore();

  const [patternName, setPatternName] = useState('My Beat');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(() => {
    const data = exportPattern(
      patternName,
      bpm,
      pattern,
      bassNotes,
      channels,
      reverbWet,
      delayWet,
      activeDrumKit
    );
    downloadPattern(data);
    toast.success('Pattern exportiert!');
  }, [patternName, bpm, pattern, bassNotes, channels, reverbWet, delayWet, activeDrumKit]);

  const handleCopyToClipboard = useCallback(async () => {
    const data = exportPattern(
      patternName,
      bpm,
      pattern,
      bassNotes,
      channels,
      reverbWet,
      delayWet,
      activeDrumKit
    );
    await copyPatternToClipboard(data);
    toast.success('Pattern in Zwischenablage kopiert!');
  }, [patternName, bpm, pattern, bassNotes, channels, reverbWet, delayWet, activeDrumKit]);

  const handlePasteFromClipboard = useCallback(async () => {
    const data = await pastePatternFromClipboard();
    if (data) {
      loadPatternData(data);
      toast.success('Pattern eingefügt!');
    } else {
      toast.error('Ungültiges Pattern in Zwischenablage');
    }
  }, []);

  const handleImport = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const data = await importPattern(file);
        if (data) {
          loadPatternData(data);
          toast.success('Pattern importiert!');
        } else {
          toast.error('Fehler beim Importieren des Patterns');
        }
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    []
  );

  const loadPatternData = useCallback(
    (data: any) => {
      // Load BPM
      setBpm(data.bpm);

      // Load pattern
      for (let track = 0; track < 4; track++) {
        for (let step = 0; step < 16; step++) {
          const isActive = pattern[track][step];
          const shouldBeActive = data.pattern[track][step];
          if (isActive !== shouldBeActive) {
            toggleStep(track, step);
          }
        }
      }

      // Load bass notes
      data.bassNotes?.forEach((note: string | null, step: number) => {
        setBassNote(step, note);
      });

      // Load channel settings
      data.channels?.forEach((ch: any, idx: number) => {
        setChannelVolume(idx, ch.volume);
        if (ch.muted !== channels[idx].muted) {
          toggleMute(idx);
        }
      });

      // Load effects
      setReverbWet(data.effects?.reverbWet || 0.2);
      setDelayWet(data.effects?.delayWet || 0.15);

      // Load drum kit
      if (data.drumKit) {
        setActiveDrumKit(data.drumKit);
      }
    },
    [
      pattern,
      channels,
      setBpm,
      toggleStep,
      setBassNote,
      setChannelVolume,
      toggleMute,
      setReverbWet,
      setDelayWet,
      setActiveDrumKit,
    ]
  );

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
            <Save className="w-5 h-5 text-forge-orange" />
            <h3
              className="text-sm font-bold uppercase tracking-widest text-forge-orange"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              Pattern Manager
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-lg"
          >
            ×
          </button>
        </div>

        {/* Pattern Name */}
        <div className="mb-4">
          <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
            Pattern Name
          </label>
          <input
            type="text"
            value={patternName}
            onChange={(e) => setPatternName(e.target.value)}
            className="w-full panel-inset px-3 py-2 text-sm bg-transparent border border-forge-border rounded text-foreground"
            placeholder="Mein Beat"
          />
        </div>

        {/* Export Options */}
        <div className="space-y-2 mb-4">
          <button
            onClick={handleExport}
            className="w-full h-10 rounded flex items-center justify-center gap-2 bg-forge-surface border border-forge-border text-sm text-muted-foreground hover:text-forge-orange hover:border-forge-orange/50 transition-all"
          >
            <Download className="w-4 h-4" />
            Als JSON herunterladen
          </button>

          <button
            onClick={handleCopyToClipboard}
            className="w-full h-10 rounded flex items-center justify-center gap-2 bg-forge-surface border border-forge-border text-sm text-muted-foreground hover:text-forge-cyan hover:border-forge-cyan/50 transition-all"
          >
            <Copy className="w-4 h-4" />
            In Zwischenablage kopieren
          </button>
        </div>

        {/* Import Options */}
        <div className="space-y-2">
          <h4 className="text-xs text-muted-foreground uppercase tracking-wider">
            Pattern laden
          </h4>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-10 rounded flex items-center justify-center gap-2 bg-forge-surface border border-forge-border text-sm text-muted-foreground hover:text-forge-cyan hover:border-forge-cyan/50 transition-all"
          >
            <Upload className="w-4 h-4" />
            JSON-Datei importieren
          </button>

          <button
            onClick={handlePasteFromClipboard}
            className="w-full h-10 rounded flex items-center justify-center gap-2 bg-forge-surface border border-forge-border text-sm text-muted-foreground hover:text-forge-cyan hover:border-forge-cyan/50 transition-all"
          >
            <Clipboard className="w-4 h-4" />
            Aus Zwischenablage einfügen
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 p-3 panel-inset text-xs text-muted-foreground">
          <p>
            Teile Patterns als JSON-Text oder Datei. Alle Einstellungen werden gespeichert:
            Sequenzen, Bass-Noten, Mixer, Effekte und Drum-Kit.
          </p>
        </div>
      </div>
    </div>
  );
}
