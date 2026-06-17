import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  Edit2, 
  AlertTriangle, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function AttendanceCalculator() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCourseName, setNewCourseName] = useState('');
  const [newTarget, setNewTarget] = useState(75);

  // Condonation Helper Widget States
  const [condonationConducted, setCondonationConducted] = useState(40);
  const [condonationAttended, setCondonationAttended] = useState(30);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tools/attendance');
      setCourses(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveCourses = async (updatedCourses) => {
    setCourses(updatedCourses);
    try {
      await api.put('/tools/attendance', { data: updatedCourses });
    } catch (e) {
      console.error('Failed to sync attendance:', e);
    }
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;

    const newCourse = {
      id: Math.random().toString(36).substring(2, 9),
      courseName: newCourseName,
      conducted: 0,
      attended: 0,
      target: Number(newTarget) || 75
    };

    const updated = [...courses, newCourse];
    saveCourses(updated);
    setNewCourseName('');
  };

  const handleDeleteCourse = (id) => {
    const updated = courses.filter(c => c.id !== id);
    saveCourses(updated);
  };

  const handleIncrement = (id, field) => {
    const updated = courses.map(c => {
      if (c.id === id) {
        let att = c.attended;
        let cond = c.conducted;
        if (field === 'attended') {
          att += 1;
          cond += 1; // attending a class also increments conducted
        } else if (field === 'conducted') {
          cond += 1;
        }
        return { ...c, attended: att, conducted: cond };
      }
      return c;
    });
    saveCourses(updated);
  };

  const handleDecrement = (id, field) => {
    const updated = courses.map(c => {
      if (c.id === id) {
        let att = c.attended;
        let cond = c.conducted;
        if (field === 'attended') {
          att = Math.max(0, att - 1);
          cond = Math.max(0, cond - 1);
        } else if (field === 'conducted') {
          cond = Math.max(0, cond - 1);
          if (att > cond) att = cond; // attended cannot exceed conducted
        }
        return { ...c, attended: att, conducted: cond };
      }
      return c;
    });
    saveCourses(updated);
  };

  // Helper to calculate skip/attend recommendations
  const getRecommendation = (attended, conducted, target) => {
    if (conducted === 0) return { status: 'info', text: 'No classes logged yet.' };
    
    const percentage = (attended / conducted) * 100;
    
    if (percentage >= target) {
      // Calculate how many classes user can skip
      // (attended) / (conducted + skip) = target/100 => 100 * attended = target * conducted + target * skip
      // => skip = (100 * attended - target * conducted) / target
      const skip = Math.floor((100 * attended - target * conducted) / target);
      if (skip > 0) {
        return {
          status: 'success',
          text: `You are safe! You can skip the next ${skip} class(es) and remain above ${target}%.`
        };
      } else {
        return {
          status: 'success',
          text: `You are exactly on target. Do not skip any upcoming classes.`
        };
      }
    } else {
      // Calculate how many consecutive classes user must attend
      // (attended + attend) / (conducted + attend) = target/100 => 100 * attended + 100 * attend = target * conducted + target * attend
      // => attend * (100 - target) = target * conducted - 100 * attended
      // => attend = (target * conducted - 100 * attended) / (100 - target)
      const attend = Math.ceil((target * conducted - 100 * attended) / (100 - target));
      return {
        status: 'danger',
        text: `Attendance is low! You must attend the next ${attend} class(es) consecutively to cross ${target}%.`
      };
    }
  };

  // Condonation helper computations
  const getCondonationAnalysis = () => {
    if (condonationConducted === 0) return null;
    const pct = (condonationAttended / condonationConducted) * 100;
    
    let verdict = '';
    let recommendation = '';

    if (pct >= 75) {
      verdict = 'Eligible for End-Sem Exam';
      const skip = Math.floor((100 * condonationAttended - 75 * condonationConducted) / 75);
      recommendation = skip > 0 
        ? `You can skip ${skip} more classes and remain above 75% eligibility.` 
        : `You are close to the limit. Maintain regular attendance.`;
    } else if (pct >= 65) {
      verdict = 'Eligible only with Condonation (Medical/OD)';
      const attend = Math.ceil((75 * condonationConducted - 100 * condonationAttended) / 25);
      recommendation = `Submit medical certificates or OD forms. Otherwise, attend the next ${attend} classes to hit 75%.`;
    } else {
      verdict = 'Detained / Not Eligible';
      const condonationAttend = Math.ceil((65 * condonationConducted - 100 * condonationAttended) / 35);
      const normalAttend = Math.ceil((75 * condonationConducted - 100 * condonationAttended) / 25);
      recommendation = `You need to attend ${condonationAttend} classes to reach condonation limit (65%) or ${normalAttend} classes for normal eligibility (75%).`;
    }

    return { pct: pct.toFixed(1), verdict, recommendation };
  };

  const condonationAnalysis = getCondonationAnalysis();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500 mr-3"></div>
        <span>Opening Attendance Ledger...</span>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8 text-left">
      
      {/* Course Attendance List */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-200">Course Attendance Tracker</h3>
            <p className="text-xs text-slate-500">Track and calculate class participation scores</p>
          </div>
          
          <form onSubmit={handleAddCourse} className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g., Computer Architecture"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="glass-input py-2 px-3 text-xs w-48"
            />
            <input 
              type="number" 
              placeholder="Target%"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              className="glass-input py-2 px-3 text-xs w-20"
              min="50"
              max="100"
            />
            <button 
              type="submit" 
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </form>
        </div>

        {courses.length === 0 ? (
          <div className="glass-card p-8 text-center text-slate-500 text-sm border border-slate-900">
            No courses logged yet. Add your college subjects above to begin tracking!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((c) => {
              const pct = c.conducted > 0 ? ((c.attended / c.conducted) * 100).toFixed(1) : '0';
              const rec = getRecommendation(c.attended, c.conducted, c.target);
              const isDanger = Number(pct) < c.target;

              return (
                <div 
                  key={c.id}
                  className="glass-panel p-5 rounded-2xl border border-slate-800/60 flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{c.courseName}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Target: {c.target}% required</p>
                    </div>
                    
                    <button 
                      onClick={() => handleDeleteCourse(c.id)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Calculations Grid */}
                  <div className="grid grid-cols-3 gap-2 py-1 text-center bg-slate-950/20 border border-slate-900/40 p-3 rounded-xl">
                    <div>
                      <span className="block text-[8px] text-slate-500 font-bold uppercase">Conducted</span>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <button onClick={() => handleDecrement(c.id, 'conducted')} className="px-1.5 py-0.5 rounded bg-slate-900 text-xs border border-slate-800">-</button>
                        <span className="text-xs font-bold text-slate-300">{c.conducted}</span>
                        <button onClick={() => handleIncrement(c.id, 'conducted')} className="px-1.5 py-0.5 rounded bg-slate-900 text-xs border border-slate-800">+</button>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-500 font-bold uppercase">Attended</span>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <button onClick={() => handleDecrement(c.id, 'attended')} className="px-1.5 py-0.5 rounded bg-slate-900 text-xs border border-slate-800">-</button>
                        <span className="text-xs font-bold text-slate-300">{c.attended}</span>
                        <button onClick={() => handleIncrement(c.id, 'attended')} className="px-1.5 py-0.5 rounded bg-slate-900 text-xs border border-slate-800">+</button>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-500 font-bold uppercase">Current %</span>
                      <span className={`block text-sm font-extrabold mt-1.5 ${isDanger ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {pct}%
                      </span>
                    </div>
                  </div>

                  {/* Notification Banner */}
                  <div className={`p-3 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 ${
                    rec.status === 'danger' 
                      ? 'bg-rose-500/5 border-rose-500/20 text-rose-400' 
                      : rec.status === 'success' 
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    {rec.status === 'danger' ? (
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                    ) : (
                      <CheckCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{rec.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Condonation Helper widget */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <h4 className="text-base font-bold text-slate-200">University Attendance Guide</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Most universities mandate **75% attendance** for general eligibility. If you have valid medical reasons or represent your college/branch on official duty (OD), your attendance can be condoned down to **65%** after dean/management approval. Anyone below 65% is detained.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Total Classes Conducted</label>
              <input 
                type="number" 
                value={condonationConducted} 
                onChange={(e) => setCondonationConducted(Math.max(1, Number(e.target.value)))}
                className="glass-input py-2 text-xs" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Classes Attended</label>
              <input 
                type="number" 
                value={condonationAttended} 
                onChange={(e) => setCondonationAttended(Math.min(condonationConducted, Number(e.target.value)))}
                className="glass-input py-2 text-xs" 
              />
            </div>
          </div>
        </div>

        {condonationAnalysis && (
          <div className="p-6 rounded-xl bg-slate-950/40 border border-slate-900/60 flex flex-col justify-center space-y-4">
            <div className="text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Attendance Score</span>
              <h3 className={`text-4xl font-extrabold mt-1 ${
                Number(condonationAnalysis.pct) >= 75 
                  ? 'text-emerald-400' 
                  : Number(condonationAnalysis.pct) >= 65 
                    ? 'text-yellow-400' 
                    : 'text-rose-400'
              }`}>
                {condonationAnalysis.pct}%
              </h3>
            </div>
            <div className="space-y-2 border-t border-slate-900 pt-3">
              <div className="text-xs font-bold text-slate-200">
                Status: <span className={
                  Number(condonationAnalysis.pct) >= 75 
                    ? 'text-emerald-400' 
                    : Number(condonationAnalysis.pct) >= 65 
                      ? 'text-yellow-400' 
                      : 'text-rose-400'
                }>{condonationAnalysis.verdict}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {condonationAnalysis.recommendation}
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
