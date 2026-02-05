import React, { useState } from 'react';
import { LayoutDashboard, FilePlus, BookOpen, Settings, UserCircle, Bell } from 'lucide-react';
import { AcademicDocument, DocumentStatus, DocumentType, ViewState, Template } from './types';
import { Dashboard } from './components/Dashboard';
import { InputForm } from './components/InputForm';
import { Preview } from './components/Preview';
import { TemplateLibrary } from './components/TemplateLibrary';

// Data Mock (Diterjemahkan)
const INITIAL_DOCS: AcademicDocument[] = [
  {
    id: 'doc_001',
    title: 'Pengantar Biologi: Struktur Sel',
    type: DocumentType.TEACHING_MODULE,
    status: DocumentStatus.FINAL,
    lastModified: '2023-10-24T10:30:00Z',
    classGrade: 'Kelas 10 IPA',
    semester: 'Ganjil',
    content: {
      outcomes: 'Siswa akan memahami struktur dasar sel hewan dan tumbuhan.',
      objectives: '1. Mengidentifikasi nukleus, mitokondria, dan dinding sel.\n2. Membedakan antara sel tumbuhan dan hewan.',
      activities: 'Pendahuluan (15m): Presentasi video.\nKegiatan Inti (45m): Pengamatan mikroskop.',
      assessments: 'Kuis: Pelabelan diagram.'
    }
  },
  {
    id: 'doc_002',
    title: 'Refleksi Mingguan: Unit Aljabar',
    type: DocumentType.REFLECTION_SHEET,
    status: DocumentStatus.DRAFT,
    lastModified: '2023-10-26T14:15:00Z',
    classGrade: 'Kelas 9 Matematika',
    semester: 'Ganjil',
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

  // Navigasi
  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
  };

  // Aksi
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

  // Navbar Atas
  const renderNavbar = () => (
    <nav className="h-16 bg-white border-b border-secondary-light flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm no-print">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo(ViewState.DASHBOARD)}>
        <div className="bg-primary text-white p-2 rounded-lg shadow-md">
          <BookOpen size={20} />
        </div>
        <span className="font-bold text-xl text-neutral-text-primary tracking-tight">EduDoc<span className="text-primary">Std</span></span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {[
          { label: 'Dashboard', view: ViewState.DASHBOARD, icon: LayoutDashboard },
          { label: 'Perpustakaan Templat', view: ViewState.TEMPLATES, icon: FilePlus },
        ].map(item => (
          <button
            key={item.label}
            onClick={() => navigateTo(item.view)}
            className={`flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2 rounded-md ${currentView === item.view
              ? 'text-primary bg-primary-light'
              : 'text-neutral-text-secondary hover:text-primary hover:bg-slate-50'
              }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button className="text-neutral-text-secondary hover:text-primary transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-status-warning rounded-full border border-white"></span>
        </button>
        <div className="h-8 w-px bg-slate-200"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-neutral-text-primary">Joko Subianto</p>
            <p className="text-xs text-neutral-text-secondary">Maha Guru</p>
          </div>
          <div className="bg-primary-light p-1.5 rounded-full text-primary ring-2 ring-white shadow-sm">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOU5Yz4lJy09DqlTk_2yQCV7uD_6tRVWn1nw&s" className="w-8 h-8 rounded-full" alt="Profile" />
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col bg-neutral-bg font-sans text-neutral-text-primary">
      {renderNavbar()}

      <main className="flex-1 w-full max-w-[1440px] mx-auto grid grid-cols-12 gap-6 p-6 md:p-8 relative">
        <div className="col-span-12">
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
        </div>
      </main>

      <footer className="bg-white border-t border-secondary-light py-6 mt-auto">
        <div className="max-w-[1440px] mx-auto px-6 flex justify-between items-center text-sm text-neutral-text-secondary">
          <p>© 2026 Sistem Informasi Dokumentasi Pembelajaran Terstandar Versi beta 0.1</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary">Bantuan</a>
            <a href="#" className="hover:text-primary">Privasi</a>
            <a href="#" className="hover:text-primary">Syarat & Ketentuan</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
