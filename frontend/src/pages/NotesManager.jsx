import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { 
  FileText, 
  Trash2, 
  Sparkles, 
  Plus,
  BookOpen,
  Award,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function NotesManager() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'flashcards', 'quiz'
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState('');

  // Flashcards carousel state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  // Quiz player state
  const [quizAnswers, setQuizAnswers] = useState({}); // { questionIndex: chosenOptionIndex }
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    fetchNotes();
  }, []);

  // Debounced Auto-save note edits
  useEffect(() => {
    if (!activeNote) return;

    const original = notes.find(n => n._id === activeNote._id);
    if (original && original.title === activeNote.title && original.content === activeNote.content) {
      return;
    }

    setSavingStatus('Saving...');
    const timer = setTimeout(async () => {
      try {
        await api.put(`/notes/${activeNote._id}`, {
          title: activeNote.title,
          content: activeNote.content
        });
        // Sync local notes list
        setNotes(prev => prev.map(n => n._id === activeNote._id ? { ...n, title: activeNote.title, content: activeNote.content } : n));
        setSavingStatus('Saved');
        setTimeout(() => setSavingStatus(''), 1500);
      } catch (err) {
        setSavingStatus('Error saving');
        console.error(err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeNote?.title, activeNote?.content]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await api.get('/notes');
      setNotes(data);
      if (data.length > 0) {
        handleSelectNote(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    try {
      const newNote = await api.post('/notes', {
        title: 'Untitled Study Note',
        content: ''
      });
      setNotes(prev => [newNote, ...prev]);
      handleSelectNote(newNote);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectNote = (note) => {
    setActiveNote(note);
    setActiveTab('summary');
    setCurrentCardIndex(0);
    setCardFlipped(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setAnalyzeError('');
  };

  const handleDeleteNote = async (id, e) => {
    if (e) e.stopPropagation();
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes(prev => prev.filter(n => n._id !== id));
      if (activeNote?._id === id) {
        setActiveNote(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyzeNote = async () => {
    if (!activeNote) return;
    if (!activeNote.content || !activeNote.content.trim()) {
      setAnalyzeError('Note content is empty. Type some study material first!');
      return;
    }

    setAnalyzing(true);
    setAnalyzeError('');
    try {
      const updated = await api.post(`/notes/${activeNote._id}/analyze`);
      setActiveNote(updated);
      setNotes(prev => prev.map(n => n._id === updated._id ? updated : n));
      // Reset quiz
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizScore(0);
      setCurrentCardIndex(0);
      setCardFlipped(false);
    } catch (err) {
      setAnalyzeError(err.message || 'AI Study deck generation failed. Try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const submitQuiz = () => {
    if (!activeNote?.quiz) return;
    let score = 0;
    activeNote.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.answerIndex) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score === activeNote.quiz.length) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500 mr-3"></div>
        <span>Opening Notes Vault...</span>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6 text-left h-[calc(100vh-80px)] flex flex-col">
      <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-6 overflow-hidden min-h-0">
        
        {/* Left Column - List Pane */}
        <div className="md:col-span-1 glass-panel rounded-2xl p-4 border border-slate-800/80 flex flex-col min-h-0">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
            <h4 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">My Notebook</h4>
            <button 
              onClick={handleCreateNote}
              className="p-2 rounded-xl bg-brand-500/10 text-brand-400 hover:bg-brand-500 hover:text-white border border-brand-500/20 transition-all duration-200"
              title="New study note"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto space-y-2 pr-1">
            {notes.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-8">
                No notes created. Click '+' to start.
              </div>
            ) : (
              notes.map((note) => {
                const isActive = activeNote?._id === note._id;
                return (
                  <div
                    key={note._id}
                    onClick={() => handleSelectNote(note)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all duration-200
                      ${isActive 
                        ? 'bg-brand-500/10 border-brand-500/35 text-white' 
                        : 'bg-slate-950/20 border-slate-900/60 hover:bg-slate-900/20 hover:border-slate-800/60 text-slate-400'
                      }
                    `}
                  >
                    <div className="overflow-hidden space-y-1">
                      <h5 className="text-xs font-bold truncate pr-1">{note.title || 'Untitled Note'}</h5>
                      <span className="text-[9px] text-slate-500 block">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => handleDeleteNote(note._id, e)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column - Editor & AI Study Deck */}
        <div className="md:col-span-3 flex flex-col min-h-0 space-y-6">
          {!activeNote ? (
            <div className="flex-grow glass-panel rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center text-slate-500 p-8">
              <FileText className="w-16 h-16 text-slate-700 mb-4 animate-pulse-slow" />
              <h4 className="text-base font-bold text-slate-300">Select or Create a Note</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs text-center">
                Select a note from the library or click the Plus button to start typing your lecture study notes.
              </p>
            </div>
          ) : (
            <div className="flex-grow flex flex-col min-h-0 overflow-y-auto space-y-6 pr-1">
              
              {/* Note Edit Area */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-4 flex flex-col shrink-0">
                {/* Note Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-grow space-y-1">
                    <input 
                      type="text"
                      value={activeNote.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setActiveNote(prev => ({ ...prev, title: newTitle }));
                      }}
                      className="w-full bg-transparent text-lg font-extrabold text-slate-100 border-none outline-none focus:ring-0 p-0 placeholder-slate-600"
                      placeholder="Give this note a title..."
                    />
                    <span className="text-[10px] text-slate-500 font-semibold h-4 block">
                      {savingStatus || 'Auto-saved'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleAnalyzeNote}
                      disabled={analyzing || !activeNote.content || !activeNote.content.trim()}
                      className={`
                        px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all
                        ${analyzing 
                          ? 'bg-slate-900 text-slate-500 pointer-events-none border border-slate-800'
                          : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-500/10 hover:-translate-y-0.5'
                        }
                        disabled:opacity-50 disabled:pointer-events-none
                      `}
                    >
                      {analyzing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating Deck...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" /> Generate AI Study Deck
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {analyzeError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center">
                    {analyzeError}
                  </div>
                )}

                {/* Text editor sheet */}
                <textarea
                  value={activeNote.content || ''}
                  onChange={(e) => {
                    const newContent = e.target.value;
                    setActiveNote(prev => ({ ...prev, content: newContent }));
                  }}
                  className="w-full h-48 bg-slate-950/40 border border-slate-900 rounded-xl p-4 text-xs font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/40 resize-none leading-relaxed"
                  placeholder="Paste or type your study notes, course syllabus, or lecture transcripts here. Once typed, click 'Generate AI Study Deck' to generate interactive flashcards, study quizzes, and executive summaries."
                />
              </div>

              {/* AI study deck section */}
              <div className="flex-grow flex flex-col min-h-0">
                {!activeNote.summary ? (
                  <div className="glass-panel p-8 rounded-2xl border border-slate-800/80 text-center text-slate-500 text-xs flex flex-col items-center justify-center py-12">
                    <Sparkles className="w-8 h-8 text-indigo-400/40 mb-3" />
                    <span className="font-bold text-slate-400">AI Study Vault is Ready</span>
                    <p className="max-w-xs text-slate-500 mt-1 text-center">
                      Type study notes above and click the AI button. Aegis AI will automatically analyze your content to construct flashcards, summary points, and a practice quiz.
                    </p>
                  </div>
                ) : (
                  <div className="glass-panel rounded-2xl border border-slate-800/80 flex flex-col min-h-0">
                    
                    {/* Tab Selector */}
                    <div className="flex border-b border-slate-800/60 shrink-0">
                      {['summary', 'flashcards', 'quiz'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`
                            px-5 py-3.5 text-xs font-bold border-b-2 transition-all capitalize
                            ${activeTab === tab 
                              ? 'border-brand-500 text-brand-400 bg-brand-500/5' 
                              : 'border-transparent text-slate-500 hover:text-slate-300'
                            }
                          `}
                        >
                          {tab === 'summary' ? 'Summary & Takeaways' : tab}
                        </button>
                      ))}
                    </div>

                    {/* Tab panels */}
                    <div className="p-5 overflow-y-auto flex-grow min-h-0">
                      
                      {/* Summary tab */}
                      {activeTab === 'summary' && (
                        <div className="grid md:grid-cols-3 gap-5 text-left">
                          <div className="md:col-span-2 space-y-3">
                            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Executive Summary</h4>
                            <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line bg-slate-950/20 border border-slate-900/60 p-4 rounded-xl">{activeNote.summary}</p>
                          </div>
                          <div className="space-y-3">
                            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Key Takeaways</h4>
                            <ul className="space-y-2">
                              {activeNote.keyPoints?.map((pt, idx) => (
                                <li key={idx} className="text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
                                  <span className="p-1 rounded-full bg-indigo-500/10 text-indigo-400 mt-0.5">•</span>
                                  {pt}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Flashcards tab */}
                      {activeTab === 'flashcards' && (
                        <div className="flex flex-col items-center max-w-sm mx-auto space-y-4 py-2">
                          {(!activeNote.flashcards || activeNote.flashcards.length === 0) ? (
                            <div className="text-slate-500 text-xs">No flashcards generated.</div>
                          ) : (
                            <>
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                                Card {currentCardIndex + 1} of {activeNote.flashcards.length}
                              </span>

                              {/* 3D card layout */}
                              <div 
                                onClick={() => setCardFlipped(!cardFlipped)}
                                className="w-full aspect-[4/3] rounded-2xl cursor-pointer perspective-1000 relative"
                              >
                                <div className={`
                                  w-full h-full rounded-2xl border border-slate-800/80 shadow-2xl relative transition-transform duration-500 preserve-3d
                                  ${cardFlipped ? 'rotate-y-180 bg-brand-950/20 border-brand-500/30' : 'bg-slate-900/60'}
                                `}>
                                  {/* Front Side */}
                                  <div className="absolute inset-0 p-6 flex flex-col justify-between items-center text-center backface-hidden">
                                    <div className="text-[9px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 font-semibold border border-brand-500/20">QUESTION</div>
                                    <p className="text-xs md:text-sm font-bold text-slate-200 leading-relaxed max-w-xs">{activeNote.flashcards[currentCardIndex]?.question}</p>
                                    <span className="text-[9px] text-slate-500 font-semibold">Click to flip</span>
                                  </div>

                                  {/* Back Side */}
                                  <div className="absolute inset-0 p-6 flex flex-col justify-between items-center text-center rotate-y-180 backface-hidden">
                                    <div className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">ANSWER</div>
                                    <p className="text-[11px] md:text-xs text-slate-300 leading-relaxed max-w-xs">{activeNote.flashcards[currentCardIndex]?.answer}</p>
                                    <span className="text-[9px] text-slate-500 font-semibold">Click to flip</span>
                                  </div>
                                </div>
                              </div>

                              {/* Carousel controls */}
                              <div className="flex gap-2">
                                <button
                                  disabled={currentCardIndex === 0}
                                  onClick={() => {
                                    setCurrentCardIndex(prev => prev - 1);
                                    setCardFlipped(false);
                                  }}
                                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                  disabled={currentCardIndex === activeNote.flashcards.length - 1}
                                  onClick={() => {
                                    setCurrentCardIndex(prev => prev + 1);
                                    setCardFlipped(false);
                                  }}
                                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Quiz tab */}
                      {activeTab === 'quiz' && (
                        <div className="max-w-xl mx-auto space-y-4">
                          {(!activeNote.quiz || activeNote.quiz.length === 0) ? (
                            <div className="text-slate-500 text-xs">No quiz questions generated.</div>
                          ) : (
                            <>
                              {quizSubmitted && (
                                <div className="glass-panel p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
                                  <div className="space-y-0.5">
                                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5"><Award className="w-4 h-4 text-brand-400" /> Quiz Completed</h4>
                                    <p className="text-[10px] text-slate-400">Grade: {quizScore} / {activeNote.quiz.length}</p>
                                  </div>
                                  <button 
                                    onClick={resetQuiz}
                                    className="px-3.5 py-1.5 text-[10px] font-bold rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800"
                                  >
                                    Retry
                                  </button>
                                </div>
                              )}

                              <div className="space-y-4">
                                {activeNote.quiz.map((q, qIdx) => (
                                  <div 
                                    key={qIdx}
                                    className="glass-panel p-5 rounded-xl border border-slate-800/60 space-y-3"
                                  >
                                    <h5 className="text-xs font-bold text-slate-200">
                                      Q{qIdx + 1}: {q.question}
                                    </h5>

                                    <div className="grid grid-cols-1 gap-2">
                                      {q.options.map((opt, optIdx) => {
                                        const isSelected = quizAnswers[qIdx] === optIdx;
                                        const isCorrect = q.answerIndex === optIdx;
                                        
                                        let bubbleStyle = 'border-slate-800 bg-slate-950/20 hover:border-slate-700';
                                        let iconEl = null;

                                        if (quizSubmitted) {
                                          if (isCorrect) {
                                            bubbleStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-300';
                                            iconEl = <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
                                          } else if (isSelected) {
                                            bubbleStyle = 'border-rose-500 bg-rose-500/10 text-rose-300';
                                            iconEl = <X className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
                                          } else {
                                            bubbleStyle = 'border-slate-900 opacity-60 text-slate-500';
                                          }
                                        } else if (isSelected) {
                                          bubbleStyle = 'border-brand-500 bg-brand-500/10 text-brand-300';
                                        }

                                        return (
                                          <button
                                            key={optIdx}
                                            type="button"
                                            disabled={quizSubmitted}
                                            onClick={() => {
                                              setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                                            }}
                                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-[11px] font-medium text-left transition-all ${bubbleStyle}`}
                                          >
                                            <span>{opt}</span>
                                            {iconEl}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {!quizSubmitted && (
                                <button
                                  onClick={submitQuiz}
                                  disabled={Object.keys(quizAnswers).length < activeNote.quiz.length}
                                  className="w-full glass-btn-primary py-3.5 text-xs font-bold"
                                >
                                  Submit Answers
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
