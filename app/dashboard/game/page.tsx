"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SourceCodeIcon, 
  ArrowRight01Icon, 
  DatabaseIcon, 
  FlashIcon,
  Clock02Icon,
  Award01Icon,
  Cancel01Icon,
  RefreshIcon,
  BugIcon,
  AlignTopIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import SkeletonComponent from '@/components/ui/Skeleton';

// --- Game Data ---
const CODE_SNIPPETS = [
  { lang: 'JavaScript', code: "const findSum = (arr) => arr.reduce((acc, curr) => acc + curr, 0);" },
  { lang: 'TypeScript', code: "interface User { id: number; name: string; email?: string; }" },
  { lang: 'React', code: "const [count, setCount] = useState<number>(0);" },
  { lang: 'Python', code: "def get_data(url):\n    return requests.get(url).json()" },
  { lang: 'Next.js', code: "export default async function Page({ params }) { return <div>{params.id}</div>; }" }
];

const BUG_HUNT_DATA = [
  {
    title: "The Ghostly Map",
    code: "const users = [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}];\nconst names = users.map(u => {\n  u.name;\n});",
    options: ["Missing return statement", "Map doesn't exist on array", "User object is empty", "Syntax error in arrow function"],
    answer: 0,
    explanation: "The arrow function body uses curly braces {} but doesn't explicitly return u.name. Use () or return u.name;"
  },
  {
    title: "Dependency Loop",
    code: "useEffect(() => {\n  setCount(count + 1);\n}, [count]);",
    options: ["Infinite loop", "Hook error", "Count is undefined", "Missing dependency"],
    answer: 0,
    explanation: "Updating count inside useEffect with [count] as a dependency triggers the effect again, causing an infinite loop."
  }
];

const TECH_QUIZ_DATA: Record<string, any[]> = {
  HTML: [
    { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Multi Language", "Hyperlink Tool Master Language", "Home Tool Markup Language"], answer: 0 },
    { question: "Which tag is used for the largest heading?", options: ["<h6>", "<head>", "<h1>", "<header>"], answer: 2 },
    { question: "What is the correct tag for a line break?", options: ["<lb>", "<break>", "<br>", "<hr>"], answer: 2 },
    { question: "Which attribute is used to provide an image source?", options: ["href", "src", "link", "alt"], answer: 1 },
    { question: "How can you make a numbered list?", options: ["<ul>", "<li>", "<ol>", "<list>"], answer: 2 }
  ],
  CSS: [
    { question: "What does CSS stand for?", options: ["Colorful Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets"], answer: 2 },
    { question: "Which HTML tag is used to define an internal style sheet?", options: ["<css>", "<script>", "<style>", "<design>"], answer: 2 },
    { question: "Which property is used to change the background color?", options: ["color", "bgcolor", "background-color", "background-style"], answer: 2 },
    { question: "How do you add a background color for all <h1> elements?", options: ["h1.all {color:blue;}", "all.h1 {background-color:blue;}", "h1 {background-color:blue;}", "h1 {color:blue;}"], answer: 2 }
  ],
  JavaScript: [
    { question: "Inside which HTML element do we put the JavaScript?", options: ["<js>", "<script>", "<javascript>", "<scripting>"], answer: 1 },
    { question: "How do you write 'Hello World' in an alert box?", options: ["msg('Hello World')", "alertBox('Hello World')", "alert('Hello World')", "console.log('Hello World')"], answer: 2 },
    { question: "How do you declare a JavaScript variable?", options: ["v carName", "var carName", "variable carName", "set carName"], answer: 1 },
    { question: "Which operator is used to assign a value to a variable?", options: ["*", "-", "=", "x"], answer: 2 }
  ]
};

const OUTPUT_ORACLE_DATA = [
  {
    code: "console.log(typeof null);",
    options: ["'null'", "'undefined'", "'object'", "'string'"],
    answer: 2
  },
  {
    code: "console.log(0.1 + 0.2 === 0.3);",
    options: ["true", "false", "undefined", "Error"],
    answer: 1
  }
];

// --- Sub-Components: Games ---

// 1. Code Sprint
const CodeSprint = ({ onComplete, onExit }: any) => {
  const [snippet] = useState(CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)]);
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  useEffect(() => {
    if (input.length === 1 && !startTime) setStartTime(Date.now());
    
    let errors = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] !== snippet.code[i]) errors++;
    }
    const currentAccuracy = input.length === 0 ? 100 : Math.max(0, Math.floor(((input.length - errors) / input.length) * 100));
    setAccuracy(currentAccuracy);

    let currentWpm = 0;
    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60;
      const words = input.length / 5;
      currentWpm = Math.floor(words / timeElapsed) || 0;
      setWpm(currentWpm);
    }

    if (input === snippet.code) {
      onComplete({ score: Math.max(currentWpm, 50), accuracy: currentAccuracy });
    }
  }, [input, snippet.code, startTime, onComplete]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center bg-[#090909] p-4 rounded-xl border border-white/[0.05]">
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest">WPM</p>
            <p className="text-xl font-black text-emerald-400">{wpm}</p>
          </div>
          <div className="text-center border-l border-white/[0.04] pl-6">
            <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest">Accuracy</p>
            <p className="text-xl font-black text-cyan-400">{accuracy}%</p>
          </div>
        </div>
        <button onClick={onExit} className="p-2 hover:bg-white/5 rounded-lg transition-colors"><HugeiconsIcon icon={Cancel01Icon} size={16} className="text-neutral-500" /></button>
      </div>

      <div className="bg-[#090909] p-8 rounded-xl border border-white/[0.05] relative overflow-hidden font-mono min-h-[120px]">
        <div className="absolute top-3 right-4 text-[8px] text-neutral-600 uppercase font-black tracking-widest">{snippet.lang}</div>
        <div className="text-lg leading-relaxed whitespace-pre-wrap select-none">
          {snippet.code.split("").map((char: string, i: number) => {
            let color = "text-neutral-700";
            if (i < input.length) {
              color = input[i] === char ? "text-white" : "text-rose-500 underline";
            }
            return <span key={i} className={color}>{char}</span>;
          })}
        </div>
        <textarea
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-default resize-none"
        />
      </div>
      <p className="text-center text-neutral-500 text-xs uppercase tracking-widest font-semibold">Type exactly what you see above. Spaces matter.</p>
    </div>
  );
};

// 2. Bug Hunt
const BugHunt = ({ onComplete, onExit }: any) => {
  const [level, setLevel] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const current = BUG_HUNT_DATA[level];

  const handleCheck = () => {
    if (selected === current.answer) {
      setIsCorrect(true);
      setTimeout(() => {
        if (level < BUG_HUNT_DATA.length - 1) {
          setLevel(level + 1);
          setSelected(null);
          setIsCorrect(null);
        } else {
          onComplete({ score: 150 });
        }
      }, 1200);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center border-b border-white/[0.04] pb-4">
        <h3 className="text-lg font-black text-white uppercase">{current.title}</h3>
        <button onClick={onExit} className="p-2 hover:bg-white/5 rounded-lg"><HugeiconsIcon icon={Cancel01Icon} size={16} className="text-neutral-500" /></button>
      </div>

      <div className="bg-[#090909] p-6 rounded-xl border border-white/[0.05] font-mono text-xs overflow-x-auto">
        <pre className="text-neutral-400">{current.code}</pre>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {current.options.map((opt: string, i: number) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`p-4 rounded-lg border text-left text-xs font-bold transition-all ${
              selected === i 
                ? "bg-white border-white text-black" 
                : "bg-[#090909] border-white/[0.05] text-neutral-400 hover:border-white/20"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <button
        disabled={selected === null}
        onClick={handleCheck}
        className="w-full py-4 bg-white text-black rounded-lg font-black uppercase tracking-widest text-[10px] disabled:opacity-50 transition-all hover:bg-neutral-200"
      >
        Submit Patch
      </button>

      {isCorrect === true && <div className="text-center text-emerald-400 text-xs font-black animate-pulse">Correct! Loading next level...</div>}
      {isCorrect === false && <div className="text-center text-rose-400 text-xs font-black">Try again! That's not the bug.</div>}
    </div>
  );
};

// 3. Tech Quiz
const TechQuiz = ({ onComplete, onExit }: any) => {
  const [category, setCategory] = useState<string | null>(null);
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPaused, setIsPaused] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  
  const current: any = shuffledQuestions[level];

  const handleStart = (cat: string) => {
    const questions = [...TECH_QUIZ_DATA[cat]].sort(() => Math.random() - 0.5);
    setShuffledQuestions(questions);
    setCategory(cat);
    setTimeLeft(15);
    setIsPaused(false);
  };

  useEffect(() => {
    if (!category || isPaused) return;
    if (timeLeft === 0) {
      handleAnswer(-1);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPaused, category]);

  const handleAnswer = (idx: number) => {
    setIsPaused(true);
    let newScore = score;
    if (idx === current.answer) {
      newScore += 25;
    }
    setScore(newScore);

    setTimeout(() => {
      if (level < shuffledQuestions.length - 1 && level < 4) {
        setLevel(level + 1);
        setTimeLeft(15);
        setIsPaused(false);
      } else {
        onComplete({ score: newScore, difficulty: category });
      }
    }, 1000);
  };

  if (!category) {
    return (
      <div className="space-y-6 py-6 animate-in fade-in duration-300">
        <div className="text-center space-y-2">
           <h2 className="text-2xl font-black text-white uppercase">Select Module</h2>
           <p className="text-neutral-500 text-xs uppercase tracking-wider font-semibold">Master each stack. 5 random questions per session.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4">
          {Object.keys(TECH_QUIZ_DATA).map((cat: string) => (
            <button
              key={cat}
              onClick={() => handleStart(cat)}
              className="p-6 bg-[#090909] border border-white/[0.05] rounded-xl text-left hover:border-white/20 transition-all group flex justify-between items-center"
            >
              <div>
                <p className="text-base font-black text-white uppercase tracking-tight">{cat}</p>
                <p className="text-[8px] text-neutral-600 mt-1 uppercase tracking-widest font-black">
                   Practice Node
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                 <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="text-white group-hover:text-black" />
              </div>
            </button>
          ))}
        </div>
        <button onClick={onExit} className="block mx-auto text-neutral-600 hover:text-white text-[9px] font-black uppercase tracking-widest mt-6">Cancel Mission</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex gap-2">
          <span className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">
             {category} • {level + 1}/5
          </span>
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1.5">
            <HugeiconsIcon icon={FlashIcon} size={10} /> Score: {score}
          </span>
        </div>
        <div className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${timeLeft < 5 ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' : 'bg-white/5 text-white border-white/10'}`}>
          <HugeiconsIcon icon={Clock02Icon} size={10} /> {timeLeft}s
        </div>
        <button onClick={onExit} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"><HugeiconsIcon icon={Cancel01Icon} size={14} className="text-neutral-500" /></button>
      </div>

      <div className="space-y-3">
         <div className="h-1 bg-white/[0.02] border border-white/[0.05] rounded-full overflow-hidden p-0.5">
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / 15) * 100}%` }}
              className={`h-full ${timeLeft < 5 ? 'bg-rose-500' : 'bg-white'} rounded-full`}
            />
         </div>
         <h2 className="text-xl font-black text-white leading-tight uppercase tracking-tight">{current?.question}</h2>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {current?.options.map((opt: string, i: number) => (
          <button
            key={i}
            disabled={isPaused}
            onClick={() => handleAnswer(i)}
            className="p-4 bg-[#090909] border border-white/[0.05] rounded-lg text-left text-xs font-bold text-neutral-400 hover:bg-white hover:text-black hover:border-white transition-all flex justify-between items-center disabled:opacity-50"
          >
            {opt}
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="opacity-0 -translate-x-2 hover:opacity-100 hover:translate-x-0 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
};

// 4. Output Oracle
const OutputOracle = ({ onComplete, onExit }: any) => {
  const [level, setLevel] = useState(0);
  const current = OUTPUT_ORACLE_DATA[level];

  const handleSelect = (idx: number) => {
    if (idx === current.answer) {
      if (level < OUTPUT_ORACLE_DATA.length - 1) {
        setLevel(level + 1);
      } else {
        onComplete({ score: 100 });
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center border-b border-white/[0.04] pb-4">
        <h3 className="text-lg font-black text-white uppercase">Output Oracle</h3>
        <button onClick={onExit} className="p-2 hover:bg-white/5 rounded-lg"><HugeiconsIcon icon={Cancel01Icon} size={16} className="text-neutral-500" /></button>
      </div>

      <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Predict the result of the console output:</p>

      <div className="bg-[#090909] p-6 rounded-xl border border-white/[0.05] font-mono text-xs">
        <code className="text-cyan-400">{current.code}</code>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {current.options.map((opt: string, i: number) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className="p-6 bg-[#090909] border border-white/[0.05] rounded-lg font-black text-sm text-white hover:border-white/20 transition-all active:scale-95"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Main Page ---

export default function GameModePage() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'results'>('lobby');
  const [lastResult, setLastResult] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleGameComplete = (result: any) => {
    setLastResult(result);
    setGameState('results');
  };

  const reset = () => {
    setActiveGame(null);
    setGameState('lobby');
    setLastResult(null);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 p-1 sm:p-2">
        <SkeletonComponent className="w-full h-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <SkeletonComponent key={i} className="w-full h-40 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 p-1 sm:p-2">
      <AnimatePresence mode="wait">
        {gameState === 'lobby' && (
          <motion.div 
            key="lobby"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            {/* Featured Section: Tech Quiz */}
            <section className="relative overflow-hidden rounded-xl bg-[#090909] border border-white/[0.05] p-8 md:p-12 shadow-lg">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[8px] font-black tracking-widest uppercase border border-indigo-500/20">
                      Standard Arena
                    </span>
                    <span className="text-neutral-500 text-[8px] uppercase font-black tracking-widest">Multiple choice segments</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase leading-none">
                    Tech Quiz <br/><span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Challenge</span>
                  </h1>
                  <p className="text-xs text-neutral-400 max-w-md leading-relaxed font-semibold">
                    Verify your core skills in standard technologies. Attain full alignment across frontend and backend modules.
                  </p>
                  <button 
                    onClick={() => { setActiveGame('quiz'); setGameState('playing'); }}
                    className="px-6 py-3 bg-white text-black rounded-lg font-black uppercase tracking-widest text-[9px] hover:bg-neutral-200 transition-all flex items-center gap-2"
                  >
                    Select Arena & Start <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-center p-8 bg-white/[0.01] rounded-full border border-white/[0.04] shadow-md flex-shrink-0">
                  <HugeiconsIcon icon={AlignTopIcon} size={54} className="text-indigo-400" />
                </div>
              </div>
            </section>

            {/* Other Arenas */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Mini Challenges</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'sprint', name: 'Code Sprint', desc: 'Verify your keystroke accuracy and speed.', icon: SourceCodeIcon, color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10' },
                  { id: 'hunt', name: 'Bug Hunt', desc: 'Identify syntax issues and runtime anomalies.', icon: BugIcon, color: 'text-amber-400', bg: 'bg-amber-500/5', border: 'border-amber-500/10' },
                  { id: 'oracle', name: 'Output Oracle', desc: 'Predict evaluations of advanced codeblocks.', icon: DatabaseIcon, color: 'text-cyan-400', bg: 'bg-cyan-500/5', border: 'border-cyan-500/10' },
                ].map((game: any) => (
                  <button
                    key={game.id}
                    onClick={() => { setActiveGame(game.id); setGameState('playing'); }}
                    className={`p-6 bg-[#090909] border ${game.border} rounded-xl text-left hover:border-white/20 transition-all group flex flex-col justify-between h-48 shadow-md`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className={`w-10 h-10 ${game.bg} rounded-lg flex items-center justify-center ${game.color} transition-all`}>
                        <HugeiconsIcon icon={game.icon} size={18} />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <HugeiconsIcon icon={ArrowRight01Icon} size={10} className="text-white group-hover:text-black" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-0.5">{game.name}</h3>
                      <p className="text-[10px] text-neutral-500 leading-normal font-semibold">{game.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="max-w-2xl mx-auto py-6"
          >
            {activeGame === 'sprint' && <CodeSprint onComplete={handleGameComplete} onExit={reset} />}
            {activeGame === 'hunt' && <BugHunt onComplete={handleGameComplete} onExit={reset} />}
            {activeGame === 'quiz' && <TechQuiz onComplete={handleGameComplete} onExit={reset} />}
            {activeGame === 'oracle' && <OutputOracle onComplete={handleGameComplete} onExit={reset} />}
          </motion.div>
        )}

        {gameState === 'results' && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center space-y-6 py-12"
          >
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/20 shadow-md">
              <HugeiconsIcon icon={Award01Icon} size={32} />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-white uppercase">Challenge Cleared</h1>
              <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Completed in <span className="text-white font-bold">{lastResult?.difficulty || 'Practice'}</span> mode.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#090909] rounded-lg border border-white/[0.05]">
                <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest mb-1">Impact Gained</p>
                <p className="text-xl font-black text-emerald-400">+{lastResult?.score || 100} XP</p>
              </div>
              <div className="p-4 bg-[#090909] rounded-lg border border-white/[0.05]">
                <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest mb-1">Rating status</p>
                <p className="text-xl font-black text-cyan-400">Synchronized</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={reset} className="flex-1 py-3 bg-white text-black rounded-lg font-black uppercase tracking-widest text-[9px] hover:bg-neutral-200 transition-all">
                Lobby
              </button>
              <button 
                onClick={() => setGameState('playing')} 
                className="flex-1 py-3 bg-[#090909] text-white border border-white/[0.08] rounded-lg font-black uppercase tracking-widest text-[9px] hover:bg-white/5 transition-all flex items-center justify-center gap-1.5"
              >
                <HugeiconsIcon icon={RefreshIcon} size={12} /> Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
