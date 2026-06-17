import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  ArrowRight,
  ClipboardList,
  AlertTriangle,
  Megaphone
} from 'lucide-react';

export default function Dashboard({ setActivePage }) {
  const [attendance, setAttendance] = useState([]);
  const [gpaData, setGpaData] = useState(null);
  const [timetable, setTimetable] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [chats, setChats] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch values from backend API
        const attRes = await api.get('/tools/attendance');
        const gpaRes = await api.get('/tools/gpa');
        const ttRes = await api.get('/tools/timetable');
        const checkRes = await api.get('/tools/checklist');
        const chatRes = await api.get('/chat');
        const notesRes = await api.get('/notes');

        setAttendance(attRes.data || []);
        setGpaData(gpaRes.data || null);
        setTimetable(ttRes.data || null);
        setChecklist(checkRes.data || []);
        setChats(chatRes || []);
        setNotes(notesRes || []);
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const toggleChecklist = async (id) => {
    const updated = checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);
    try {
      await api.put('/tools/checklist', { data: updated });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddChecklist = async (e) => {
    e.preventDefault();
    if (!newChecklistItem.trim()) return;

    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      text: newChecklistItem,
      completed: false
    };
    const updated = [...checklist, newItem];
    setChecklist(updated);
    setNewChecklistItem('');

    try {
      await api.put('/tools/checklist', { data: updated });
    } catch (e) {
      console.error(e);
    }
  };

  // Compute stats
  const averageAttendance = attendance.length 
    ? (attendance.reduce((acc, curr) => acc + (curr.conducted > 0 ? (curr.attended / curr.conducted) * 100 : 100), 0) / attendance.length).toFixed(1)
    : '0';

  const lowAttendanceCourses = attendance.filter(c => c.conducted > 0 && (c.attended / c.conducted) * 100 < c.target);

  const checklistCompleted = checklist.length
    ? ((checklist.filter(item => item.completed).length / checklist.length) * 100).toFixed(0)
    : '0';

  // Get current day timetable
  const getCurrentDayClasses = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayName = days[new Date().getDay()];
    // Fallback to Monday if weekend
    const classes = timetable?.[currentDayName] || timetable?.['Monday'] || [];
    return { day: timetable?.[currentDayName] ? currentDayName : 'Monday', classes };
  };

  const { day: classDay, classes: todaysClasses } = getCurrentDayClasses();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500 mr-3"></div>
        <span>Loading dashboard workspace...</span>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* 4 Stats Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Attendance Summary */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 text-left relative overflow-hidden group hover:border-brand-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase">Avg Attendance</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className={`text-3xl font-extrabold ${Number(averageAttendance) < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {averageAttendance}%
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-2">
              {lowAttendanceCourses.length > 0 ? (
                <span className="text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {lowAttendanceCourses.length} course(s) under target
                </span>
              ) : (
                'All courses above 75% target'
              )}
            </p>
          </div>
        </div>

        {/* GPA Metric */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 text-left relative overflow-hidden group hover:border-brand-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase">Predicted CGPA</span>
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold text-brand-400">
              {gpaData?.currentCgpa || '0.00'}
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              Target: <span className="font-semibold text-slate-300">{gpaData?.targetCgpa || '0.00'}</span> (10-point scale)
            </p>
          </div>
        </div>

        {/* Study Planner progress */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 text-left relative overflow-hidden group hover:border-brand-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase">Planner Progress</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-extrabold text-indigo-400">{checklistCompleted}%</h3>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${checklistCompleted}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Uploaded Notes Counter */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 text-left relative overflow-hidden group hover:border-brand-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase">Notes & Materials</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold text-cyan-400">{notes.length}</h3>
            <p className="text-xs text-slate-500 mt-2">
              Total uploaded document resources
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Left Column, Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 columns: Timetable + Checklist */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Timetable */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 text-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-base font-bold text-slate-200">Scheduled Classes ({classDay})</h4>
                <p className="text-xs text-slate-500">Your classroom timetable for today</p>
              </div>
              <button 
                onClick={() => setActivePage('gpa')} // Redirect to planner/timetable page
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                View Full <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todaysClasses.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-sm">
                No classes scheduled for today! Enjoy your self-study time.
              </div>
            ) : (
              <div className="space-y-3">
                {todaysClasses.map((cl, i) => (
                  <div 
                    key={cl.id || i}
                    className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-brand-500/10 text-brand-400">
                        <Clock className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-200">{cl.subject}</h5>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase">{cl.room}</span>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                      {cl.time}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Checklist / Study Planner */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 text-left">
            <div className="mb-6">
              <h4 className="text-base font-bold text-slate-200">Study Planner Tasks</h4>
              <p className="text-xs text-slate-500">Add tasks and mark them off as you study</p>
            </div>

            <form onSubmit={handleAddChecklist} className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Add new study goal (e.g. Read Operating Systems chap 4)..."
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                className="glass-input flex-grow text-sm py-2.5"
              />
              <button 
                type="submit"
                className="px-5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-all"
              >
                Add
              </button>
            </form>

            {checklist.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-sm">
                No checklist items. Add one above!
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {checklist.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className="p-3.5 rounded-xl bg-slate-950/20 border border-slate-900 hover:border-slate-800 flex items-center gap-3 cursor-pointer select-none transition-all"
                  >
                    <input 
                      type="checkbox" 
                      checked={item.completed}
                      readOnly
                      className="w-4 h-4 rounded text-brand-500 focus:ring-0 border-slate-800 cursor-pointer"
                    />
                    <span className={`text-sm ${item.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right column: AI Chats */}
        <div className="space-y-6">

          {/* Recent Conversations */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 text-left">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-base font-bold text-slate-200">Recent Chats</h4>
              <button 
                onClick={() => setActivePage('chat')}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300"
              >
                Go to Assistant
              </button>
            </div>

            {chats.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-sm">
                No recent conversations.
              </div>
            ) : (
              <div className="space-y-2">
                {chats.slice(0, 3).map((chat) => (
                  <button
                    key={chat._id}
                    onClick={() => setActivePage('chat')}
                    className="w-full p-3 rounded-xl bg-slate-950/40 border border-slate-900 hover:border-slate-800 flex items-center justify-between text-left transition-all"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-300 truncate max-w-[180px]">{chat.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {chat.messages.length} message(s)
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
