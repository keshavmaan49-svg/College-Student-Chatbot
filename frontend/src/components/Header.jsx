import React from 'react';
import { Menu, Sun, Moon, Bell, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Header({ activePage, setSidebarOpen }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Student Dashboard';
      case 'chat': return 'AI Learning Companion';
      case 'notes': return 'Notes & Summary Manager';
      case 'attendance': return 'Attendance Calculators';
      case 'gpa': return 'GPA / CGPA Predictor';
      case 'resume': return 'AI Resume Builder';
      case 'settings': return 'Account Settings';
      default: return 'College Student Assistant';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="h-20 px-6 lg:px-10 flex items-center justify-between border-b border-slate-800/40 sticky top-0 bg-slate-950/20 backdrop-blur-md z-30">
      {/* Page Title & Mobile Toggle */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            {getPageTitle()}
            {activePage === 'chat' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-semibold animate-pulse">
                Online
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 hidden sm:block">
            {getGreeting()}, {user?.name || 'Student'}! Ready to study?
          </p>
        </div>
      </div>

      {/* Quick Tools */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 text-slate-400 hover:text-slate-100 transition-all duration-200">
          <Bell className="w-4 h-4 animate-bounce-slow" />
        </button>

        {/* Theme Toggler */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 text-slate-400 hover:text-slate-100 transition-all duration-200"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500" />
          )}
        </button>

        {/* Profile summary */}
        <div className="hidden md:flex items-center gap-3 pl-2 border-l border-slate-800/60">
          <div className="text-right">
            <span className="block text-xs font-semibold text-slate-300">{user?.name}</span>
            <span className="block text-[10px] text-slate-500">{user?.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
