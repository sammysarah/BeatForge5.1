/**
 * BeatForge Studio – Sampler Dialog
 * Upload and manage custom drum samples
 */

import { Upload, Trash2, Play } from 'lucide-react';
import { useRef, useCallback } from 'react';
import { useSampler } from '@/hooks/useSampler';
import { DRUM_ORDER } from '@/lib/store';

interface SamplerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SamplerDialog({ isOpen, onClose }: SamplerDialogProps) {
  const { samples, loadSample, playSample, removeSample } = useSampler();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedTrackRef = useRef<string>('kick');

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && selectedTrackRef.current) {
        const trackName = DRUM_ORDER.indexOf(selectedTrackRef.current as any) >= 0
          ? selectedTrackRef.current.toUpperCase()
          : 'Sample';
        await loadSample(file, selectedTrackRef.current, trackName);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [loadSample]
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
            <Upload className="w-5 h-5 text-forge-orange" />
            <h3
              className="text-sm font-bold uppercase tracking-widest text-forge-orange"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              Sampler
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-lg"
          >
            ×
          </button>
        </div>

        {/* Track Selection */}
        <div className="mb-4">
          <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
            Spur wählen
          </label>
          <select
            value={selectedTrackRef.current}
            onChange={(e) => (selectedTrackRef.current = e.target.value)}
            className="w-full panel-inset px-3 py-2 text-sm bg-transparent border border-forge-border rounded text-foreground"
          >
            {DRUM_ORDER.map((track) => (
              <option key={track} value={track} className="bg-forge-surface">
                {track.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-10 rounded flex items-center justify-center gap-2 bg-forge-surface border border-forge-border text-sm text-muted-foreground hover:text-forge-cyan hover:border-forge-cyan/50 transition-all mb-4"
        >
          <Upload className="w-4 h-4" />
          Audio-Datei hochladen
        </button>

        {/* Samples List */}
        <div className="space-y-2">
          <h4 className="text-xs text-muted-foreground uppercase tracking-wider">
            Hochgeladene Samples
          </h4>
          {samples.size === 0 ? (
            <div className="panel-inset p-4 text-center text-xs text-muted-foreground">
              Keine Samples hochgeladen
            </div>
          ) : (
            Array.from(samples.values()).map((sample) => (
              <div
                key={sample.id}
                className="panel-inset p-3 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{sample.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {sample.duration.toFixed(2)}s
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playSample(sample.id)}
                    className="w-8 h-8 rounded flex items-center justify-center bg-forge-surface border border-forge-border text-forge-cyan hover:border-forge-cyan/50 transition-all"
                  >
                    <Play className="w-3 h-3" fill="currentColor" />
                  </button>
                  <button
                    onClick={() => removeSample(sample.id)}
                    className="w-8 h-8 rounded flex items-center justify-center bg-destructive/20 border border-destructive/50 text-destructive hover:bg-destructive/30 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
