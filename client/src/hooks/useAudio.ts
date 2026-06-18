/**
 * BeatForge Studio – useAudio Hook
 * Connects the Zustand store to the AudioEngine
 */

import { useEffect, useCallback, useRef } from 'react';
import { audioEngine } from '@/lib/audioEngine';
import { useDAWStore, DRUM_ORDER } from '@/lib/store';

export function useAudio() {
  const {
    isPlaying,
    bpm,
    pattern,
    channels,
    masterVolume,
    reverbWet,
    delayWet,
    audioReady,
    setCurrentStep,
    setAudioReady,
    stop,
  } = useDAWStore();

  const patternRef = useRef(pattern);
  patternRef.current = pattern;

  // Initialize audio on first user interaction
  const initAudio = useCallback(async () => {
    if (!audioReady) {
      await audioEngine.initialize();
      setAudioReady(true);
    }
  }, [audioReady, setAudioReady]);

  // Sync BPM
  useEffect(() => {
    if (audioReady) {
      audioEngine.setBPM(bpm);
    }
  }, [bpm, audioReady]);

  // Sync channel volumes
  useEffect(() => {
    if (!audioReady) return;
    channels.forEach((ch) => {
      if (ch.muted) {
        audioEngine.setChannelMute(ch.id, true);
      } else {
        audioEngine.setChannelVolume(ch.id, ch.volume);
      }
    });
  }, [channels, audioReady]);

  // Sync master volume
  useEffect(() => {
    if (audioReady) {
      audioEngine.setMasterVolume(masterVolume);
    }
  }, [masterVolume, audioReady]);

  // Sync effects
  useEffect(() => {
    if (audioReady) {
      audioEngine.setReverbWet(reverbWet);
    }
  }, [reverbWet, audioReady]);

  useEffect(() => {
    if (audioReady) {
      audioEngine.setDelayWet(delayWet);
    }
  }, [delayWet, audioReady]);

  // Handle playback
  useEffect(() => {
    if (!audioReady) return;

    if (isPlaying) {
      audioEngine.startSequence(patternRef.current, DRUM_ORDER, (step) => {
        setCurrentStep(step);
      });
    } else {
      audioEngine.stopSequence();
      setCurrentStep(-1);
    }
  }, [isPlaying, audioReady, setCurrentStep]);

  // Update pattern while playing
  useEffect(() => {
    if (!audioReady || !isPlaying) return;
    // Restart sequence with new pattern
    audioEngine.stopSequence();
    audioEngine.startSequence(pattern, DRUM_ORDER, (step) => {
      setCurrentStep(step);
    });
  }, [pattern, audioReady, isPlaying, setCurrentStep]);

  // Trigger single drum sound (for pad preview)
  const triggerDrum = useCallback(
    async (trackIndex: number) => {
      await initAudio();
      const drumType = DRUM_ORDER[trackIndex];
      if (drumType) {
        audioEngine.triggerDrum(drumType);
      }
    },
    [initAudio]
  );

  // WAV Export
  const exportWAV = useCallback(async (): Promise<Blob | null> => {
    if (!audioReady) return null;

    await audioEngine.startRecording();

    // Play one full loop (16 steps)
    const stepDuration = 60 / bpm / 4; // duration of one 16th note
    const totalDuration = stepDuration * 16;

    audioEngine.startSequence(pattern, DRUM_ORDER, () => {});

    // Wait for one full loop
    await new Promise((resolve) => setTimeout(resolve, totalDuration * 1000 + 200));

    audioEngine.stopSequence();
    const blob = await audioEngine.stopRecording();
    return blob;
  }, [audioReady, bpm, pattern]);

  // Cleanup
  useEffect(() => {
    return () => {
      audioEngine.stopSequence();
    };
  }, []);

  return {
    initAudio,
    triggerDrum,
    exportWAV,
    audioReady,
  };
}
