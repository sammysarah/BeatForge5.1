# BeatForge Studio v5.1

Browser-basierte Musik-Produktions-App (PWA) mit Step Sequencer, Mixer, Effekten, WAV-Export und MIDI-Support.

## Features

- **Step Sequencer** – 4 Tracks (Kick, Snare, HiHat, Bass) x 16 Steps
- **Mixer** – Kanal-Lautstärke, Mute, Master Volume
- **Effekte** – Reverb & Delay mit visueller Rückmeldung
- **BPM-Steuerung** – 60-200 BPM
- **WAV-Export** – Beat als Audio-Datei herunterladen
- **MIDI-Controller** – Web MIDI API (z.B. Korg nanoPAD2)
- **PWA** – Installierbar, offline-fähig
- **Touch-optimiert** – Chromebook & Tablet-ready

## Tech Stack

- React 19 + TypeScript
- Tone.js (Audio Engine)
- Zustand (State Management)
- TailwindCSS 4
- Vite
- PWA (Service Worker + Manifest)

## Installation

```bash
pnpm install
pnpm dev
```

## Chromebook

Die App kann als PWA direkt im Browser installiert werden (Adressleiste → '+' → Installieren).

## Lizenz

MIT

