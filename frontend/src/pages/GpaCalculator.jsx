import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Calculator,
  Compass,
  ArrowRight,
  Lightbulb
} from 'lucide-react';

export default function GpaCalculator() {
  const [gpaData, setGpaData] = useState({
    currentCgpa: 8.2,
    targetCgpa: 8.5,
    semesters: []
  });
  const [loading, setLoading] = useState(true);

  // Grade point mapping for Indian universities (10-point scale)
  const gradePoints = {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C': 5,
    'F': 0
  };

  useEffect(() => {
    fetchGpa();
  }, []);

  const fetchGpa = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/tools/gpa');
      setGpaData(res.data || { currentCgpa: 8.2, targetCgpa: 8.5, semesters: [] });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveGpa = async (updatedData) => {
    setGpaData(updatedData);
    try {
      await api.put('/api/tools/gpa', { data: updatedData });
    } catch (e) {
      console.error('Failed to sync GPA data:', e);
    }
  };

  const handleCgpaChange = (field, value) => {
    const val = Number(value) || 0;
    const updated = { ...gpaData, [field]: val };
    saveGpa(updated);
  };

  const handleAddSemester = () => {
    const semName = `Semester ${gpaData.semesters.length + 1}`;
    const newSem = {
      semName,
      gpa: 0,
      courses: [
        { id: Math.random().toString(36).substring(2, 9), courseName: 'New Subject', credits: 4, grade: 'A+' }
      ]
    };
    
    // Calculate GPA
    newSem.gpa = calculateSemesterGpa(newSem.courses);

    const updatedSems = [...gpaData.semesters, newSem];
    const updatedCgpa = calculateOverallCgpa(updatedSems);
    
    saveGpa({
      ...gpaData,
      currentCgpa: Number(updatedCgpa),
      semesters: updatedSems
    });
  };

  const handleDeleteSemester = (semIndex) => {
    const updatedSems = gpaData.semesters.filter((_, idx) => idx !== semIndex);
    // Rename semesters sequentially
    const renamed = updatedSems.map((s, i) => ({ ...s, semName: `Semester ${i + 1}` }));
    const updatedCgpa = calculateOverallCgpa(renamed);

    saveGpa({
      ...gpaData,
      currentCgpa: Number(updatedCgpa),
      semesters: renamed
    });
  };

  const handleAddCourse = (semIndex) => {
    const newCourse = {
      id: Math.random().toString(36).substring(2, 9),
      courseName: 'New Subject',
      credits: 4,
      grade: 'A'
    };

    const updatedSems = gpaData.semesters.map((sem, sIdx) => {
      if (sIdx === semIndex) {
        const courses = [...sem.courses, newCourse];
        const gpa = calculateSemesterGpa(courses);
        return { ...sem, courses, gpa };
      }
      return sem;
    });

    const updatedCgpa = calculateOverallCgpa(updatedSems);
    saveGpa({
      ...gpaData,
      currentCgpa: Number(updatedCgpa),
      semesters: updatedSems
    });
  };

  const handleDeleteCourse = (semIndex, courseId) => {
    const updatedSems = gpaData.semesters.map((sem, sIdx) => {
      if (sIdx === semIndex) {
        const courses = sem.courses.filter(c => c.id !== courseId);
        const gpa = calculateSemesterGpa(courses);
        return { ...sem, courses, gpa };
      }
      return sem;
    });

    const updatedCgpa = calculateOverallCgpa(updatedSems);
    saveGpa({
      ...gpaData,
      currentCgpa: Number(updatedCgpa),
      semesters: updatedSems
    });
  };

  const handleCourseChange = (semIndex, courseId, field, value) => {
    const updatedSems = gpaData.semesters.map((sem, sIdx) => {
      if (sIdx === semIndex) {
        const courses = sem.courses.map(c => {
          if (c.id === courseId) {
            return { ...c, [field]: field === 'credits' ? Number(value) : value };
          }
          return c;
        });
        const gpa = calculateSemesterGpa(courses);
        return { ...sem, courses, gpa };
      }
      return sem;
    });

    const updatedCgpa = calculateOverallCgpa(updatedSems);
    saveGpa({
      ...gpaData,
      currentCgpa: Number(updatedCgpa),
      semesters: updatedSems
    });
  };

  // Calculations Helper
  const calculateSemesterGpa = (courses) => {
    if (courses.length === 0) return 0;
    let totalCredits = 0;
    let weightedPoints = 0;

    courses.forEach(c => {
      const gp = gradePoints[c.grade] ?? 0;
      totalCredits += c.credits;
      weightedPoints += c.credits * gp;
    });

    return totalCredits > 0 ? Number((weightedPoints / totalCredits).toFixed(2)) : 0;
  };

  const calculateOverallCgpa = (semesters) => {
    if (semesters.length === 0) return 0;
    let totalCredits = 0;
    let weightedGpa = 0;

    semesters.forEach(sem => {
      const semCredits = sem.courses.reduce((acc, curr) => acc + curr.credits, 0);
      totalCredits += semCredits;
      weightedGpa += semCredits * sem.gpa;
    });

    return totalCredits > 0 ? (weightedGpa / totalCredits).toFixed(2) : 0;
  };

  // GPA target predictor math
  const getPredictorAdvice = () => {
    const totalSems = 8;
    const completedSems = gpaData.semesters.length || 2; // Default to 2 if none logged
    const remainingSems = totalSems - completedSems;
    
    if (remainingSems <= 0) return 'All semesters completed.';

    const current = gpaData.currentCgpa;
    const target = gpaData.targetCgpa;

    // (completedSems * current + remainingSems * requiredGpa) / totalSems = target
    // => requiredGpa = (target * totalSems - completedSems * current) / remainingSems
    const requiredGpa = (target * totalSems - completedSems * current) / remainingSems;

    if (requiredGpa > 10.0) {
      return `Target of ${target} is mathematically impossible. Max achievable with 10.0 GPA in all remaining semesters is ${((completedSems * current + remainingSems * 10) / totalSems).toFixed(2)}.`;
    } else if (requiredGpa < 4.0) {
      return `Target is easily achievable! You only need to average a ${requiredGpa.toFixed(2)} GPA in the remaining ${remainingSems} semesters.`;
    } else {
      return `To achieve your target CGPA of ${target}, you must maintain an average GPA of **${requiredGpa.toFixed(2)}** in the remaining ${remainingSems} semesters.`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500 mr-3"></div>
        <span>Running CGPA computations...</span>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8 text-left">
      {/* GPA stats and prediction bar */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Current CGPA inputs */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase">Target Configuration</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-semibold">Current CGPA</label>
              <input 
                type="number" 
                step="0.01"
                value={gpaData.currentCgpa}
                onChange={(e) => handleCgpaChange('currentCgpa', e.target.value)}
                className="glass-input py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-semibold">Target CGPA</label>
              <input 
                type="number" 
                step="0.01"
                value={gpaData.targetCgpa}
                onChange={(e) => handleCgpaChange('targetCgpa', e.target.value)}
                className="glass-input py-2 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Prediction summary */}
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800/80 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <Calculator className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-indigo-400" /> CGPA Target Predictor</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {getPredictorAdvice()}
            </p>
          </div>
        </div>

      </section>

      {/* Semester Wise Grades Manager */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-200">Semester Wise Grade Cards</h3>
            <p className="text-xs text-slate-500">Calculate GPA by logging subjects, credits, and grade scales</p>
          </div>

          <button 
            onClick={handleAddSemester}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-brand-500/10"
          >
            <Plus className="w-4 h-4" /> Add Semester Card
          </button>
        </div>

        {gpaData.semesters.length === 0 ? (
          <div className="glass-card p-10 text-center text-slate-500 text-sm border border-slate-900">
            No semester grade cards added. Click the button above to log your semesters!
          </div>
        ) : (
          <div className="space-y-6">
            {gpaData.semesters.map((sem, semIdx) => (
              <div 
                key={semIdx}
                className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-4"
              >
                {/* Semester Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-900/60">
                  <div className="flex items-center gap-4">
                    <h4 className="text-sm font-bold text-slate-200">{sem.semName}</h4>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                      GPA: {sem.gpa.toFixed(2)}
                    </span>
                  </div>

                  <button 
                    onClick={() => handleDeleteSemester(semIdx)}
                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Sem
                  </button>
                </div>

                {/* Course Grade List */}
                <div className="space-y-2.5">
                  {sem.courses.map((c) => (
                    <div 
                      key={c.id}
                      className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center"
                    >
                      {/* Course Name */}
                      <input 
                        type="text" 
                        value={c.courseName}
                        onChange={(e) => handleCourseChange(semIdx, c.id, 'courseName', e.target.value)}
                        className="glass-input py-2 text-xs sm:col-span-2"
                        placeholder="Subject Name"
                      />

                      {/* Credits */}
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] text-slate-500 font-bold sm:hidden uppercase">Credits</label>
                        <select
                          value={c.credits}
                          onChange={(e) => handleCourseChange(semIdx, c.id, 'credits', e.target.value)}
                          className="glass-input py-2 text-xs"
                        >
                          {[1, 2, 3, 4, 5].map(cr => (
                            <option key={cr} value={cr} className="bg-slate-950 text-slate-300">{cr} Credits</option>
                          ))}
                        </select>
                      </div>

                      {/* Grade & Action */}
                      <div className="flex items-center gap-3">
                        <label className="text-[10px] text-slate-500 font-bold sm:hidden uppercase">Grade</label>
                        <select
                          value={c.grade}
                          onChange={(e) => handleCourseChange(semIdx, c.id, 'grade', e.target.value)}
                          className="glass-input py-2 text-xs flex-grow"
                        >
                          {Object.keys(gradePoints).map(gr => (
                            <option key={gr} value={gr} className="bg-slate-950 text-slate-300">{gr} Grade ({gradePoints[gr]} Points)</option>
                          ))}
                        </select>

                        <button 
                          onClick={() => handleDeleteCourse(semIdx, c.id)}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add subject button */}
                <button
                  onClick={() => handleAddCourse(semIdx)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Course Row
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Grade Conversion Tip */}
      <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-[11px] leading-relaxed text-slate-400 flex items-start gap-2.5">
        <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong>Grading Note</strong>: This calculator utilizes the standard Indian 10-point scale: **O** (Outstanding - 10), **A+** (Excellent - 9), **A** (Very Good - 8), **B+** (Good - 7), **B** (Above Average - 6), **C** (Average - 5), and **F** (Fail - 0). Credits acts as weights when computing sem-wise GPAs.
        </div>
      </div>

    </div>
  );
}
