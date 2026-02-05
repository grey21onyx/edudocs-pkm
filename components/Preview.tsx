import React from 'react';
import { AcademicDocument, DocumentStatus, ViewState } from '../types';
import { ArrowLeft, Printer, PenTool, CheckCircle, Download } from 'lucide-react';

interface PreviewProps {
  document: AcademicDocument;
  onNavigate: (view: ViewState) => void;
  onStatusChange: (status: DocumentStatus) => void;
}

export const Preview: React.FC<PreviewProps> = ({ document, onNavigate, onStatusChange }) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col h-full bg-slate-100">
      {/* Action Bar - Hidden on Print */}
      <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate(ViewState.EDITOR)} 
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back to Editor</span>
          </button>
          <div className="h-6 w-px bg-slate-700 mx-2"></div>
          <span className="text-slate-400 text-sm">Preview Mode</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800 rounded-lg p-1 mr-4">
             {Object.values(DocumentStatus).map(status => (
                 <button
                    key={status}
                    onClick={() => onStatusChange(status)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        document.status === status 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                 >
                    {status}
                 </button>
             ))}
          </div>
          
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
          >
            <Download size={18} />
            Export / Print PDF
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        {/* A4 Paper Simulation */}
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-2xl p-[20mm] text-slate-900 mx-auto relative print:shadow-none print:w-full print:m-0">
          
          {/* Header / Letterhead */}
          <div className="border-b-4 border-indigo-900 pb-6 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-900 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                SC
              </div>
              <div>
                <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">School Curriculum Standard</h1>
                <p className="text-sm text-slate-500">Official Academic Document • Batam Region</p>
              </div>
            </div>
            <div className="text-right">
                <div className={`inline-block px-3 py-1 border-2 font-bold uppercase tracking-widest text-xs rounded mb-2
                    ${document.status === DocumentStatus.FINAL ? 'border-emerald-600 text-emerald-600' : 'border-slate-300 text-slate-300'}`}>
                    {document.status === DocumentStatus.FINAL ? 'OFFICIAL' : 'DRAFT COPY'}
                </div>
                <p className="text-xs text-slate-400">Ref: {document.id.substring(0,8).toUpperCase()}</p>
            </div>
          </div>

          {/* Document Title & Meta */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">{document.title || "Untitled Document"}</h2>
            <div className="flex justify-center gap-8 text-sm text-slate-600 border-t border-b border-slate-100 py-3">
                <span><strong>Type:</strong> {document.type}</span>
                <span><strong>Class:</strong> {document.classGrade || "N/A"}</span>
                <span><strong>Semester:</strong> {document.semester || "N/A"}</span>
                <span><strong>Date:</strong> {formattedDate}</span>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8 font-serif">
            <section>
                <h3 className="text-lg font-bold text-indigo-900 uppercase tracking-wide border-b border-indigo-100 mb-3 pb-1">1. Learning Outcomes</h3>
                <div className="whitespace-pre-wrap leading-relaxed text-justify text-slate-800">
                    {document.content.outcomes || <span className="text-slate-300 italic">No outcomes defined.</span>}
                </div>
            </section>

            <section>
                <h3 className="text-lg font-bold text-indigo-900 uppercase tracking-wide border-b border-indigo-100 mb-3 pb-1">2. Learning Objectives</h3>
                <div className="whitespace-pre-wrap leading-relaxed text-justify text-slate-800">
                    {document.content.objectives || <span className="text-slate-300 italic">No objectives defined.</span>}
                </div>
            </section>

            <section>
                <h3 className="text-lg font-bold text-indigo-900 uppercase tracking-wide border-b border-indigo-100 mb-3 pb-1">3. Activity Steps</h3>
                <div className="whitespace-pre-wrap leading-relaxed text-justify text-slate-800">
                    {document.content.activities || <span className="text-slate-300 italic">No activities defined.</span>}
                </div>
            </section>

            <section>
                <h3 className="text-lg font-bold text-indigo-900 uppercase tracking-wide border-b border-indigo-100 mb-3 pb-1">4. Assessment Instruments</h3>
                <div className="whitespace-pre-wrap leading-relaxed text-justify text-slate-800">
                    {document.content.assessments || <span className="text-slate-300 italic">No assessments defined.</span>}
                </div>
            </section>
          </div>

          {/* Footer Signature Area */}
          <div className="mt-20 pt-10 grid grid-cols-2 gap-20 page-break-inside-avoid">
            <div className="text-center">
                <p className="mb-16 font-medium text-slate-800">Acknowledged by,<br/>Principal</p>
                <div className="border-t border-slate-400 w-2/3 mx-auto pt-2">
                    <p className="text-sm text-slate-500">(Signature & Stamp)</p>
                </div>
            </div>
            <div className="text-center">
                <p className="mb-16 font-medium text-slate-800">Prepared by,<br/>Subject Teacher</p>
                <div className="border-t border-slate-400 w-2/3 mx-auto pt-2">
                    <p className="text-sm text-slate-500">(Name & Signature)</p>
                </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
