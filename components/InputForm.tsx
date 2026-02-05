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
      alert("Harap masukkan Judul Dokumen terlebih dahulu agar AI memahami konteksnya.");
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
    <div className="flex flex-col h-full bg-neutral-bg">
      {/* Top Bar */}
      <div className="bg-white border-b border-secondary-light px-8 py-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate(ViewState.DASHBOARD)} className="text-neutral-text-secondary hover:text-neutral-text-primary transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Dokumen Tanpa Judul"
              className="text-lg font-bold text-neutral-text-primary border-none focus:ring-0 p-0 placeholder-neutral-text-secondary w-96 bg-transparent outline-none"
            />
            <div className="flex items-center gap-2 text-xs mt-1 text-secondary">
              <span>{isAutoSaving ? 'Menyimpan...' : 'Perubahan tersimpan otomatis'}</span>
              {isAutoSaving && <Loader2 size={10} className="animate-spin" />}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-2">
            <span className="text-xs font-semibold text-secondary mb-1">{calculateProgress()}% Selesai</span>
            <div className="w-32 h-1.5 bg-secondary-light rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
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
          <div className="grid grid-cols-2 gap-6 p-6 bg-white rounded-xl shadow-sm border border-secondary-light">
            <div className="col-span-2">
              <h3 className="text-sm font-semibold text-neutral-text-primary uppercase tracking-wide mb-4">Detail Dokumen</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-text-secondary mb-1">Kelas / Tingkat</label>
              <input
                type="text"
                className="w-full border border-secondary-light rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-neutral-text-primary placeholder-neutral-text-secondary"
                value={formData.classGrade || ''}
                onChange={(e) => handleChange('classGrade', e.target.value)}
                placeholder="Contoh: Kelas 10 IPA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-text-secondary mb-1">Semester</label>
              <select
                className="w-full border border-secondary-light rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white text-neutral-text-primary"
                value={formData.semester || ''}
                onChange={(e) => handleChange('semester', e.target.value)}
              >
                <option value="">Pilih Semester</option>
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>
          </div>

          {/* Input Sections */}
          {[
            {
              id: 'outcomes',
              label: 'Capaian Pembelajaran',
              tooltip: 'Apa yang akan dicapai siswa di akhir modul ini? Gunakan kata kerja terukur.',
              placeholder: '- Siswa mampu mendefinisikan...\n- Siswa akan menganalisis...'
            },
            {
              id: 'objectives',
              label: 'Tujuan Pembelajaran',
              tooltip: 'Tujuan spesifik dan terperinci untuk urutan pelajaran ini.',
              placeholder: '1. Mengidentifikasi komponen kunci dari...\n2. Membandingkan dan membedakan...'
            },
            {
              id: 'activities',
              label: 'Langkah Kegiatan',
              tooltip: 'Langkah kronologis rinci untuk pelajaran. Sertakan durasi waktu.',
              placeholder: 'Pendahuluan (10 mnt):\n- Guru menyapa siswa...\n\nKegiatan Inti (40 mnt):\n- Kerja kelompok tentang...'
            },
            {
              id: 'assessments',
              label: 'Instrumen Penilaian',
              tooltip: 'Bagaimana Anda mengevaluasi pemahaman siswa? (Kuis, Observasi, Proyek)',
              placeholder: 'Formatif:\n- Tiket keluar...\n\nSumatif:\n- Rubrik proyek akhir...'
            },
          ].map((section) => (
            <div key={section.id} className="group relative bg-white p-6 rounded-xl shadow-sm border border-secondary-light transition-all hover:shadow-md hover:border-primary-light">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <label className="block text-lg font-semibold text-neutral-text-primary">{section.label}</label>
                  <p className="text-sm text-neutral-text-secondary mt-1">{section.tooltip}</p>
                </div>
                <button
                  onClick={() => handleAiGenerate(section.id as keyof DocContent)}
                  disabled={generatingSection === section.id}
                  className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border transition-all
                                ${generatingSection === section.id
                      ? 'bg-secondary-light text-secondary border-secondary cursor-wait'
                      : 'bg-indigo-50 text-primary border-primary-light hover:bg-primary-light'}`}
                >
                  {generatingSection === section.id ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                  {generatingSection === section.id ? 'Berpikir...' : 'Bantuan AI'}
                </button>
              </div>
              <textarea
                className="w-full min-h-[160px] p-4 bg-neutral-bg border border-secondary-light rounded-lg text-neutral-text-primary focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-y leading-relaxed"
                placeholder={section.placeholder}
                value={(formData.content as any)[section.id]}
                onChange={(e) => handleChange(section.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="bg-white border-t border-secondary-light p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => onNavigate(ViewState.DASHBOARD)}
            className="px-6 py-2 text-neutral-text-secondary font-medium hover:bg-neutral-bg rounded-lg transition-colors"
          >
            Kembali ke Dashboard
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onUpdate(formData)}
              className="flex items-center gap-2 px-6 py-2.5 bg-white border border-secondary-light text-neutral-text-primary font-medium rounded-lg hover:bg-neutral-bg transition-colors"
            >
              <Save size={18} />
              Simpan Draf
            </button>
            <button
              onClick={() => {
                onUpdate(formData);
                onNavigate(ViewState.PREVIEW);
              }}
              className="flex items-center gap-2 px-8 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover shadow-md shadow-primary-light transition-all transform hover:-translate-y-0.5"
            >
              <Eye size={18} />
              Lanjut ke Pratinjau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};