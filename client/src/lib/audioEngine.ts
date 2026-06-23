/**
 * BeatForge Studio – Audio Engine
 * Provides drum synthesis, effects processing, and WAV export
 * Built on Tone.js for Web Audio API abstraction
 */

import * as Tone from 'tone';
import type { DrumKitConfig } from './drumKits';

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
  private channelVolumes: Record<DrumType, number> = { kick: 0.8, snare: 0.7, hihat: 0.6, bass: 0.75 };
  private channelMuted: Record<DrumType, boolean> = { kick: false, snare: false, hihat: false, bass: false };
  private recorder: Tone.Recorder | null = null;
  private sequencer: Tone.Sequence | null = null;
  private isInitialized = false;
  private currentBassNotes: (string | null)[] = Array(16).fill(null);
  private swingAmount: number = 0; // 0-100

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

      // Recorder for audio export
      this.recorder = new Tone.Recorder();
      this.master.connect(this.recorder);

      this.isInitialized = true;
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  }

  triggerDrum(type: DrumType, velocity: number = 1, time?: number) {
    if (!this.isInitialized) return;

    const vol = Math.max(0, Math.min(1, velocity));
    const t = time ?? Tone.now();

    switch (type) {
      case 'kick':
        this.drums.kick?.triggerAttackRelease('C1', '8n', t, vol);
        break;
      case 'snare':
        this.drums.snare?.triggerAttackRelease('8n', t, vol);
        break;
      case 'hihat':
        this.drums.hihat?.triggerAttackRelease('32n', t, vol * 0.3);
        break;
      case 'bass':
        this.drums.bass?.triggerAttackRelease('C2', '8n', t, vol);
        break;
    }
  }

  setChannelVolume(type: DrumType, volume: number) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.channelVolumes[type] = clampedVolume;
    if (this.channels[type] && !this.channelMuted[type]) {
      this.channels[type].gain.value = clampedVolume;
    }
  }

  setChannelMute(type: DrumType, muted: boolean) {
    this.channelMuted[type] = muted;
    if (this.channels[type]) {
      this.channels[type].gain.value = muted ? 0 : this.channelVolumes[type];
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

  setSwing(amount: number) {
    this.swingAmount = Math.max(0, Math.min(100, amount));
    // Tone.js swing is 0-1
    Tone.getTransport().swing = this.swingAmount / 100;
    Tone.getTransport().swingSubdivision = '16n';
  }

  /**
   * Apply a drum kit configuration to the synthesizers
   */
  applyDrumKit(kit: DrumKitConfig) {
    if (!this.isInitialized) return;

    // Update kick
    if (this.drums.kick) {
      this.drums.kick.set({
        pitchDecay: kit.kickConfig.pitchDecay,
        octaves: kit.kickConfig.octaves,
        envelope: {
          decay: kit.kickConfig.decayTime,
        },
      });
    }

    // Update snare
    if (this.drums.snare) {
      this.drums.snare.set({
        envelope: {
          decay: kit.snareConfig.decayTime,
        },
      });
    }

    // Update hihat
    if (this.drums.hihat) {
      this.drums.hihat.set({
        harmonicity: kit.hihatConfig.harmonicity,
        modulationIndex: kit.hihatConfig.modulationIndex,
        resonance: kit.hihatConfig.resonance,
      });
    }
  }

  /**
   * Set bass notes for sequencer playback
   */
  setBassNotes(notes: (string | null)[]) {
    this.currentBassNotes = notes;
  }

  /**
   * Start the sequencer with pattern and bass notes
   */
  startSequence(
    pattern: boolean[][],
    drumOrder: DrumType[],
    bassNotes: (string | null)[],
    onStep: (step: number) => void
  ) {
    this.stopSequence();
    this.currentBassNotes = bassNotes;

    const steps = pattern[0]?.length || 16;
    const indices = Array.from({ length: steps }, (_, i) => i);

    this.sequencer = new Tone.Sequence(
      (time, stepIndex) => {
        // Trigger drums for active steps
        drumOrder.forEach((drum, trackIndex) => {
          if (drum === 'bass') {
            // For bass track: use piano roll notes if available, otherwise use pattern
            const bassNote = this.currentBassNotes[stepIndex];
            if (bassNote) {
              this.triggerBassNote(bassNote, 1, time);
            } else if (pattern[trackIndex]?.[stepIndex]) {
              this.triggerDrum(drum, 1, time);
            }
          } else {
            if (pattern[trackIndex]?.[stepIndex]) {
              this.triggerDrum(drum, 1, time);
            }
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

  triggerBassNote(note: string, velocity: number = 1, time?: number) {
    if (!this.isInitialized || !this.drums.bass) return;
    const vol = Math.max(0, Math.min(1, velocity));
    this.drums.bass.triggerAttackRelease(note, '8n', time ?? Tone.now(), vol);
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
