import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-cyan-400 flex flex-col items-center px-4 py-8 overflow-hidden relative scanlines selection:bg-fuchsia-500 selection:text-black">
      {/* Heavy static noise overlay */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none mix-blend-screen"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, animation: 'noise 0.2s infinite' }}
      />
      
      <header className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-between z-10 relative mb-8 gap-8 pt-4 pb-6 border-b-4 border-fuchsia-500">
        <div className="flex flex-col items-start gap-1 w-full lg:w-auto">
          <span className="text-fuchsia-500 text-xs font-mono tracking-widest bg-fuchsia-500/20 px-2 py-1 mb-2">SYS.INIT.2026 // KERNEL OK</span>
          <h1 className="text-4xl sm:text-5xl font-mono text-cyan-400 uppercase glitch-text leading-tight" data-text="SYNTH_SNAKE.EXE">
            SYNTH_SNAKE.EXE
          </h1>
        </div>
        <MusicPlayer />
      </header>

      <main className="z-10 relative flex-1 flex flex-col items-center justify-center w-full max-w-5xl">
        <SnakeGame />
      </main>
      
      <footer className="mt-8 z-10 text-xl font-sans text-fuchsia-500 bg-black border-2 border-fuchsia-500 p-4 uppercase tracking-normal text-center shadow-[4px_4px_0_0_#00FFFF]">
        [INPUT_REQUIRED: W_A_S_D // OVERRIDE_PAUSE: SPACE]<br/>
        <span className="text-cyan-400 mt-2 block text-2xl font-mono">WARNING. NEURAL CORRUPTION IMMINENT.</span>
      </footer>
    </div>
  );
}
