/**
 * BeatForge Studio – MIDI Settings Dialog
 * Connect and manage MIDI controllers
 */

import { useMidi } from '@/hooks/useMidi';
import { Usb, RefreshCw, Unplug } from 'lucide-react';

interface MidiSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MidiSettings({ isOpen, onClose }: MidiSettingsProps) {
  const { devices, connectedDevice, midiSupported, scanDevices, connectDevice, disconnectDevice } =
    useMidi();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="panel-surface w-full max-w-md p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-sm font-bold uppercase tracking-widest text-forge-orange"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            MIDI Controller
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-lg"
          >
            ×
          </button>
        </div>

        {!midiSupported ? (
          <div className="text-sm text-muted-foreground">
            Web MIDI wird von diesem Browser nicht unterstützt. Bitte verwende Chrome oder Edge.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Scan button */}
            <button
              onClick={scanDevices}
              className="w-full h-10 rounded flex items-center justify-center gap-2 bg-forge-surface border border-forge-border text-sm text-muted-foreground hover:text-forge-cyan hover:border-forge-cyan/50 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Geräte suchen
            </button>

            {/* Device list */}
            {devices.length === 0 ? (
              <div className="panel-inset p-4 text-center text-sm text-muted-foreground">
                <Usb className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>Kein MIDI-Gerät gefunden.</p>
                <p className="text-xs mt-1">Schließe einen Controller an und klicke "Geräte suchen".</p>
              </div>
            ) : (
              <div className="space-y-2">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className={`panel-inset p-3 flex items-center justify-between ${
                      connectedDevice === device.id ? 'border-forge-cyan/50' : ''
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium">{device.name}</p>
                      <p className="text-xs text-muted-foreground">{device.manufacturer}</p>
                    </div>
                    {connectedDevice === device.id ? (
                      <button
                        onClick={disconnectDevice}
                        className="h-8 px-3 rounded text-xs bg-destructive/20 border border-destructive/50 text-destructive hover:bg-destructive/30 transition-all flex items-center gap-1"
                      >
                        <Unplug className="w-3 h-3" />
                        Trennen
                      </button>
                    ) : (
                      <button
                        onClick={() => connectDevice(device.id)}
                        className="h-8 px-3 rounded text-xs bg-forge-surface border border-forge-border text-forge-cyan hover:border-forge-cyan/50 transition-all"
                      >
                        Verbinden
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Status */}
            {connectedDevice && (
              <div className="flex items-center gap-2 text-xs text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                MIDI Controller verbunden
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
