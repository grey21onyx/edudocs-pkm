import React, { useState } from 'react';
import { LayoutDashboard, FilePlus, BookOpen, Settings, UserCircle, Bell } from 'lucide-react';
import { AcademicDocument, DocumentStatus, DocumentType, ViewState, Template } from './types';
import { Dashboard } from './components/Dashboard';
import { InputForm } from './components/InputForm';
import { Preview } from './components/Preview';
import { TemplateLibrary } from './components/TemplateLibrary';

// Mock Data
const INITIAL_DOCS: AcademicDocument[] = [
  {
    id: 'doc_001',
    title: 'Introduction to Biology: Cell Structure',
    type: DocumentType.TEACHING_MODULE,
    status: DocumentStatus.FINAL,
    lastModified: '2023-10-24T10:30:00Z',
    classGrade: 'Grade 10 Science',
    semester: 'Odd',
    content: {
      outcomes: 'Students will understand the basic structure of animal and plant cells.',
      objectives: '1. Identify nucleus, mitochondria, and cell wall.\n2. Differentiate between plant and animal cells.',
      activities: 'Introduction (15m): Video presentation.\nLab Work (45m): Microscope observation.',
      assessments: 'Quiz: Diagram labeling.'
    }
  },
  {
    id: 'doc_002',
    title: 'Weekly Reflection: Algebra Unit',
    type: DocumentType.REFLECTION_SHEET,
    status: DocumentStatus.DRAFT,
    lastModified: '2023-10-26T14:15:00Z',
    classGrade: 'Grade 9 Math',
    semester: 'Odd',
    content: {
      outcomes: '',
      objectives: '',
      activities: '',
      assessments: ''
    }
  }
];

const EMPTY_DOC: AcademicDocument = {
  id: '',
  title: '',
  type: DocumentType.TEACHING_MODULE,
  status: DocumentStatus.DRAFT,
  lastModified: new Date().toISOString(),
  content: { outcomes: '', objectives: '', activities: '', assessments: '' }
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [documents, setDocuments] = useState<AcademicDocument[]>(INITIAL_DOCS);
  const [currentDoc, setCurrentDoc] = useState<AcademicDocument | null>(null);

  // Navigation Handler
  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
  };

  // Actions
  const handleEditDocument = (doc: AcademicDocument) => {
    setCurrentDoc(doc);
    navigateTo(ViewState.EDITOR);
  };

  const handleCreateNew = () => {
    navigateTo(ViewState.TEMPLATES);
  };

  const handleSelectTemplate = (template: Template) => {
    const newDoc: AcademicDocument = {
      ...EMPTY_DOC,
      id: `doc_${Date.now()}`,
      type: template.type,
      lastModified: new Date().toISOString(),
    };
    setDocuments([newDoc, ...documents]);
    setCurrentDoc(newDoc);
    navigateTo(ViewState.EDITOR);
  };

  const handleUpdateDocument = (updatedDoc: AcademicDocument) => {
    const newDocs = documents.map(d => d.id === updatedDoc.id ? { ...updatedDoc, lastModified: new Date().toISOString() } : d);
    setDocuments(newDocs);
    setCurrentDoc(updatedDoc);
  };

  const handleStatusChange = (status: DocumentStatus) => {
    if (currentDoc) {
        const updated = { ...currentDoc, status };
        handleUpdateDocument(updated);
    }
  };

  // Top Navigation Bar
  const renderNavbar = () => (
    <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 no-print">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo(ViewState.DASHBOARD)}>
        <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
          <BookOpen size={20} />
        </div>
        <span className="font-bold text-xl text-slate-800 tracking-tight">EduDoc<span className="text-indigo-600">Std</span></span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {[
          { label: 'Dashboard', view: ViewState.DASHBOARD, icon: LayoutDashboard },
          { label: 'Templates', view: ViewState.TEMPLATES, icon: FilePlus },
        ].map(item => (
          <button 
            key={item.label}
            onClick={() => navigateTo(item.view)}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              currentView === item.view ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-slate-600">
          <Bell size={20} />
        </button>
        <div className="h-8 w-px bg-slate-200"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-700">Sarah Johnson</p>
            <p className="text-xs text-slate-500">Senior Teacher</p>
          </div>
          <div className="bg-indigo-100 p-1 rounded-full text-indigo-600">
            <UserCircle size={32} />
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {renderNavbar()}

      <main className="flex-1 overflow-hidden relative">
        {currentView === ViewState.DASHBOARD && (
          <Dashboard 
            documents={documents}
            onNavigate={navigateTo}
            onEditDocument={handleEditDocument}
            onCreateNew={handleCreateNew}
          />
        )}

        {currentView === ViewState.EDITOR && currentDoc && (
          <InputForm 
            document={currentDoc}
            onUpdate={handleUpdateDocument}
            onNavigate={navigateTo}
          />
        )}

        {currentView === ViewState.PREVIEW && currentDoc && (
          <Preview 
            document={currentDoc}
            onNavigate={navigateTo}
            onStatusChange={handleStatusChange}
          />
        )}

        {currentView === ViewState.TEMPLATES && (
          <TemplateLibrary 
            onSelectTemplate={handleSelectTemplate}
            onNavigate={navigateTo}
          />
        )}
      </main>
    </div>
  );
};

export default App;
