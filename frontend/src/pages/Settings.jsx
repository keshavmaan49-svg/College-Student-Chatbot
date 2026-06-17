import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Sparkles, 
  User, 
  Cpu, 
  Key, 
  Save, 
  Sun, 
  Moon,
  CheckCircle
} from 'lucide-react';

export default function Settings() {
  const { user, updateSettings } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [provider, setProvider] = useState(user?.settings?.aiProvider || 'mock');
  const [apiKey, setApiKey] = useState(user?.settings?.customApiKey || '');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);

    try {
      await updateSettings({
        name,
        theme,
        aiProvider: provider,
        customApiKey: apiKey
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update configurations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-2xl mx-auto space-y-8 text-left">
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Success Alert */}
        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4.5 h-4.5" /> settings saved and synced successfully!
          </div>
        )}

        {/* 1. Account Settings */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/60 space-y-4">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5"><User className="w-4 h-4 text-brand-400" /> Account Profile</h4>
          
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="glass-input text-xs" 
              placeholder="e.g. John Doe"
            />
          </div>
          
          <div className="space-y-1.5 opacity-60">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Registered College Email</label>
            <input 
              type="email" 
              value={user?.email || ''} 
              disabled
              className="glass-input text-xs bg-slate-900 border-slate-900 cursor-not-allowed" 
            />
          </div>
        </div>

        {/* 2. Theme Settings */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/60 space-y-4">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            Theme Configurations
          </h4>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-slate-300">App Theme</span>
              <span className="block text-[10px] text-slate-500">Toggle between light and dark backgrounds</span>
            </div>
            
            <button
              type="button"
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-slate-100 flex items-center gap-1.5"
            >
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>
        </div>

        {/* 3. AI Provider Settings */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/60 space-y-4">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5"><Cpu className="w-4 h-4 text-cyan-400" /> AI Engine Configurations</h4>
          
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase">AI Provider Model</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="glass-input text-xs"
            >
              <option value="mock" className="bg-slate-950 text-slate-300">Smart Mock AI (Zero-Config / Local Fast Fallback)</option>
              <option value="openai" className="bg-slate-950 text-slate-300">OpenAI GPT-4o-Mini (Requires API Key)</option>
              <option value="gemini" className="bg-slate-950 text-slate-300">Google Gemini 1.5 Flash (Requires API Key)</option>
            </select>
          </div>

          {provider !== 'mock' && (
            <div className="space-y-1.5 pt-2 animate-pulse-slow">
              <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-brand-400" /> Custom {provider === 'openai' ? 'OpenAI' : 'Gemini'} API Key
              </label>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="glass-input text-xs"
                placeholder={provider === 'openai' ? 'sk-proj-...' : 'AIzaSy...'}
              />
              <span className="block text-[9px] text-slate-500 italic mt-1">
                API Keys are stored securely in local session requests and never shared. Leave empty to fallback to Mock model.
              </span>
            </div>
          )}
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full glass-btn-primary flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Settings'}
        </button>

      </form>

    </div>
  );
}
