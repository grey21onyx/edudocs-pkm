import React from 'react';
import { Template, DocumentType, ViewState } from '../types';
import { BadgeCheck, LayoutTemplate, ArrowRight } from 'lucide-react';

interface TemplateLibraryProps {
  onSelectTemplate: (template: Template) => void;
  onNavigate: (view: ViewState) => void;
}

const SAMPLE_TEMPLATES: Template[] = [
  {
    id: 't1',
    name: 'Standard Teaching Module',
    description: 'Comprehensive module structure compliant with 2024 standards. Includes detailed activity breakdowns.',
    type: DocumentType.TEACHING_MODULE,
    isVerified: true,
    thumbnailUrl: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: 't2',
    name: 'Weekly Activity Report',
    description: 'Concise format for reporting weekly classroom activities and student progress summaries.',
    type: DocumentType.ACTIVITY_REPORT,
    isVerified: true,
    thumbnailUrl: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: 't3',
    name: 'Student Reflection Sheet',
    description: 'Self-assessment layout for students to reflect on their learning journey at the end of a unit.',
    type: DocumentType.REFLECTION_SHEET,
    isVerified: false,
    thumbnailUrl: 'https://picsum.photos/400/300?random=3'
  },
  {
    id: 't4',
    name: 'Project Based Learning Plan',
    description: 'Specialized template for PBL implementation with distinct phases for inquiry and creation.',
    type: DocumentType.LESSON_PLAN,
    isVerified: true,
    thumbnailUrl: 'https://picsum.photos/400/300?random=4'
  }
];

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onSelectTemplate, onNavigate }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Template Library</h1>
          <p className="text-slate-500 mt-1">Start with a curriculum-validated base for your documents.</p>
        </div>
        <button 
            onClick={() => onNavigate(ViewState.DASHBOARD)}
            className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
        >
            Cancel & Return to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SAMPLE_TEMPLATES.map((template) => (
            <div 
                key={template.id} 
                className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col"
            >
                <div className="h-48 overflow-hidden relative bg-slate-100">
                    <img 
                        src={template.thumbnailUrl} 
                        alt={template.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                    {template.isVerified && (
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm py-1 px-2 rounded-md shadow-sm flex items-center gap-1.5 text-xs font-bold text-emerald-700 border border-emerald-100">
                            <BadgeCheck size={14} className="fill-emerald-100 text-emerald-600" />
                            Batam Curriculum Standard
                        </div>
                    )}
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                         <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                             {template.type}
                         </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                        {template.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-6 flex-1 leading-relaxed">
                        {template.description}
                    </p>
                    
                    <button 
                        onClick={() => onSelectTemplate(template)}
                        className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent transition-all flex items-center justify-center gap-2"
                    >
                        Use Template
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
