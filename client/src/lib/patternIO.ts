/**
 * BeatForge Studio – Pattern I/O
 * Export and import beat patterns as JSON
 */

export interface PatternData {
  version: string;
  name: string;
  bpm: number;
  pattern: boolean[][];
  bassNotes: (string | null)[];
  channels: Array<{
    id: string;
    name: string;
    volume: number;
    muted: boolean;
  }>;
  effects: {
    reverbWet: number;
    delayWet: number;
  };
  drumKit: string;
  createdAt: string;
  updatedAt: string;
}

export function exportPattern(
  name: string,
  bpm: number,
  pattern: boolean[][],
  bassNotes: (string | null)[],
  channels: any[],
  reverbWet: number,
  delayWet: number,
  drumKit: string
): PatternData {
  return {
    version: '1.0',
    name,
    bpm,
    pattern,
    bassNotes,
    channels,
    effects: {
      reverbWet,
      delayWet,
    },
    drumKit,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function downloadPattern(data: PatternData) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `beatforge-${data.name}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importPattern(file: File): Promise<PatternData | null> {
  try {
    const text = await file.text();
    const data = JSON.parse(text) as PatternData;

    // Validate pattern structure
    if (
      !data.pattern ||
      !Array.isArray(data.pattern) ||
      data.pattern.length !== 4 ||
      !data.pattern.every((track) => Array.isArray(track) && track.length === 16)
    ) {
      throw new Error('Invalid pattern structure');
    }

    return data;
  } catch (error) {
    console.error('Failed to import pattern:', error);
    return null;
  }
}

export function copyPatternToClipboard(data: PatternData): Promise<void> {
  const json = JSON.stringify(data);
  return navigator.clipboard.writeText(json);
}

export async function pastePatternFromClipboard(): Promise<PatternData | null> {
  try {
    const text = await navigator.clipboard.readText();
    return JSON.parse(text) as PatternData;
  } catch (error) {
    console.error('Failed to paste pattern:', error);
    return null;
  }
}
