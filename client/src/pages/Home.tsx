/**
 * BeatForge Studio – Main Page
 * Full DAW layout: Toolbar → Sequencer → Mixer + Effects
 * Design: Neon Circuit – Hardware panel layout, single-screen workflow
 */

import { Toolbar } from '@/components/Toolbar';
import { StepSequencer } from '@/components/StepSequencer';
import { Mixer } from '@/components/Mixer';
import { Effects } from '@/components/Effects';
import { PianoRoll } from '@/components/PianoRoll';
import { useAudio } from '@/hooks/useAudio';
import { useDAWStore } from '@/lib/store';

export default function Home() {
  const { initAudio, triggerBassNote } = useAudio();
  const { audioReady, bassNotes, setBassNote, currentStep } = useDAWStore();

  return (
    <div
      className="min-h-screen flex flex-col bg-forge-deep"
      onClick={() => {
        if (!audioReady) initAudio();
      }}
    >
      {/* Toolbar */}
      <header className="sticky top-0 z-50">
        <Toolbar />
      </header>

      {/* Main Content */}
      <main className="flex-1 p-3 flex flex-col gap-3 overflow-hidden">
        {/* Step Sequencer - Full Width */}
        <section className="flex-shrink-0">
          <StepSequencer />
        </section>

        {/* Piano Roll */}
        <section className="flex-shrink-0">
          <PianoRoll
            notes={bassNotes}
            onNoteChange={setBassNote}
            onTriggerNote={triggerBassNote}
            currentStep={currentStep}
          />
        </section>

        {/* Bottom Section: Mixer + Effects */}
        <section className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3 min-h-0">
          <Mixer />
          <Effects />
        </section>
      </main>

      {/* Footer Status Bar */}
      <footer className="px-4 py-2 border-t border-forge-border flex items-center justify-between text-[10px] text-muted-foreground">
        <span>BeatForge Studio v5.1</span>
        <span className="flex items-center gap-2">
          <span className="uppercase tracking-wider">Touch Optimized</span>
          <span>|</span>
          <span className="uppercase tracking-wider">PWA Ready</span>
        </span>
      </footer>
    </div>
  );
}
