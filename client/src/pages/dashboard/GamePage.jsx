import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SourceCodeIcon, 
  ArrowRight01Icon, 
  DatabaseIcon, 
  Shield01Icon as ShieldAlert, 
  FlashIcon,
  Clock02Icon,
  Award01Icon,
  CloudIcon,
  Tick02Icon as CheckListIcon,
  Cancel01Icon,
  RefreshIcon,
  SourceCodeIcon as BugIcon,
  Activity01Icon as AlignTopIcon,
  Activity01Icon as ActivityIcon,
  Briefcase02Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import SkeletonComponent from '../../components/ui/Skeleton';

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

const TECH_QUIZ_LEVELS = {
  Beginner: [
    { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Multi Language", "Hyperlink Tool Master Language", "Home Tool Markup Language"], answer: 0 },
    { question: "Which CSS property changes the text color?", options: ["font-style", "text-color", "color", "background-color"], answer: 2 },
    { question: "How do you declare a constant in JavaScript?", options: ["var", "let", "const", "constant"], answer: 2 },
    { question: "What is the purpose of the <head> tag in HTML?", options: ["Shows main content", "Displays header text", "Contains metadata", "Creates a footer"], answer: 2 },
    { question: "Which of these is a JavaScript library?", options: ["Django", "React", "Laravel", "Spring"], answer: 1 }
  ],
  Intermediate: [
    { question: "Which hook is used for side effects in React?", options: ["useState", "useMemo", "useEffect", "useContext"], answer: 2 },
    { question: "What is the Big O of searching in a Balanced BST?", options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], answer: 2 },
    { question: "What does SQL stand for?", options: ["Strong Query Language", "Structured Query Language", "Simple Query List", "System Query Logic"], answer: 1 },
    { question: "In Git, what does 'push' do?", options: ["Downloads code", "Uploads local commits", "Deletes a branch", "Merges branches"], answer: 1 },
    { question: "What is a 'prop' in React?", options: ["A local state", "A function", "Input passed to a component", "A CSS style"], answer: 2 }
  ],
  Advanced: [
    { question: "What is a 'Closure' in JavaScript?", options: ["A browser tab closing", "A function with its lexical environment", "A method to delete variables", "A syntax for loops"], answer: 1 },
    { question: "Which HTTP status code is for 'Internal Server Error'?", options: ["200", "404", "500", "503"], answer: 2 },
    { question: "What is the primary benefit of Indexing in a database?", options: ["Saves disk space", "Makes queries faster", "Ensures data security", "Automatically deletes old data"], answer: 1 },
    { question: "In System Design, what is 'Load Balancing'?", options: ["Balancing heavy hardware", "Distributing traffic across servers", "Increasing database size", "Fixing code bugs"], answer: 1 },
    { question: "What is the difference between '==' and '===' in JS?", options: ["No difference", "=== checks value and type", "== checks type only", "=== is for numbers only"], answer: 1 }
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

// 1. Code Sprint (Typing)
const CodeSprint = ({ onComplete, onExit }) => {
  const [snippet, setSnippet] = useState(CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)]);
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  useEffect(() => {
    if (input.length === 1 && !startTime) setStartTime(Date.now());
    
    // Accuracy
    let errors = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] !== snippet.code[i]) errors++;
    }
    setAccuracy(input.length === 0 ? 100 : Math.max(0, Math.floor(((input.length - errors) / input.length) * 100)));

    // WPM
    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
      const words = input.length / 5;
      setWpm(Math.floor(words / timeElapsed) || 0);
    }

    // Win condition
    if (input === snippet.code) {
      onComplete({ score: Math.max(wpm, 50), accuracy });
    }
  }, [input, snippet.code, startTime, onComplete, wpm, accuracy]);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center bg-[#111] p-4 rounded-2xl border border-white/5">
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">WPM</p>
            <p className="text-2xl font-black text-primary">{wpm}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Accuracy</p>
            <p className="text-2xl font-black text-secondary">{accuracy}%</p>
          </div>
        </div>
        <button onClick={onExit} className="p-2 hover:bg-white/5 rounded-xl transition-colors"><HugeiconsIcon icon={Cancel01Icon} size={20} className="text-neutral-500" /></button>
      </div>

      <div className="bg-[#0c0c0c] p-10 rounded-[2rem] border border-white/[0.05] relative overflow-hidden font-mono min-h-[150px]">
        <div className="absolute top-4 right-6 text-[10px] text-neutral-700 uppercase font-black tracking-widest">{snippet.lang}</div>
        <div className="text-2xl leading-relaxed whitespace-pre-wrap select-none">
          {snippet.code.split("").map((char, i) => {
            let color = "text-neutral-700";
            if (i < input.length) {
              color = input[i] === char ? "text-primary" : "text-red-500 underline";
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
      <p className="text-center text-neutral-500 text-sm italic">Type exactly what you see above. Spaces matter.</p>
    </div>
  );
};

// 2. Bug Hunt (Debugging)
const BugHunt = ({ onComplete, onExit }) => {
  const [level, setLevel] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
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
      }, 1500);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-white">{current.title}</h3>
        <button onClick={onExit} className="p-2 hover:bg-white/5 rounded-xl"><HugeiconsIcon icon={Cancel01Icon} size={20} className="text-neutral-500" /></button>
      </div>

      <div className="bg-[#0c0c0c] p-8 rounded-3xl border border-white/5 font-mono text-sm overflow-x-auto">
        <pre className="text-neutral-400">{current.code}</pre>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {current.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`p-6 rounded-2xl border text-left font-bold transition-all ${
              selected === i 
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                : "bg-[#111] border-white/5 text-neutral-400 hover:border-white/20"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <button
        disabled={selected === null}
        onClick={handleCheck}
        className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-xs disabled:opacity-50 hover:scale-[1.02] transition-all rounded-2xl"
      >
        Submit Patch
      </button>

      {isCorrect === true && <div className="text-center text-secondary font-black animate-bounce">Correct! Moving to next level...</div>}
      {isCorrect === false && <div className="text-center text-red-500 font-black">Try again! That's not the bug.</div>}
    </div>
  );
};

// 3. Tech Quiz (Knowledge)
const TechQuiz = ({ onComplete, onExit }) => {
  const [difficulty, setDifficulty] = useState(null);
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPaused, setIsPaused] = useState(false);
  
  const questions = difficulty ? TECH_QUIZ_LEVELS[difficulty] : [];
  const current = questions[level];

  // Configure difficulty settings
  const config = {
    Beginner: { time: 20, multiplier: 10 },
    Intermediate: { time: 15, multiplier: 25 },
    Advanced: { time: 10, multiplier: 50 }
  }[difficulty || 'Intermediate'];

  useEffect(() => {
    if (!difficulty || isPaused) return;
    if (timeLeft === 0) {
      handleAnswer(-1);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPaused, difficulty]);

  const handleAnswer = (idx) => {
    setIsPaused(true);
    let newScore = score;
    if (config && idx === current.answer) {
      newScore += config.multiplier;
      
      // Log activity for heatmap
      try {
        const token = localStorage.getItem("token");
        fetch("/api/user/activity", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ actionType: "Game", details: "Scored points in coding game", points: config.multiplier })
        }).catch(err => console.error("Activity API error:", err));
      } catch(e) {}
    }
    setScore(newScore);

    setTimeout(() => {
      if (config && level < questions.length - 1) {
        setLevel(level + 1);
        setTimeLeft(config.time);
        setIsPaused(false);
      } else {
        onComplete({ score: newScore, difficulty });
      }
    }, 1000);
  };

  if (!difficulty) {
    return (
      <div className="space-y-8 py-10 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
           <h2 className="text-4xl font-black text-white font-headline uppercase italic">Select Difficulty</h2>
           <p className="text-neutral-500">Choose your level to earn corresponding XP rewards.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
          {Object.keys(TECH_QUIZ_LEVELS).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setDifficulty(lvl);
                setTimeLeft({ Beginner: 20, Intermediate: 15, Advanced: 10 }[lvl] || 15);
              }}
              className="p-8 bg-[#111] border border-white/[0.05] rounded-3xl text-left hover:border-primary transition-all group flex justify-between items-center"
            >
              <div>
                <p className="text-xl font-bold text-white">{lvl}</p>
                <p className="text-xs text-neutral-600 mt-1 uppercase tracking-widest font-black">
                  {lvl === 'Beginner' ? '20s / +10 XP' : lvl === 'Intermediate' ? '15s / +25 XP' : '10s / +50 XP'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-all">
                 <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
              </div>
            </button>
          ))}
        </div>
        <button onClick={onExit} className="block mx-auto text-neutral-600 hover:text-white text-xs font-black uppercase tracking-widest mt-8">Cancel</button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <span className="px-4 py-2 bg-primary/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20 flex items-center gap-2">
             <span className="text-primary">●</span> {difficulty} • Question {level + 1}/{questions.length}
          </span>
          <span className="px-4 py-2 bg-secondary/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-secondary/20 flex items-center gap-2">
            <HugeiconsIcon icon={FlashIcon} size={14} className="text-secondary" /> Score: {score}
          </span>
        </div>
        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${timeLeft < 5 ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' : 'bg-white/5 text-white border-white/10'}`}>
          <HugeiconsIcon icon={Clock02Icon} size={14} /> {timeLeft}s
        </div>
        <button onClick={onExit} className="p-2 hover:bg-white/5 rounded-xl transition-colors"><HugeiconsIcon icon={Cancel01Icon} size={20} className="text-neutral-500" /></button>
      </div>

      <div className="space-y-4">
         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / (config?.time || 15)) * 100}%` }}
              className={`h-full ${timeLeft < 5 ? 'bg-red-500' : 'bg-primary'} transition-colors duration-1000`}
            />
         </div>
         <h2 className="text-3xl font-black text-white leading-tight font-headline italic uppercase">{current.question}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {current.options.map((opt, i) => (
          <button
            key={i}
            disabled={isPaused}
            onClick={() => handleAnswer(i)}
            className="p-6 bg-[#111] border border-white/5 rounded-2xl text-left font-bold text-neutral-400 hover:bg-primary hover:text-white hover:border-primary transition-all group flex justify-between items-center disabled:opacity-50"
          >
            {opt}
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
};

// 4. Output Oracle (Output Prediction)
const OutputOracle = ({ onComplete, onExit }) => {
  const [level, setLevel] = useState(0);
  const current = OUTPUT_ORACLE_DATA[level];

  const handleSelect = (idx) => {
    if (idx === current.answer) {
      if (level < OUTPUT_ORACLE_DATA.length - 1) {
        setLevel(level + 1);
      } else {
        onComplete({ score: 100 });
      }
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-white font-headline italic uppercase">Output Oracle</h3>
        <button onClick={onExit} className="p-2 hover:bg-white/5 rounded-xl"><HugeiconsIcon icon={Cancel01Icon} size={20} className="text-neutral-500" /></button>
      </div>

      <p className="text-neutral-500 font-medium italic">Predict the result of the console output:</p>

      <div className="bg-[#0c0c0c] p-8 rounded-3xl border border-white/5 font-mono text-lg">
        <code className="text-primary">{current.code}</code>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {current.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className="p-8 bg-[#111] border border-white/5 rounded-3xl font-black text-xl text-white hover:border-primary/50 transition-all active:scale-95"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Main Page ---

export default function GamePage() {
  const [activeGame, setActiveGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState('lobby');
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleGameComplete = (result) => {
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
      <div className="max-w-[1500px] mx-auto space-y-12 animate-in fade-in duration-500">
        <SkeletonComponent className="w-full h-96 rounded-[2.5rem]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1,2,3,4].map(i => <SkeletonComponent key={i} className="w-full h-64 rounded-[2rem]" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1500px] mx-auto space-y-12 pb-20 px-4 md:px-0">
      <AnimatePresence mode="wait">
        {gameState === 'lobby' && (
          <motion.div 
            key="lobby"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-12"
          >
            <section className="relative overflow-hidden rounded-[3rem] bg-[#0e0e0e] border border-white/[0.06] p-10 md:p-16 shadow-2xl">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase border border-primary/20">
                      Championship Mode
                    </span>
                    <span className="text-white/40 text-[10px] uppercase font-black tracking-widest italic">Levels: Beginner to Advanced</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9] font-headline italic uppercase">
                    Tech Quiz <br/><span className="text-primary opacity-40">Marathon</span>
                  </h1>
                  <p className="text-lg text-neutral-500 max-w-xl font-medium italic">
                    Master the stack with our tiered technical challenges. Start as a Rookie, finish as a System Architect.
                  </p>
                  <button 
                    onClick={() => { setActiveGame('quiz'); setGameState('playing'); }}
                    className="px-10 py-5 bg-primary text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                  >
                    Select Level & Start <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-center p-12 bg-white/[0.02] rounded-full border border-white/[0.05] shadow-2xl group">
                  <HugeiconsIcon icon={AlignTopIcon} size={80} className="text-primary group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-2xl font-black text-white font-headline italic uppercase tracking-tighter">Mini_Arenas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { id: 'sprint', name: 'Code Sprint', desc: 'Typing speed test for devs', icon: SourceCodeIcon, color: 'text-primary', bg: 'bg-primary/5' },
                  { id: 'hunt', name: 'Bug Hunt', desc: 'Find and fix hidden bugs', icon: BugIcon, color: 'text-amber-500', bg: 'bg-amber-500/5' },
                  { id: 'oracle', name: 'Output Oracle', desc: 'Predict the code result', icon: DatabaseIcon, color: 'text-secondary', bg: 'bg-secondary/5' },
                ].map((game) => (
                  <button
                    key={game.id}
                    onClick={() => { setActiveGame(game.id); setGameState('playing'); }}
                    className="p-9 bg-[#0e0e0e] border border-white/[0.06] rounded-[2.5rem] text-left hover:border-primary/50 transition-all hover:-translate-y-2 group shadow-xl"
                  >
                    <div className={`w-14 h-14 ${game.bg} rounded-2xl flex items-center justify-center ${game.color} mb-8 group-hover:bg-primary group-hover:text-white transition-all`}>
                      <HugeiconsIcon icon={game.icon} size={28} variant="stroke" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2 italic uppercase tracking-tighter">{game.name}</h3>
                    <p className="text-xs text-neutral-500 font-medium italic">{game.desc}</p>
                    <div className="pt-8 mt-8 border-t border-white/[0.03] flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                      Initiate Protocol <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="max-w-4xl mx-auto py-10 px-6"
          >
            <div className="bg-[#0e0e0e] border border-white/[0.08] rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-black/50">
              {activeGame === 'sprint' && <CodeSprint onComplete={handleGameComplete} onExit={reset} />}
              {activeGame === 'hunt' && <BugHunt onComplete={handleGameComplete} onExit={reset} />}
              {activeGame === 'quiz' && <TechQuiz onComplete={handleGameComplete} onExit={reset} />}
              {activeGame === 'oracle' && <OutputOracle onComplete={handleGameComplete} onExit={reset} />}
            </div>
          </motion.div>
        )}

        {gameState === 'results' && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto text-center space-y-10 py-20"
          >
            <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto text-secondary border border-secondary/20 shadow-2xl">
              <HugeiconsIcon icon={Award01Icon} size={48} variant="stroke" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white mb-4 font-headline italic uppercase tracking-tighter leading-none">GG, Developer!</h1>
              <p className="text-neutral-500 font-medium italic">Challenge completed on <span className="text-white font-bold">{lastResult?.difficulty || 'Standard'}</span> mode.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 bg-[#0e0e0e] rounded-[2rem] border border-white/[0.06] shadow-xl">
                <p className="text-[10px] text-neutral-600 font-black uppercase tracking-widest mb-2">Impact Gained</p>
                <p className="text-4xl font-black text-primary italic">+{lastResult?.score || 100} XP</p>
              </div>
              <div className="p-8 bg-[#0e0e0e] rounded-[2rem] border border-white/[0.06] shadow-xl">
                <p className="text-[10px] text-neutral-600 font-black uppercase tracking-widest mb-2">Rank Status</p>
                <p className="text-4xl font-black text-secondary italic uppercase tracking-tighter">Elite</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={reset} className="flex-1 py-5 bg-white text-black rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] hover:bg-neutral-200 transition-all italic shadow-xl">
                Return to Lobby
              </button>
              <button 
                onClick={() => setGameState('playing')} 
                className="flex-1 py-5 bg-[#0e0e0e] text-white border border-white/[0.06] rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] hover:bg-white/5 transition-all flex items-center justify-center gap-2 italic shadow-xl"
              >
                <HugeiconsIcon icon={RefreshIcon} size={16} /> Re-Initiate
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
