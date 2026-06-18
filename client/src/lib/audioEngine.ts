/**
 * BeatForge Studio – Audio Engine
 * Provides drum synthesis, effects processing, and WAV export
 * Built on Tone.js for Web Audio API abstraction
 */

import * as Tone from 'tone';

export type DrumType = 'kick' | 'snare' | 'hihat' | 'bass';

interface DrumSounds {
  kick: Tone.MembraneSynth;
  snare: Tone.NoiseSynth;
  hihat: Tone.MetalSynth;
  bass: Tone.Synth;
}

export class AudioEngine {
  private drums: Partial<DrumSounds> = {};
  private reverb: Tone.Reverb | null = null;
  private delay: Tone.FeedbackDelay | null = null;
  private master: Tone.Gain | null = null;
  private channels: Record<DrumType, Tone.Gain> = {} as Record<DrumType, Tone.Gain>;
  private recorder: Tone.Recorder | null = null;
  private sequencer: Tone.Sequence | null = null;
  private bassSequencer: Tone.Sequence | null = null;
  private isInitialized = false;
  private currentBassNotes: (string | null)[] = Array(16).fill(null);

  async initialize() {
    if (this.isInitialized) return;

    try {
      await Tone.start();

      // Master output
      this.master = new Tone.Gain(0.8).toDestination();

      // Effects chain
      this.reverb = new Tone.Reverb({
        decay: 2.5,
        wet: 0.2,
      }).connect(this.master);

      this.delay = new Tone.FeedbackDelay({
        delayTime: '8n',
        feedback: 0.3,
        wet: 0.15,
      }).connect(this.reverb);

      // Channel gains
      this.channels.kick = new Tone.Gain(0.8).connect(this.delay);
      this.channels.snare = new Tone.Gain(0.7).connect(this.delay);
      this.channels.hihat = new Tone.Gain(0.6).connect(this.delay);
      this.channels.bass = new Tone.Gain(0.75).connect(this.delay);

      // Drum instruments
      this.drums.kick = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 6,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.001,
          decay: 0.4,
          sustain: 0.01,
          release: 1.4,
        },
      }).connect(this.channels.kick);

      this.drums.snare = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: {
          attack: 0.001,
          decay: 0.2,
          sustain: 0,
          release: 0.2,
        },
      }).connect(this.channels.snare);

      this.drums.hihat = new Tone.MetalSynth({
        envelope: {
          attack: 0.001,
          decay: 0.1,
          release: 0.01,
        },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5,
      }).connect(this.channels.hihat);

      this.drums.bass = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: {
          attack: 0.005,
          decay: 0.3,
          sustain: 0.4,
          release: 0.8,
        },
      }).connect(this.channels.bass);

      // Recorder for WAV export
      this.recorder = new Tone.Recorder();
      this.master.connect(this.recorder);

      this.isInitialized = true;
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  }

  triggerDrum(type: DrumType, velocity: number = 1) {
    if (!this.isInitialized) return;

    const vol = Math.max(0, Math.min(1, velocity));

    switch (type) {
      case 'kick':
        this.drums.kick?.triggerAttackRelease('C1', '8n', undefined, vol);
        break;
      case 'snare':
        this.drums.snare?.triggerAttackRelease('8n', Tone.now(), vol);
        break;
      case 'hihat':
        this.drums.hihat?.triggerAttackRelease('32n', Tone.now(), vol * 0.3);
        break;
      case 'bass':
        this.drums.bass?.triggerAttackRelease('C2', '8n', undefined, vol);
        break;
    }
  }

  setChannelVolume(type: DrumType, volume: number) {
    if (this.channels[type]) {
      this.channels[type].gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  setChannelMute(type: DrumType, muted: boolean) {
    if (this.channels[type]) {
      this.channels[type].gain.value = muted ? 0 : 1;
    }
  }

  setReverbWet(value: number) {
    if (this.reverb) {
      this.reverb.wet.value = Math.max(0, Math.min(1, value));
    }
  }

  setDelayWet(value: number) {
    if (this.delay) {
      this.delay.wet.value = Math.max(0, Math.min(1, value));
    }
  }

  setMasterVolume(value: number) {
    if (this.master) {
      this.master.gain.value = Math.max(0, Math.min(1, value));
    }
  }

  setBPM(bpm: number) {
    Tone.getTransport().bpm.value = bpm;
  }

  getBPM(): number {
    return Tone.getTransport().bpm.value;
  }

  startSequence(
    pattern: boolean[][],
    drumOrder: DrumType[],
    onStep: (step: number) => void
  ) {
    this.stopSequence();

    const steps = pattern[0]?.length || 16;
    const indices = Array.from({ length: steps }, (_, i) => i);

    this.sequencer = new Tone.Sequence(
      (time, stepIndex) => {
        // Trigger drums for active steps
        drumOrder.forEach((drum, trackIndex) => {
          if (pattern[trackIndex]?.[stepIndex]) {
            this.triggerDrum(drum);
          }
        });

        // Notify UI of current step
        Tone.getDraw().schedule(() => {
          onStep(stepIndex);
        }, time);
      },
      indices,
      '16n'
    );

    this.sequencer.start(0);
    Tone.getTransport().start();
  }

  stopSequence() {
    if (this.sequencer) {
      this.sequencer.stop();
      this.sequencer.dispose();
      this.sequencer = null;
    }
    Tone.getTransport().stop();
    Tone.getTransport().position = 0;
  }

  async startRecording() {
    if (!this.recorder) return;
    this.recorder.start();
  }

  async stopRecording(): Promise<Blob | null> {
    if (!this.recorder) return null;
    const blob = await this.recorder.stop();
    return blob;
  }

  setBassNotes(notes: (string | null)[]) {
    this.currentBassNotes = notes;
  }

  triggerBassNote(note: string, velocity: number = 1) {
    if (!this.isInitialized || !this.drums.bass) return;
    const vol = Math.max(0, Math.min(1, velocity));
    const freq = this.getNoteFrequency(note);
    if (freq) {
      (this.drums.bass as any).frequency.value = freq;
      this.drums.bass.triggerAttackRelease('8n', Tone.now(), vol);
    }
  }

  private getNoteFrequency(note: string): number | null {
    const frequencies: Record<string, number> = {
      'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00,
      'A2': 110.00, 'B2': 123.47, 'C3': 130.81, 'D3': 146.83, 'E3': 164.81,
      'F3': 174.61, 'G3': 196.00,
    };
    return frequencies[note] || null;
  }

  getInitialized(): boolean {
    return this.isInitialized;
  }

  dispose() {
    this.stopSequence();
    Object.values(this.drums).forEach((d) => d?.dispose());
    Object.values(this.channels).forEach((c) => c?.dispose());
    this.reverb?.dispose();
    this.delay?.dispose();
    this.master?.dispose();
    this.recorder?.dispose();
    this.isInitialized = false;
  }
}

// Singleton instance
export const audioEngine = new AudioEngine();
