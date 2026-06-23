# BeatForge Studio v5.1

Browser-basierte Musik-Produktions-App (PWA) mit Step Sequencer, Mixer, Effekten, Audio-Export und MIDI-Support.

## Features

- **Step Sequencer** – 4 Tracks (Kick, Snare, HiHat, Bass) x 16 Steps
- **Piano Roll** – Melodische Bass-Linien programmieren (wird in Playback integriert)
- **Mixer** – Kanal-Lautstärke, Mute, Solo, Master Volume
- **Effekte** – Reverb & Delay mit visueller Rückmeldung
- **BPM-Steuerung** – 60-200 BPM
- **Swing/Shuffle** – 0-100% Swing für groovigere Beats
- **Drum Kits** – 5 verschiedene Kits (808, Acoustic, Lo-Fi, Deep House, Trap) mit echtem Audio-Effekt
- **Beat Presets** – Vorgefertigte Patterns für verschiedene Genres
- **Audio-Export** – Beat als WebM-Audio herunterladen
- **Pattern Manager** – Patterns als JSON speichern, laden und teilen
- **Loop Recorder** – Mikrofon-Aufnahmen mit Overdub-Funktion
- **MIDI-Controller** – Web MIDI API (z.B. Korg nanoPAD2)
- **Keyboard Shortcuts** – Space (Play), Esc (Stop), Ctrl+Z (Undo), +/- (BPM)
- **Undo/Redo** – Vollständige Bearbeitungshistorie
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

## Keyboard Shortcuts

| Shortcut | Aktion |
|----------|--------|
| Space | Play/Pause |
| Escape | Stop |
| Ctrl+Z | Undo |
| Ctrl+Shift+Z / Ctrl+Y | Redo |
| + | BPM erhöhen |
| - | BPM verringern |
| Ctrl+Delete | Pattern löschen |

## Chromebook

Die App kann als PWA direkt im Browser installiert werden (Adressleiste → '+' → Installieren).

## Lizenz

MIT
