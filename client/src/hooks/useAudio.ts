/**
 * BeatForge Studio – useAudio Hook
 * Connects the Zustand store to the AudioEngine
 */

import { useEffect, useCallback, useRef } from 'react';
import { audioEngine } from '@/lib/audioEngine';
import { useDAWStore, DRUM_ORDER } from '@/lib/store';
import { DRUM_KITS } from '@/lib/drumKits';

export function useAudio() {
  const {
    isPlaying,
    bpm,
    swing,
    pattern,
    channels,
    masterVolume,
    reverbWet,
    delayWet,
    bassNotes,
    activeDrumKit,
    audioReady,
    setCurrentStep,
    setAudioReady,
    stop,
  } = useDAWStore();

  const patternRef = useRef(pattern);
  patternRef.current = pattern;

  const bassNotesRef = useRef(bassNotes);
  bassNotesRef.current = bassNotes;

  // Initialize audio on first user interaction
  const initAudio = useCallback(async () => {
    if (!audioReady) {
      await audioEngine.initialize();
      setAudioReady(true);
      // Apply the current drum kit on init
      const kit = DRUM_KITS.find((k) => k.id === activeDrumKit);
      if (kit) {
        audioEngine.applyDrumKit(kit);
      }
    }
  }, [audioReady, setAudioReady, activeDrumKit]);

  // Sync BPM
  useEffect(() => {
    if (audioReady) {
      audioEngine.setBPM(bpm);
    }
  }, [bpm, audioReady]);

  // Sync Swing
  useEffect(() => {
    if (audioReady) {
      audioEngine.setSwing(swing);
    }
  }, [swing, audioReady]);

  // Sync channel volumes
  useEffect(() => {
    if (!audioReady) return;
    channels.forEach((ch) => {
      audioEngine.setChannelVolume(ch.id, ch.volume);
      audioEngine.setChannelMute(ch.id, ch.muted);
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

  // Sync drum kit
  useEffect(() => {
    if (!audioReady) return;
    const kit = DRUM_KITS.find((k) => k.id === activeDrumKit);
    if (kit) {
      audioEngine.applyDrumKit(kit);
    }
  }, [activeDrumKit, audioReady]);

  // Sync bass notes to engine
  useEffect(() => {
    if (audioReady) {
      audioEngine.setBassNotes(bassNotes);
    }
  }, [bassNotes, audioReady]);

  // Handle playback
  useEffect(() => {
    if (!audioReady) return;

    if (isPlaying) {
      audioEngine.startSequence(patternRef.current, DRUM_ORDER, bassNotesRef.current, (step) => {
        setCurrentStep(step);
      });
    } else {
      audioEngine.stopSequence();
      setCurrentStep(-1);
    }
  }, [isPlaying, audioReady, setCurrentStep]);

  // Update pattern/bass notes while playing
  useEffect(() => {
    if (!audioReady || !isPlaying) return;
    // Restart sequence with new pattern and bass notes
    audioEngine.stopSequence();
    audioEngine.startSequence(pattern, DRUM_ORDER, bassNotes, (step) => {
      setCurrentStep(step);
    });
  }, [pattern, bassNotes, audioReady, isPlaying, setCurrentStep]);

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

  // Trigger bass note
  const triggerBassNote = useCallback(
    async (note: string) => {
      await initAudio();
      audioEngine.triggerBassNote(note);
    },
    [initAudio]
  );

  // Audio Export (WebM format from Tone.Recorder)
  const exportAudio = useCallback(async (): Promise<Blob | null> => {
    if (!audioReady) return null;

    await audioEngine.startRecording();

    // Play one full loop (16 steps)
    const stepDuration = 60 / bpm / 4; // duration of one 16th note
    const totalDuration = stepDuration * 16;

    audioEngine.startSequence(pattern, DRUM_ORDER, bassNotes, () => {});

    // Wait for one full loop plus a small buffer
    await new Promise((resolve) => setTimeout(resolve, totalDuration * 1000 + 200));

    audioEngine.stopSequence();
    const blob = await audioEngine.stopRecording();
    return blob;
  }, [audioReady, bpm, pattern, bassNotes]);

  // Cleanup
  useEffect(() => {
    return () => {
      audioEngine.stopSequence();
    };
  }, []);

  return {
    initAudio,
    triggerDrum,
    triggerBassNote,
    exportAudio,
    audioReady,
  };
}
