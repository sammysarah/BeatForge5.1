/**
 * BeatForge Studio – useSampler Hook
 * Load and play custom audio samples for drum pads
 */

import { useCallback, useState } from 'react';
import * as Tone from 'tone';

export interface Sample {
  id: string;
  name: string;
  buffer: AudioBuffer | null;
  duration: number;
}

export function useSampler() {
  const [samples, setSamples] = useState<Map<string, Sample>>(new Map());
  const [players, setPlayers] = useState<Map<string, Tone.Player>>(new Map());

  const loadSample = useCallback(
    async (file: File, trackId: string, trackName: string) => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const audioContext = Tone.getContext().rawContext;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Create player
        const player = new Tone.Player(audioBuffer).toDestination();

        // Store sample
        const sample: Sample = {
          id: trackId,
          name: trackName,
          buffer: audioBuffer,
          duration: audioBuffer.duration,
        };

        setSamples((prev) => new Map(prev).set(trackId, sample));
        setPlayers((prev) => new Map(prev).set(trackId, player));

        return sample;
      } catch (error) {
        console.error('Failed to load sample:', error);
        return null;
      }
    },
    []
  );

  const playSample = useCallback(
    async (trackId: string, velocity: number = 1) => {
      const player = players.get(trackId);
      if (player) {
        player.volume.value = Tone.gainToDb(Math.max(0, Math.min(1, velocity)));
        player.start();
      }
    },
    [players]
  );

  const removeSample = useCallback((trackId: string) => {
    setSamples((prev) => {
      const newMap = new Map(prev);
      newMap.delete(trackId);
      return newMap;
    });

    setPlayers((prev) => {
      const newMap = new Map(prev);
      const player = newMap.get(trackId);
      if (player) {
        player.dispose();
      }
      newMap.delete(trackId);
      return newMap;
    });
  }, []);

  const getSample = useCallback(
    (trackId: string) => {
      return samples.get(trackId) || null;
    },
    [samples]
  );

  return {
    samples,
    loadSample,
    playSample,
    removeSample,
    getSample,
  };
}
