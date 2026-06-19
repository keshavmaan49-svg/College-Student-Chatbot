import React from 'react';
import { Sparkles, MessageSquare, BookOpen, Calculator, CheckSquare, Award, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  const features = [
    { 
      icon: MessageSquare, 
      title: 'AI Learning Assistant', 
      desc: 'Multi-turn conversational chatbot with voice dictation and text-to-speech, supporting six languages (English, Hindi, Spanish, French, Tamil, Telugu).' 
    },
    { 
      icon: BookOpen, 
      title: 'AI Study Vault', 
      desc: 'Notes editor with debounced auto-saving and AI-generated study decks; flashcards with 3D flip animations built using CSS 3D perspective.' 
    },
    { 
      icon: CheckSquare, 
      title: 'Attendance Planner', 
      desc: 'Attendance tracker with a condonation calculator and a dynamic advisor for attendance optimization.' 
    },
    { 
      icon: Calculator, 
      title: 'GPA Calculator', 
      desc: 'Indian 10-point ledger with semester GPA tracking and a CGPA predictor that estimates grades required to hit future targets.' 
    },
    { 
      icon: Sparkles, 
      title: 'Multi-Model AI Orchestration', 
      desc: 'Integrated OpenAI GPT-4o-mini and Google Gemini 1.5 with automatic fallback to a local keyword-matching engine.' 
    },
    { 
      icon: Award, 
      title: 'PDF Resume Builder', 
      desc: 'Interactive CV creator using native browser print-to-PDF with media-query CSS for clean print output.' 
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Glow Blobs */}
      <div className="glow-blob-purple w-[400px] h-[400px] top-[-100px] left-[-100px] opacity-40"></div>
      <div className="glow-blob-cyan w-[450px] h-[450px] bottom-[-100px] right-[-100px] opacity-40"></div>

      {/* Navbar */}
      <nav className="h-20 px-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-wider text-white">Aegis</span>
        </div>
        <button 
          onClick={onGetStarted}
          className="px-5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold hover:bg-slate-800 transition-all duration-300"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center z-10 flex-grow">
        {/* Left Side */}
        <div className="space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Aegis Companion
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Elevate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">
              College Studies
            </span> <br />
            With Aegis Companion.
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-lg">
            Manage attendance, calculate CGPA, organize lecture notes, draft professional resumes, and study with an intelligent learning companion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button 
              onClick={onGetStarted}
              className="glass-btn-primary flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </button>
            <a 
              href="#features"
              className="glass-btn-secondary text-center"
            >
              Explore Features
            </a>
          </div>
          <div className="flex items-center gap-6 text-slate-500 text-xs font-semibold pt-4">
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> SECURE AUTH</div>
            <div>•</div>
            <div>COLLEGE & UNIVERSITY READY</div>
            <div>•</div>
            <div>OFFLINE ENGINE FALLBACK</div>
          </div>
        </div>

        {/* Right Side: Mock UI Card */}
        <div className="relative">
          {/* Decorative gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-emerald-500 rounded-2xl filter blur-3xl opacity-10 -z-10 transform scale-95 animate-pulse-slow"></div>

          {/* Floating UI Widget */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-xs text-slate-500">Aegis Companion</span>
            </div>

            {/* Simulated Chat bubbles */}
            <div className="space-y-4 text-sm mb-6">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold text-white">S</div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-left max-w-[80%] text-slate-300">
                  Can you help me check if I can skip the next 3 DBMS lectures without dropping below 75% attendance?
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <div className="p-3 rounded-2xl bg-brand-600 text-left max-w-[80%] text-white shadow-md">
                  According to your log: you have attended **17 out of 20 classes (85%)**. Skipping 3 lectures will put you at **17/23 (73.9%)**, which is below your 75% target! You can skip at most **1** lecture.
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white">AC</div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 border-t border-slate-800/60 pt-4">
              <div className="text-center p-2 rounded-xl bg-slate-950/40 border border-slate-800/40">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">CGPA</div>
                <div className="text-sm font-bold text-brand-400">8.92</div>
              </div>
              <div className="text-center p-2 rounded-xl bg-slate-950/40 border border-slate-800/40">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">ATTENDANCE</div>
                <div className="text-sm font-bold text-emerald-400">82.4%</div>
              </div>
              <div className="text-center p-2 rounded-xl bg-slate-950/40 border border-slate-800/40">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">QUIZZES</div>
                <div className="text-sm font-bold text-emerald-400">12 / 12</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-900 z-10 w-full">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold">Unmatched Academic Tools</h2>
          <p className="text-slate-400 text-sm">
            Everything a university student needs, packed into a single, high-performance web suite with glassmorphic olive visuals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div 
                key={index}
                className="glass-card p-6 flex flex-col items-start gap-4 text-left border border-slate-800 hover:shadow-brand-500/5 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-200">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="h-16 border-t border-slate-900/60 px-6 flex items-center justify-between text-xs text-slate-500 max-w-7xl mx-auto w-full z-10">
        <div>© 2026 Aegis Student Platform.</div>
        <div>Built for modern university students.</div>
      </footer>
    </div>
  );
}
