import React, { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';
import { 
  Plus, 
  Trash2, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Download, 
  Sparkles,
  Paperclip,
  Languages
} from 'lucide-react';

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [language, setLanguage] = useState('English');
  
  // Voice Input/Output states
  const [isRecording, setIsRecording] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Available languages
  const languagesList = ['English', 'Hindi (हिंदी)', 'Tamil (தமிழ்)', 'Telugu (తెలుగు)', 'Spanish', 'French'];

  useEffect(() => {
    fetchChats();

    // Initialize Web Speech API for voice recognition if supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMsg(prev => prev ? prev + ' ' + transcript : transcript);
        setIsRecording(false);
      };

      rec.onerror = (e) => {
        console.error('Speech recognition error:', e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Fetch active chat messages when activeChatId changes
  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId);
    } else {
      setMessages([]);
    }
  }, [activeChatId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChats = async () => {
    try {
      const data = await api.get('/api/chat');
      setChats(data);
      if (data.length > 0 && !activeChatId) {
        setActiveChatId(data[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const data = await api.get(`/api/chat/${chatId}/messages`);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateChat = async () => {
    try {
      const newChat = await api.post('/api/chat', { title: 'New Conversation' });
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChat._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/api/chat/${chatId}`);
      const updatedChats = chats.filter(c => c._id !== chatId);
      setChats(updatedChats);
      if (activeChatId === chatId) {
        setActiveChatId(updatedChats.length > 0 ? updatedChats[0]._id : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || sending) return;

    const userText = inputMsg;
    setInputMsg('');
    setSending(true);

    // Optimistic update of local user message
    const tempUserMsg = { sender: 'user', text: userText, timestamp: new Date() };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      let currentChatId = activeChatId;

      // Create a new chat if one doesn't exist yet
      if (!currentChatId) {
        const newChat = await api.post('/api/chat', { title: 'New Conversation' });
        currentChatId = newChat._id;
        setActiveChatId(newChat._id);
        setChats(prev => [newChat, ...prev]);
      }

      // If language is not English, request the AI model to reply in that language
      let queryText = userText;
      if (language !== 'English') {
        queryText = `[Please respond in ${language}] ${userText}`;
      }

      const res = await api.post(`/api/chat/${currentChatId}/messages`, { message: queryText });
      
      // Update messages with official list
      setMessages(res.chat.messages);
      
      // Voice Synthesis for assistant response if enabled
      if (speechEnabled && res.assistantMessage?.text) {
        speakResponse(res.assistantMessage.text);
      }

      // Refresh chat list (in case title changed)
      fetchChats();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  // Web Speech API Voice Recognition
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Try Chrome or Safari.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      // Map local language to voice language tag
      if (language.includes('Hindi')) recognitionRef.current.lang = 'hi-IN';
      else if (language.includes('Tamil')) recognitionRef.current.lang = 'ta-IN';
      else if (language.includes('Telugu')) recognitionRef.current.lang = 'te-IN';
      else recognitionRef.current.lang = 'en-US';

      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Text-To-Speech Output
  const speakResponse = (text) => {
    window.speechSynthesis.cancel(); // Stop any ongoing speak
    
    // Remove markdown symbols for clean reading
    const cleanText = text.replace(/[#*`_-]/g, ' ');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Choose correct locale voice if matches
    if (language.includes('Hindi')) utterance.lang = 'hi-IN';
    else if (language.includes('Tamil')) utterance.lang = 'ta-IN';
    else if (language.includes('Telugu')) utterance.lang = 'te-IN';
    else utterance.lang = 'en-US';

    window.speechSynthesis.speak(utterance);
  };

  // Export conversation to Text file
  const handleExportChat = () => {
    if (messages.length === 0) return;
    
    let textContent = `Aegis AI Chatbot Conversation History\nExported on: ${new Date().toLocaleString()}\n\n`;
    messages.forEach(msg => {
      const senderName = msg.sender === 'user' ? 'STUDENT' : 'ASSISTANT';
      textContent += `[${senderName} - ${new Date(msg.timestamp).toLocaleTimeString()}]\n${msg.text}\n\n`;
    });

    const element = document.createElement("a");
    const file = new Blob([textContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `chat-export-${activeChatId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Custom Formatter to parse basic markdown inside chat bubbles
  const renderMessageContent = (text) => {
    // Escape standard elements and split into blocks
    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeContent = [];
    const formattedBlocks = [];

    lines.forEach((line, index) => {
      // Code blocks selector: ```
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false;
          formattedBlocks.push(
            <pre key={`code-${index}`} className="my-2 p-4 rounded-xl bg-slate-950 border border-slate-800 text-left overflow-x-auto font-mono text-xs text-indigo-400">
              <code>{codeContent.join('\n')}</code>
            </pre>
          );
          codeContent = [];
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Headers selector
      if (line.startsWith('### ')) {
        formattedBlocks.push(<h4 key={index} className="text-sm font-bold text-slate-100 mt-3 mb-1.5">{line.substring(4)}</h4>);
      } else if (line.startsWith('## ')) {
        formattedBlocks.push(<h3 key={index} className="text-base font-extrabold text-slate-100 mt-4 mb-2">{line.substring(3)}</h3>);
      } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
        formattedBlocks.push(<div key={index} className="pl-4 text-xs leading-relaxed my-0.5 text-left">• {line.substring(3)}</div>);
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        formattedBlocks.push(<div key={index} className="pl-4 text-xs leading-relaxed my-0.5 text-left">• {line.substring(2)}</div>);
      } else {
        // Parse bold highlights inside lines: **bold**
        const parts = line.split('**');
        if (parts.length > 1) {
          formattedBlocks.push(
            <p key={index} className="text-xs leading-relaxed my-1.5 text-left">
              {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-brand-400">{part}</strong> : part)}
            </p>
          );
        } else {
          formattedBlocks.push(line.trim() ? <p key={index} className="text-xs leading-relaxed my-1 text-left">{line}</p> : <div key={index} className="h-2"></div>);
        }
      }
    });

    return formattedBlocks;
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden relative">
      {/* Sidebar: Chat List */}
      <div className="w-64 border-r border-slate-800/40 bg-slate-950/20 backdrop-blur-md hidden md:flex flex-col justify-between py-6 px-4">
        <div className="space-y-4">
          <button 
            onClick={handleCreateChat}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-800 hover:border-brand-500/50 hover:bg-brand-500/5 transition-all text-sm font-semibold text-slate-300 hover:text-white"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
          
          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-260px)] pr-1">
            {chats.map((c) => (
              <button
                key={c._id}
                onClick={() => setActiveChatId(c._id)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all text-sm group
                  ${activeChatId === c._id 
                    ? 'bg-slate-900 border border-slate-800 text-slate-200 font-semibold' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-950/40 border border-transparent'
                  }
                `}
              >
                <span className="truncate max-w-[130px]">{c.title}</span>
                <Trash2 
                  onClick={(e) => handleDeleteChat(c._id, e)}
                  className="w-3.5 h-3.5 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all" 
                />
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-slate-950/40 border border-slate-800/40 rounded-2xl text-[10px] text-slate-500 font-medium leading-relaxed">
          <Sparkles className="w-3.5 h-3.5 text-brand-400 mb-1 inline" /> AI engine supports custom model settings and voice dictation.
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="flex-grow flex flex-col justify-between bg-transparent">
        {/* Chat Header */}
        <div className="h-14 px-6 border-b border-slate-800/20 flex items-center justify-between bg-slate-950/5">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-300">
              {chats.find(c => c._id === activeChatId)?.title || 'AI Chatroom'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Lang Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent border-none text-[10px] text-slate-300 focus:ring-0 cursor-pointer outline-none"
              >
                {languagesList.map(lang => (
                  <option key={lang} value={lang} className="bg-slate-950 text-slate-300">{lang}</option>
                ))}
              </select>
            </div>

            {/* Speech Output Toggler */}
            <button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              title={speechEnabled ? "Mute Voice Output" : "Enable Voice Output"}
              className={`p-1.5 rounded-lg border transition-all ${speechEnabled ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
            >
              {speechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Export Chat */}
            <button
              onClick={handleExportChat}
              disabled={messages.length === 0}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-40"
              title="Export Conversation History"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Message Container */}
        <div className="flex-grow overflow-y-auto px-6 py-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
              <div className="p-4 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-300">How can I assist your study today?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ask me to explain a coding logic, detail GATE engineering subjects, draft cover letters, solve calculus queries, or calculate target grades!
              </p>
              <div className="grid grid-cols-2 gap-2 w-full pt-4">
                <button 
                  onClick={() => setInputMsg('Help me understand the sliding window DSA algorithm.')}
                  className="p-3 text-[10px] text-left font-medium rounded-xl bg-slate-950/40 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-300"
                >
                  "Explain sliding window..."
                </button>
                <button 
                  onClick={() => setInputMsg('Generate a preparation roadmap for GATE CSE.')}
                  className="p-3 text-[10px] text-left font-medium rounded-xl bg-slate-950/40 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-300"
                >
                  "GATE CSE roadmap..."
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={index}
                  className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${
                    isUser ? 'bg-brand-600 border-brand-500 text-white' : 'bg-indigo-600 border-indigo-500 text-white'
                  }`}>
                    {isUser ? 'ME' : 'AI'}
                  </div>

                  {/* Bubble */}
                  <div className={`p-4 rounded-2xl border text-left flex flex-col gap-1 ${
                    isUser 
                      ? 'bg-slate-900/60 border-slate-800 text-slate-200' 
                      : 'bg-indigo-950/20 border-indigo-900/40 text-slate-300'
                  }`}>
                    {renderMessageContent(msg.text)}
                    <span className="text-[8px] text-slate-600 mt-2 self-end font-semibold">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          {sending && (
            <div className="flex gap-3 mr-auto items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold border border-indigo-500 text-white">AI</div>
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-indigo-950/10 border border-indigo-950/40">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-800/10 bg-slate-950/5 flex gap-2 items-center">
          <button 
            type="button"
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200"
            title="Attach note from library"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          
          <input
            type="text"
            placeholder="Type your academic or career doubt here..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            disabled={sending}
            className="glass-input text-xs sm:text-sm"
          />

          {/* Speech Recording */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-3 rounded-xl border transition-all ${isRecording ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
            title="Speech Dictation"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            type="submit"
            disabled={!inputMsg.trim() || sending}
            className="p-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
