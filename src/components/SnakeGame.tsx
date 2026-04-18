import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 }
];
const INITIAL_DIR = { x: 0, y: -1 };
const INITIAL_SPEED = 140; // ms

type Point = { x: number; y: number };

const randomFood = (): Point => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIR);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const dirRef = useRef(INITIAL_DIR);
  const nextDirRef = useRef(INITIAL_DIR);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIR);
    dirRef.current = INITIAL_DIR;
    nextDirRef.current = INITIAL_DIR;
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(randomFood());
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'Escape') {
        setIsPaused(p => !p);
        return;
      }

      if (isGameOver || isPaused) return;

      const currentDir = dirRef.current;
      let newDir: Point | null = null;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) newDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) newDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) newDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) newDir = { x: 1, y: 0 };
          break;
      }

      if (newDir) {
        nextDirRef.current = newDir;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, isPaused]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prev) => {
        dirRef.current = nextDirRef.current;
        const head = prev[0];
        const newHead = {
          x: head.x + dirRef.current.x,
          y: head.y + dirRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prev;
        }

        if (prev.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(randomFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 30) * 10);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [food, isGameOver, isPaused, score, highScore]);

  const CELL_SIZE = 20; 
  const BOARD_SIZE = GRID_SIZE * CELL_SIZE;

  return (
    <div className="flex flex-col items-center gap-8 select-none font-sans w-full">
      <div className="flex gap-4 sm:gap-12 text-xl font-mono uppercase tracking-widest w-full justify-between items-center px-4 shrink-0 bg-[#050505] border-4 border-fuchsia-500 p-4 shadow-[8px_8px_0_0_#00FFFF]">
        <div className="flex flex-col items-start leading-none">
          <span className="text-cyan-400 text-sm mb-1 bg-cyan-400/20 px-1">DATA_EXTRACTED</span>
          <span className="text-3xl text-fuchsia-500">{String(score).padStart(4, '0')}</span>
        </div>
        <div className="text-fuchsia-500 animate-pulse text-4xl hidden sm:block">
          //
        </div>
        <div className="flex flex-col items-end leading-none">
          <span className="text-fuchsia-500 text-sm mb-1 bg-fuchsia-500/20 px-1">MAX_CAPACITY</span>
          <span className="text-3xl text-cyan-400">{String(highScore).padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative p-2 bg-[#050505] border-4 border-cyan-400 shadow-[8px_8px_0_0_#FF00FF]">
        <div 
          className="relative bg-[#050505] overflow-hidden sm:w-[400px] sm:h-[400px] w-[300px] h-[300px] shadow-[inset_0_0_20px_0_#00FFFF]"
        >
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)]" style={{ backgroundSize: '5% 5%' }}></div>
          
          <div className="absolute inset-0">
            <div 
              className="absolute bg-fuchsia-500 border border-[#050505] animate-pulse"
              style={{
                width: '5%',
                height: '5%',
                left: `${(food.x / GRID_SIZE) * 100}%`,
                top: `${(food.y / GRID_SIZE) * 100}%`,
              }}
            />

            {snake.map((segment, i) => (
              <div
                key={i}
                className={`absolute border border-[#050505] ${i === 0 ? 'bg-white z-10' : 'bg-cyan-400'}`}
                style={{
                  width: '5%',
                  height: '5%',
                  left: `${(segment.x / GRID_SIZE) * 100}%`,
                  top: `${(segment.y / GRID_SIZE) * 100}%`,
                  opacity: i === 0 ? 1 : Math.max(0.4, 1 - (i * 0.02)),
                }}
              />
            ))}
          </div>

          {isGameOver && (
            <div className="absolute inset-0 bg-fuchsia-500/90 flex flex-col items-center justify-center z-20 glitch-container p-4">
              <div className="bg-[#050505] border-4 border-cyan-400 p-4 w-full text-center">
                  <h2 className="text-4xl font-mono text-cyan-400 mb-2 glitch-text" data-text="FATAL_ERR">
                    FATAL_ERR
                  </h2>
                  <p className="text-fuchsia-500 text-lg mb-6 font-sans">MEMORY_CORRUPTION_AT_0x00</p>
                  <button 
                    onClick={resetGame}
                    className="px-6 py-3 border-2 border-cyan-400 bg-black text-cyan-400 hover:bg-cyan-400 hover:text-black font-mono text-xl uppercase w-full transition-colors"
                  >
                    &gt; REBOOT
                  </button>
              </div>
            </div>
          )}

          {!isGameOver && isPaused && (
             <div className="absolute inset-0 bg-[#050505]/80 flex flex-col items-center justify-center z-20">
               <div className="border border-fuchsia-500 bg-[#050505] p-4 inline-block text-center shadow-[4px_4px_0_0_#FF00FF]">
                   <h2 className="text-3xl font-mono text-fuchsia-500 animate-pulse mb-2">
                     PROCESS_HALTED
                   </h2>
                   <div className="text-cyan-400 text-sm font-sans uppercase">
                     AWAITING_INPUT: [SPACE]
                   </div>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
