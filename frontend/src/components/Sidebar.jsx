import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  CheckSquare, 
  Calculator, 
  FileEdit, 
  Compass, 
  Settings, 
  LogOut,
  Sparkles,
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activePage, setActivePage, sidebarOpen, setSidebarOpen }) {
  const { logout, user } = useAuth();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', name: 'AI Assistant', icon: MessageSquare },
    { id: 'notes', name: 'Notes Manager', icon: FileText },
    { id: 'attendance', name: 'Attendance', icon: CheckSquare },
    { id: 'gpa', name: 'GPA Predictor', icon: Calculator },
    { id: 'resume', name: 'Resume Builder', icon: FileEdit },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 glass-panel border-r border-slate-800/80 transition-all duration-300 transform
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header/Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">
                Aegis AI
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">STUDENT COMPANION</p>
            </div>
          </div>
          <button 
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 mt-6 rounded-xl bg-slate-950/40 border border-slate-800/40 flex items-center gap-3">
          <img 
            src={user?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=student"} 
            alt="avatar" 
            className="w-10 h-10 rounded-full border border-brand-500/20 bg-slate-900"
          />
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold truncate text-slate-200">{user?.name || 'College Student'}</h4>
            <span className="text-[10px] text-brand-400 font-medium flex items-center gap-0.5">
              <Sparkles className="w-3 h-3" /> Gold Tier
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 py-6 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group
                  ${isActive 
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/15' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent hover:border-slate-800/50'
                  }
                `}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-400'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800/40">
          <button
            onClick={() => {
              logout();
              setActivePage('landing');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
