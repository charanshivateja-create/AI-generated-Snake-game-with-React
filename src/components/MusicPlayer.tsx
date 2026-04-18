import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc3 } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "DATA_STREAM_01.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "CYBER_PULSE_02.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "NULL_POINTER_03.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
            console.log("Audio play failed:", e);
            setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTrackEnd = () => setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    if (!isPlaying) setIsPlaying(true);
  };
  
  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    if (!isPlaying) setIsPlaying(true);
  };

  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div className="bg-[#050505] border-4 border-cyan-400 p-4 shadow-[8px_8px_0_0_#FF00FF] min-w-[280px] sm:min-w-[360px] text-cyan-400 font-sans tracking-tight">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleTrackEnd}
        preload="metadata"
      />
      
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center border-b-4 border-fuchsia-500 pb-2">
            <span className="text-xl bg-fuchsia-500 text-black px-2 font-mono">AUDIO_SYS</span>
            <span className={`text-xl font-mono ${isPlaying ? 'text-cyan-400 animate-pulse' : 'text-fuchsia-500'}`}>
                {isPlaying ? 'STATUS: ACTIVE' : 'STATUS: IDLE'}
            </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 bg-cyan-400/20 border-2 flex items-center justify-center shrink-0 ${isPlaying ? 'border-fuchsia-500' : 'border-cyan-400'}`}>
             <Disc3 className={`w-8 h-8 ${isPlaying ? 'text-fuchsia-500 animate-[spin_1.5s_linear_infinite]' : 'text-cyan-400'}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm bg-cyan-400 text-black px-1 mb-1 inline-block font-mono">[EXEC_TRACK]</p>
            <p className="text-3xl truncate w-full overflow-hidden text-ellipsis whitespace-nowrap text-fuchsia-500 block">
              {currentTrack.title}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t-2 border-cyan-400 pt-4">
            <div className="flex items-center gap-2">
                <button onClick={skipBack} className="p-2 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_0_#FF00FF] transition-all active:translate-y-0 active:translate-x-0 active:shadow-none bg-[#050505]">
                  <SkipBack className="w-5 h-5" />
                </button>
                
                <button onClick={togglePlay} className="p-2 border-2 border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_0_#00FFFF] transition-all active:translate-y-0 active:translate-x-0 active:shadow-none bg-[#050505]">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>

                <button onClick={skipForward} className="p-2 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_0_#FF00FF] transition-all active:translate-y-0 active:translate-x-0 active:shadow-none bg-[#050505]">
                  <SkipForward className="w-5 h-5" />
                </button>
            </div>
            
            <div className="flex items-center gap-3 w-32 group">
                <button onClick={() => setIsMuted(!isMuted)} className="text-cyan-400 hover:text-fuchsia-500">
                    {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
                <div className="flex-1 h-4 bg-[#050505] border-2 border-cyan-400 relative cursor-pointer group-hover:border-fuchsia-500"
                     onClick={(e) => {
                         const rect = e.currentTarget.getBoundingClientRect();
                         const x = e.clientX - rect.left;
                         setVolume(Math.max(0, Math.min(1, x / rect.width)));
                         setIsMuted(false);
                     }}>
                    <div className="absolute top-0 left-0 h-full bg-cyan-400 group-hover:bg-fuchsia-500" style={{ width: `${(isMuted ? 0 : volume) * 100}%` }} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
