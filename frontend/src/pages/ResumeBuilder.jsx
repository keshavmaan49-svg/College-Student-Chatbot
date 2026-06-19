import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Download, 
  Plus, 
  Trash2, 
  Printer, 
  User, 
  GraduationCap, 
  Code, 
  Briefcase,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ResumeBuilder() {
  const { user } = useAuth();
  const [personal, setPersonal] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    summary: ''
  });

  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState('');

  const hasPopulatedRef = useRef(false);

  useEffect(() => {
    if (user && !hasPopulatedRef.current) {
      const isDemoUser = user.email === 'keshavmaan@college.edu' || user.email === 'keshav.maan@fake-college.edu';
      if (isDemoUser) {
        setPersonal({
          name: user.name || 'Keshav Maan',
          email: user.email || 'keshav.maan@college.edu',
          phone: '+91 98765 43210',
          linkedin: 'linkedin.com/in/keshavmaan',
          github: 'github.com/keshavmaan',
          summary: 'Enthusiastic Computer Science undergrad specializing in Full Stack Development and AI applications. Proven track record of building responsive, scalable software solutions.'
        });
        setEducation([
          { id: '1', school: 'Apex Institute of Technology', degree: 'B.Tech in Computer Science', year: '2023 - 2027', gpa: '9.1 CGPA' }
        ]);
        setExperience([
          { id: '1', company: 'NextGen Software Corp', role: 'Software Engineer Intern', duration: 'Summer 2025', desc: 'Developed core features for a cloud-based CRM tool using React and Node.js. Reduced API response times by 15% through query optimizations.' }
        ]);
        setProjects([
          { id: '1', title: 'Aegis Student Hub', tech: 'React, Node.js, Express, MongoDB', desc: 'An all-in-one student productivity dashboard with interactive note managers, attendance loggers, and automated study guide generators.' }
        ]);
        setSkills('React.js, Node.js, Express, MongoDB, JavaScript, Python, C++, Data Structures & Algorithms, Git, Tailwind CSS');
      } else {
        setPersonal({
          name: user.name || '',
          email: user.email || '',
          phone: '',
          linkedin: user.name ? `linkedin.com/in/${user.name.toLowerCase().replace(/\s+/g, '')}` : '',
          github: user.name ? `github.com/${user.name.toLowerCase().replace(/\s+/g, '')}` : '',
          summary: ''
        });
      }
      hasPopulatedRef.current = true;
    }
  }, [user]);

  // Education Helpers
  const addEducation = () => {
    setEducation([...education, { id: Math.random().toString(36).substring(2, 9), school: 'University Name', degree: 'Degree Program', year: 'Year range', gpa: 'GPA/Marks' }]);
  };
  const deleteEducation = (id) => {
    setEducation(education.filter(e => e.id !== id));
  };
  const updateEducation = (id, field, value) => {
    setEducation(education.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  // Experience Helpers
  const addExperience = () => {
    setExperience([...experience, { id: Math.random().toString(36).substring(2, 9), company: 'Company Name', role: 'Job Title', duration: 'Duration', desc: 'Brief description of achievements...' }]);
  };
  const deleteExperience = (id) => {
    setExperience(experience.filter(exp => exp.id !== id));
  };
  const updateExperience = (id, field, value) => {
    setExperience(experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  // Project Helpers
  const addProject = () => {
    setProjects([...projects, { id: Math.random().toString(36).substring(2, 9), title: 'Project Title', tech: 'Tech Stack Used', desc: 'Describe project goal and impact...' }]);
  };
  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };
  const updateProject = (id, field, value) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  // Native Print Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 text-left">
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h3 className="text-lg font-bold text-slate-200">Interactive Resume Builder</h3>
          <p className="text-xs text-slate-500">Draft your professional CV and download it directly as a PDF</p>
        </div>

        <button 
          onClick={handlePrint}
          className="glass-btn-primary flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      {/* Grid: Form (Left) & Print Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Interactive forms */}
        <div className="space-y-6 print:hidden">
          
          {/* 1. Personal Info */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/60 space-y-4">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5"><User className="w-4 h-4 text-brand-400" /> Personal Info</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Full Name" 
                value={personal.name} 
                onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
                className="glass-input text-xs" 
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={personal.email} 
                onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                className="glass-input text-xs" 
              />
              <input 
                type="text" 
                placeholder="Phone Number" 
                value={personal.phone} 
                onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                className="glass-input text-xs" 
              />
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="LinkedIn Link" 
                  value={personal.linkedin} 
                  onChange={(e) => setPersonal({ ...personal, linkedin: e.target.value })}
                  className="glass-input text-xs" 
                />
                <input 
                  type="text" 
                  placeholder="GitHub Link" 
                  value={personal.github} 
                  onChange={(e) => setPersonal({ ...personal, github: e.target.value })}
                  className="glass-input text-xs" 
                />
              </div>
            </div>
            <textarea 
              placeholder="Career Summary" 
              value={personal.summary} 
              onChange={(e) => setPersonal({ ...personal, summary: e.target.value })}
              className="glass-input text-xs h-20 resize-none" 
            />
          </div>

          {/* 2. Education Cards */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/60 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-indigo-400" /> Education</h4>
              <button onClick={addEducation} className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-0.5"><Plus className="w-3.5 h-3.5" /> Add</button>
            </div>
            
            {education.map((edu) => (
              <div key={edu.id} className="p-4 rounded-xl bg-slate-950/20 border border-slate-900/60 space-y-3 relative">
                <button onClick={() => deleteEducation(edu.id)} className="absolute top-3 right-3 text-slate-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="College / School" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} className="glass-input text-xs py-2" />
                  <input type="text" placeholder="Degree / Course" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="glass-input text-xs py-2" />
                  <input type="text" placeholder="Duration (e.g. 2023 - 2027)" value={edu.year} onChange={(e) => updateEducation(edu.id, 'year', e.target.value)} className="glass-input text-xs py-2" />
                  <input type="text" placeholder="GPA / Marks" value={edu.gpa} onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)} className="glass-input text-xs py-2" />
                </div>
              </div>
            ))}
          </div>

          {/* 3. Projects Cards */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/60 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5"><Code className="w-4 h-4 text-cyan-400" /> Projects</h4>
              <button onClick={addProject} className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-0.5"><Plus className="w-3.5 h-3.5" /> Add</button>
            </div>

            {projects.map((proj) => (
              <div key={proj.id} className="p-4 rounded-xl bg-slate-950/20 border border-slate-900/60 space-y-3 relative">
                <button onClick={() => deleteProject(proj.id)} className="absolute top-3 right-3 text-slate-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Project Title" value={proj.title} onChange={(e) => updateProject(proj.id, 'title', e.target.value)} className="glass-input text-xs py-2" />
                  <input type="text" placeholder="Technologies used" value={proj.tech} onChange={(e) => updateProject(proj.id, 'tech', e.target.value)} className="glass-input text-xs py-2" />
                </div>
                <textarea placeholder="Describe achievements or features..." value={proj.desc} onChange={(e) => updateProject(proj.id, 'desc', e.target.value)} className="glass-input text-xs h-16 resize-none" />
              </div>
            ))}
          </div>

          {/* 4. Experience Cards */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/60 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-emerald-400" /> Experience</h4>
              <button onClick={addExperience} className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-0.5"><Plus className="w-3.5 h-3.5" /> Add</button>
            </div>

            {experience.map((exp) => (
              <div key={exp.id} className="p-4 rounded-xl bg-slate-950/20 border border-slate-900/60 space-y-3 relative">
                <button onClick={() => deleteExperience(exp.id)} className="absolute top-3 right-3 text-slate-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Company / Org" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="glass-input text-xs py-2" />
                  <input type="text" placeholder="Designation" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} className="glass-input text-xs py-2" />
                  <input type="text" placeholder="Duration" value={exp.duration} onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)} className="glass-input text-xs py-2" />
                </div>
                <textarea placeholder="Describe responsibilities and impact..." value={exp.desc} onChange={(e) => updateExperience(exp.id, 'desc', e.target.value)} className="glass-input text-xs h-16 resize-none" />
              </div>
            ))}
          </div>

          {/* 5. Skills */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/60 space-y-3">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5"><Compass className="w-4 h-4 text-amber-400" /> Technical Skills</h4>
            <input 
              type="text" 
              placeholder="e.g., Python, SQL, React, DSA, Git" 
              value={skills} 
              onChange={(e) => setSkills(e.target.value)}
              className="glass-input text-xs" 
            />
          </div>

        </div>

        {/* Right Side: Professional CV Print Preview */}
        <div className="print-target bg-white text-slate-900 p-8 rounded-xl shadow-2xl border border-slate-200 aspect-[1/1.414] overflow-y-auto max-h-[800px] print:max-h-none print:shadow-none print:border-none print:p-0 print:m-0">
          
          {/* Resume Header */}
          <div className="text-center space-y-1 pb-4 border-b-2 border-slate-800">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{personal.name || 'Student Name'}</h1>
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[10px] text-slate-600 font-medium">
              <span>{personal.email}</span>
              <span>•</span>
              <span>{personal.phone}</span>
              <span>•</span>
              <span>{personal.linkedin}</span>
              <span>•</span>
              <span>{personal.github}</span>
            </div>
          </div>

          {/* Career Summary */}
          {personal.summary && (
            <div className="py-4 text-left border-b border-slate-100">
              <p className="text-[11px] leading-relaxed text-slate-700 italic">
                {personal.summary}
              </p>
            </div>
          )}

          {/* Education section */}
          {education.length > 0 && (
            <div className="py-4 text-left border-b border-slate-100 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-4 border-slate-800 pl-2">Education</h3>
              <div className="space-y-2.5">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-900">{edu.degree}</h4>
                      <p className="text-[10px] text-slate-600">{edu.school}</p>
                    </div>
                    <div className="text-right text-[10px] font-semibold text-slate-500">
                      <div>{edu.year}</div>
                      <div className="text-slate-800 font-bold">{edu.gpa}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience section */}
          {experience.length > 0 && (
            <div className="py-4 text-left border-b border-slate-100 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-4 border-slate-800 pl-2">Experience</h3>
              <div className="space-y-3">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-900">
                      <span>{exp.role} — {exp.company}</span>
                      <span className="text-[10px] font-semibold text-slate-500">{exp.duration}</span>
                    </div>
                    <p className="text-[10px] leading-relaxed text-slate-700">
                      {exp.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects section */}
          {projects.length > 0 && (
            <div className="py-4 text-left border-b border-slate-100 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-4 border-slate-800 pl-2">Projects</h3>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-900">
                      <span>{proj.title}</span>
                      <span className="text-[9px] font-medium text-slate-500 italic">[{proj.tech}]</span>
                    </div>
                    <p className="text-[10px] leading-relaxed text-slate-700">
                      {proj.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills section */}
          {skills.trim() && (
            <div className="py-4 text-left space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-4 border-slate-800 pl-2">Technical Skills</h3>
              <p className="text-[10px] leading-relaxed text-slate-700">
                {skills}
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Global CSS Styles for printing the resume cleanly */}
      <style>{`
        @media print {
          /* Hide app sidebars, headers, forms, and background elements */
          body, html {
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          header, aside, .print:hidden, .print\\:hidden, button, form, nav {
            display: none !important;
          }
          .print-target {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 2cm !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
            max-height: none !important;
            overflow: visible !important;
          }
        }
      `}</style>

    </div>
  );
}
