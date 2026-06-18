/**
 * BeatForge Studio – useLoopRecorder Hook
 * Record and overdub multiple takes over a loop
 */

import { useCallback, useRef, useState } from 'react';
import * as Tone from 'tone';

export interface RecordingTake {
  id: string;
  name: string;
  buffer: AudioBuffer;
  volume: number;
  muted: boolean;
  createdAt: Date;
}

export function useLoopRecorder(loopDuration: number = 4) {
  const [isRecording, setIsRecording] = useState(false);
  const [takes, setTakes] = useState<RecordingTake[]>([]);
  const recorderRef = useRef<Tone.Recorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const playersRef = useRef<Map<string, Tone.Player>>(new Map());

  const startRecording = useCallback(async () => {
    try {
      await Tone.start();

      // Get microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Create recorder from stream
      const audioContext = Tone.getContext().rawContext as any;
      const source = audioContext.createMediaStreamAudioSource(stream);
      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);

      const mediaRecorder = new MediaRecorder((destination as any).stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const arrayBuffer = await blob.arrayBuffer();
        const audioBuffer = await (audioContext as any).decodeAudioData(arrayBuffer);

        // Create new take
        const take: RecordingTake = {
          id: `take-${Date.now()}`,
          name: `Take ${takes.length + 1}`,
          buffer: audioBuffer,
          volume: 1,
          muted: false,
          createdAt: new Date(),
        };

        // Create player for this take
        const player = new Tone.Player(audioBuffer).toDestination();
        playersRef.current.set(take.id, player);

        setTakes((prev) => [...prev, take]);
      };

      // Record for loop duration
      mediaRecorder.start();
      setIsRecording(true);

      setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
      }, loopDuration * 1000);
    } catch (error) {
      console.error('Recording failed:', error);
      setIsRecording(false);
    }
  }, [loopDuration, takes.length]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const playTake = useCallback((takeId: string) => {
    const player = playersRef.current.get(takeId);
    if (player) {
      player.start();
    }
  }, []);

  const removeTake = useCallback((takeId: string) => {
    setTakes((prev) => prev.filter((t) => t.id !== takeId));
    const player = playersRef.current.get(takeId);
    if (player) {
      player.dispose();
      playersRef.current.delete(takeId);
    }
  }, []);

  const setTakeVolume = useCallback((takeId: string, volume: number) => {
    const player = playersRef.current.get(takeId);
    if (player) {
      player.volume.value = Tone.gainToDb(Math.max(0, Math.min(1, volume)));
    }
    setTakes((prev) =>
      prev.map((t) => (t.id === takeId ? { ...t, volume } : t))
    );
  }, []);

  const toggleTakeMute = useCallback((takeId: string) => {
    const player = playersRef.current.get(takeId);
    if (player) {
      player.mute = !player.mute;
    }
    setTakes((prev) =>
      prev.map((t) => (t.id === takeId ? { ...t, muted: !t.muted } : t))
    );
  }, []);

  return {
    isRecording,
    takes,
    startRecording,
    stopRecording,
    playTake,
    removeTake,
    setTakeVolume,
    toggleTakeMute,
  };
}
