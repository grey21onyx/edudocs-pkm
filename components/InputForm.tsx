import React, { useState, useEffect } from 'react';
import { AcademicDocument, ViewState, DocContent } from '../types';
import { Save, Eye, ArrowLeft, Wand2, Loader2 } from 'lucide-react';
import { generateLessonContent } from '../services/gemini';

interface InputFormProps {
  document: AcademicDocument;
  onUpdate: (doc: AcademicDocument) => void;
  onNavigate: (view: ViewState) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ document, onUpdate, onNavigate }) => {
  const [formData, setFormData] = useState<AcademicDocument>(document);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [generatingSection, setGeneratingSection] = useState<keyof DocContent | null>(null);

  // Debounced save simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAutoSaving(true);
      onUpdate(formData);
      setTimeout(() => setIsAutoSaving(false), 800);
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData, onUpdate]);

  const handleChange = (field: string, value: string) => {
    if (field in formData) {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({ ...prev, content: { ...prev.content, [field]: value } }));
    }
  };

  const handleAiGenerate = async (section: keyof DocContent) => {
    if (!formData.title) {
        alert("Please enter a Document Title first to help the AI understand context.");
        return;
    }
    setGeneratingSection(section);
    const result = await generateLessonContent(formData.title, section);
    handleChange(section, result);
    setGeneratingSection(null);
  };

  const calculateProgress = () => {
    let filled = 0;
    const total = 5; // Title + 4 content fields
    if (formData.title) filled++;
    if (formData.content.outcomes) filled++;
    if (formData.content.objectives) filled++;
    if (formData.content.activities) filled++;
    if (formData.content.assessments) filled++;
    return Math.round((filled / total) * 100);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate(ViewState.DASHBOARD)} className="text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Untitled Document"
              className="text-lg font-bold text-slate-800 border-none focus:ring-0 p-0 placeholder-slate-300 w-96 bg-transparent"
            />
            <div className="flex items-center gap-2 text-xs mt-1 text-slate-400">
               <span>{isAutoSaving ? 'Saving...' : 'All changes saved automatically'}</span>
               {isAutoSaving && <Loader2 size={10} className="animate-spin" />}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-2">
            <span className="text-xs font-semibold text-slate-500 mb-1">{calculateProgress()}% Completed</span>
            <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Form */}
      <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-10 pb-24">
            
            {/* Meta Data Section */}
            <div className="grid grid-cols-2 gap-6 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="col-span-2">
                    <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-4">Document Details</h3>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Class / Grade</label>
                    <input 
                        type="text" 
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        value={formData.classGrade || ''}
                        onChange={(e) => handleChange('classGrade', e.target.value)}
                        placeholder="e.g. Grade 10 Science"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
                    <select 
                         className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                         value={formData.semester || ''}
                         onChange={(e) => handleChange('semester', e.target.value)}
                    >
                        <option value="">Select Semester</option>
                        <option value="Odd">Odd Semester</option>
                        <option value="Even">Even Semester</option>
                    </select>
                </div>
            </div>

            {/* Input Sections */}
            {[
                { 
                    id: 'outcomes', 
                    label: 'Learning Outcomes', 
                    tooltip: 'What will students achieve by the end of this module? Use measurable verbs.',
                    placeholder: '- Students will be able to define...\n- Students will analyze...' 
                },
                { 
                    id: 'objectives', 
                    label: 'Learning Objectives', 
                    tooltip: 'Specific, granular goals for this particular lesson sequence.',
                    placeholder: '1. Identify the key components of...\n2. Compare and contrast...' 
                },
                { 
                    id: 'activities', 
                    label: 'Activity Steps', 
                    tooltip: 'Detailed chronological steps for the lesson. Include timestamps.',
                    placeholder: 'Introduction (10 mins):\n- Teacher greets students...\n\nMain Activity (40 mins):\n- Group work on...' 
                },
                { 
                    id: 'assessments', 
                    label: 'Assessment Instruments', 
                    tooltip: 'How will you evaluate student understanding? (Quizzes, Observation, Projects)',
                    placeholder: 'Formative:\n- Exit ticket question...\n\nSummative:\n- Final project rubric...' 
                },
            ].map((section) => (
                <div key={section.id} className="group relative bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all hover:shadow-md hover:border-indigo-200">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <label className="block text-lg font-semibold text-slate-800">{section.label}</label>
                            <p className="text-sm text-slate-500 mt-1">{section.tooltip}</p>
                        </div>
                        <button 
                            onClick={() => handleAiGenerate(section.id as keyof DocContent)}
                            disabled={generatingSection === section.id}
                            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border transition-all
                                ${generatingSection === section.id 
                                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-wait' 
                                    : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'}`}
                        >
                            {generatingSection === section.id ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                            {generatingSection === section.id ? 'Thinking...' : 'AI Assist'}
                        </button>
                    </div>
                    <textarea 
                        className="w-full min-h-[160px] p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-y leading-relaxed"
                        placeholder={section.placeholder}
                        value={(formData.content as any)[section.id]}
                        onChange={(e) => handleChange(section.id, e.target.value)}
                    />
                </div>
            ))}
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button 
                onClick={() => onNavigate(ViewState.DASHBOARD)}
                className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
            >
                Back to Dashboard
            </button>
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => onUpdate(formData)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                    <Save size={18} />
                    Save Draft
                </button>
                <button 
                    onClick={() => {
                        onUpdate(formData);
                        onNavigate(ViewState.PREVIEW);
                    }}
                    className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
                >
                    <Eye size={18} />
                    Continue to Preview
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};