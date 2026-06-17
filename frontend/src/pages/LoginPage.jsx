import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Sparkles, User, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusInput, setFocusInput] = useState(''); // 'fullName', 'username', 'password', ''

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName || !username || !password) {
          throw new Error('Please enter all fields');
        }
        const email = username.includes('@') ? username : `${username}@college.edu`;
        await register(fullName, email, password);
      } else {
        if (!username || !password) {
          throw new Error('Please enter both username and password');
        }
        const email = username.includes('@') ? username : `${username}@college.edu`;
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || 'Action failed. Please check credentials or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 overflow-hidden grid-bg">
      {/* Background Neon Glow Blobs */}
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-brand-500/15 blur-[100px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full bg-indigo-500/15 blur-[100px] pointer-events-none animate-pulse-slow"></div>

      {/* Login Card Panel */}
      <div className="w-full max-w-md backdrop-blur-2xl bg-slate-900/60 border border-slate-800/80 p-8 lg:p-10 rounded-[32px] shadow-2xl relative z-10 space-y-8 transition-all duration-300 hover:border-brand-500/30">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-1 shadow-inner shadow-brand-500/5 hover:scale-105 transition-transform duration-300">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300">
            {isSignUp ? 'Create Student Account' : 'Aegis Student Portal'}
          </h2>
          <p className="text-slate-400 text-xs font-medium">
            {isSignUp ? 'Sign up below to create a new study companion profile.' : 'Sign in to access study vaults, AI tutor, and trackers.'}
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center animate-shake">
            {error}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          
          {/* Full Name Input (Sign Up only) */}
          {isSignUp && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pl-1" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative">
                <User className={`absolute left-4 top-[15px] w-4.5 h-4.5 transition-colors duration-250 ${focusInput === 'fullName' ? 'text-brand-400' : 'text-slate-500'}`} />
                <input
                  id="fullName"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onFocus={() => setFocusInput('fullName')}
                  onBlur={() => setFocusInput('')}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all duration-200 text-slate-100 placeholder-slate-600 text-sm"
                />
              </div>
            </div>
          )}

          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pl-1" htmlFor="username">
              {isSignUp ? 'Username / Email' : 'Username'}
            </label>
            <div className="relative">
              <User className={`absolute left-4 top-[15px] w-4.5 h-4.5 transition-colors duration-250 ${focusInput === 'username' ? 'text-brand-400' : 'text-slate-500'}`} />
              <input
                id="username"
                type="text"
                placeholder={isSignUp ? "e.g. johndoe" : "keshavmaan"}
                value={username}
                onFocus={() => setFocusInput('username')}
                onBlur={() => setFocusInput('')}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all duration-200 text-slate-100 placeholder-slate-600 text-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pl-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-4 top-[15px] w-4.5 h-4.5 transition-colors duration-250 ${focusInput === 'password' ? 'text-brand-400' : 'text-slate-500'}`} />
              <input
                id="password"
                type="password"
                placeholder="keshav"
                value={password}
                onFocus={() => setFocusInput('password')}
                onBlur={() => setFocusInput('')}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all duration-200 text-slate-100 placeholder-slate-600 text-sm"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold shadow-lg hover:shadow-brand-500/25 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (isSignUp ? 'Registering...' : 'Logging in...') : (isSignUp ? 'Register Account' : 'Enter Dashboard')} 
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </form>

        {/* Toggle link */}
        <div className="text-center text-xs">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setUsername('');
              setPassword('');
            }}
            className="text-brand-400 hover:text-brand-300 font-semibold transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        {/* Credentials Info Panel */}
        {!isSignUp && (
          <div 
            onClick={() => {
              setUsername('keshavmaan');
              setPassword('keshav');
            }}
            className="p-4 bg-slate-950/40 border border-slate-800/40 rounded-2xl text-[10px] text-slate-400 flex flex-wrap items-center justify-center gap-2 cursor-pointer hover:bg-slate-900/30 hover:border-brand-500/20 transition-all duration-200"
            title="Click to auto-fill demo credentials"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            <span className="font-medium">Quick Demo (Click to Auto-fill):</span>
            <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/25 font-mono font-bold">keshavmaan</span>
            <span className="text-slate-600">/</span>
            <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/25 font-mono font-bold">keshav</span>
          </div>
        )}

      </div>
    </div>
  );
}
