/**
 * BeatForge Studio – useMidi Hook
 * Web MIDI API integration for hardware controllers (e.g. Korg nanoPAD2)
 */

import { useEffect, useState, useCallback } from 'react';
import { audioEngine } from '@/lib/audioEngine';
import { useDAWStore, DRUM_ORDER } from '@/lib/store';

interface MidiDevice {
  id: string;
  name: string;
  manufacturer: string;
}

export function useMidi() {
  const [devices, setDevices] = useState<MidiDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);
  const [midiSupported, setMidiSupported] = useState(false);
  const { toggleStep, audioReady } = useDAWStore();

  useEffect(() => {
    if (typeof navigator.requestMIDIAccess === 'function') {
      setMidiSupported(true);
    }
  }, []);

  const scanDevices = useCallback(async () => {
    if (!navigator.requestMIDIAccess) return;

    try {
      const access = await navigator.requestMIDIAccess();
      const inputDevices: MidiDevice[] = [];

      access.inputs.forEach((input) => {
        inputDevices.push({
          id: input.id,
          name: input.name || 'Unknown Device',
          manufacturer: input.manufacturer || 'Unknown',
        });
      });

      setDevices(inputDevices);
    } catch (err) {
      console.error('MIDI access denied:', err);
    }
  }, []);

  const connectDevice = useCallback(
    async (deviceId: string) => {
      if (!navigator.requestMIDIAccess) return;

      try {
        const access = await navigator.requestMIDIAccess();
        const input = access.inputs.get(deviceId);

        if (input) {
          input.onmidimessage = (event: MIDIMessageEvent) => {
            if (!event.data) return;
            const data = event.data;
            const status = data[0];
            const note = data[1];
            const velocity = data[2];

            // Note On (0x90) with velocity > 0
            if ((status & 0xf0) === 0x90 && velocity > 0) {
              // Map MIDI notes to drum tracks (basic mapping)
              const trackIndex = note % 4;
              if (audioReady) {
                const drumType = DRUM_ORDER[trackIndex];
                if (drumType) {
                  audioEngine.triggerDrum(drumType, velocity / 127);
                }
              }
            }
          };

          setConnectedDevice(deviceId);
        }
      } catch (err) {
        console.error('Failed to connect MIDI device:', err);
      }
    },
    [audioReady]
  );

  const disconnectDevice = useCallback(async () => {
    if (!navigator.requestMIDIAccess || !connectedDevice) return;

    try {
      const access = await navigator.requestMIDIAccess();
      const input = access.inputs.get(connectedDevice);
      if (input) {
        input.onmidimessage = null;
      }
      setConnectedDevice(null);
    } catch (err) {
      console.error('Failed to disconnect MIDI device:', err);
    }
  }, [connectedDevice]);

  return {
    devices,
    connectedDevice,
    midiSupported,
    scanDevices,
    connectDevice,
    disconnectDevice,
  };
}
