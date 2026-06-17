import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import NotesManager from './pages/NotesManager';
import AttendanceCalculator from './pages/AttendanceCalculator';
import GpaCalculator from './pages/GpaCalculator';
import ResumeBuilder from './pages/ResumeBuilder';
import Settings from './pages/Settings';

function AppContent() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500 mr-3"></div>
        <span>Waking up study helper...</span>
      </div>
    );
  }

  // 1. Unauthenticated Route Handling
  if (!user) {
    if (activePage === 'login') {
      return <LoginPage onBack={() => setActivePage('landing')} />;
    }
    // Default to landing
    return <LandingPage onGetStarted={() => setActivePage('login')} />;
  }

  // If user is authenticated but activePage is still 'landing' or 'login', send them to 'dashboard'
  if (activePage === 'landing' || activePage === 'login') {
    setActivePage('dashboard');
  }

  // 2. Render Page Component based on activePage
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard setActivePage={setActivePage} />;
      case 'chat':
        return <ChatPage />;
      case 'notes':
        return <NotesManager />;
      case 'attendance':
        return <AttendanceCalculator />;
      case 'gpa':
        return <GpaCalculator />;
      case 'resume':
        return <ResumeBuilder />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex text-slate-200 bg-slate-950 relative overflow-hidden transition-colors duration-300 body-root">
      {/* Dynamic Aesthetic Background Blobs */}
      <div className="glow-blob-purple w-[500px] h-[500px] top-[10%] left-[5%] opacity-20"></div>
      <div className="glow-blob-cyan w-[500px] h-[500px] bottom-[10%] right-[5%] opacity-20"></div>

      {/* Navigation Drawer */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Workspace Frame */}
      <div className="flex-grow flex flex-col lg:pl-64 min-h-screen relative z-10">
        <Header 
          activePage={activePage} 
          setSidebarOpen={setSidebarOpen}
        />
        
        <main className="flex-grow overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
