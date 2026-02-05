import React from 'react';
import { Template, DocumentType, ViewState } from '../types';
import { BadgeCheck, ArrowRight } from 'lucide-react';

interface TemplateLibraryProps {
  onSelectTemplate: (template: Template) => void;
  onNavigate: (view: ViewState) => void;
}

const SAMPLE_TEMPLATES: Template[] = [
  {
    id: 't1',
    name: 'Modul Ajar Standar',
    description: 'Struktur modul komprehensif yang sesuai dengan standar 2024. Mencakup rincian kegiatan.',
    type: DocumentType.TEACHING_MODULE,
    isVerified: true,
    thumbnailUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy-H4PKshk69pRLj3o9pM68uk7DjdSesyyHQ&s'
  },
  {
    id: 't2',
    name: 'Laporan Kegiatan Mingguan',
    description: 'Format ringkas untuk melaporkan kegiatan kelas mingguan dan ringkasan kemajuan siswa.',
    type: DocumentType.ACTIVITY_REPORT,
    isVerified: true,
    thumbnailUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy-H4PKshk69pRLj3o9pM68uk7DjdSesyyHQ&s'
  },
  {
    id: 't3',
    name: 'Lembar Refleksi Siswa',
    description: 'Tata letak penilaian diri bagi siswa untuk merefleksikan perjalanan belajar mereka di akhir unit.',
    type: DocumentType.REFLECTION_SHEET,
    isVerified: false,
    thumbnailUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy-H4PKshk69pRLj3o9pM68uk7DjdSesyyHQ&s'
  },
  {
    id: 't4',
    name: 'Rencana Pembelajaran Berbasis Proyek (PjBL)',
    description: 'Templat khusus untuk implementasi PjBL dengan fase yang berbeda untuk inkuiri dan kreasi.',
    type: DocumentType.LESSON_PLAN,
    isVerified: true,
    thumbnailUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy-H4PKshk69pRLj3o9pM68uk7DjdSesyyHQ&s'
  }
];

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onSelectTemplate, onNavigate }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-secondary-light pb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-text-primary">Perpustakaan Templat</h1>
          <p className="text-neutral-text-secondary mt-1">Mulai dengan basis tervalidasi kurikulum untuk dokumen Anda.</p>
        </div>
        <button
          onClick={() => onNavigate(ViewState.DASHBOARD)}
          className="text-primary font-medium hover:text-primary-hover transition-colors"
        >
          Batal & Kembali ke Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SAMPLE_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="group bg-white rounded-xl border border-secondary-light shadow-sm overflow-hidden hover:shadow-lg hover:border-primary-light transition-all duration-300 flex flex-col"
          >
            <div className="h-48 overflow-hidden relative bg-neutral-bg">
              <img
                src={template.thumbnailUrl}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              {template.isVerified && (
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm py-1 px-2 rounded-md shadow-sm flex items-center gap-1.5 text-xs font-bold text-emerald-700 border border-emerald-100">
                  <BadgeCheck size={14} className="fill-emerald-100 text-emerald-600" />
                  Standar Kurikulum Batam
                </div>
              )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-text-secondary bg-neutral-bg px-2 py-0.5 rounded border border-secondary-light">
                  {template.type}
                </span>
              </div>
              <h3 className="text-lg font-bold text-neutral-text-primary mb-2 group-hover:text-primary transition-colors">
                {template.name}
              </h3>
              <p className="text-sm text-neutral-text-secondary mb-6 flex-1 leading-relaxed">
                {template.description}
              </p>

              <button
                onClick={() => onSelectTemplate(template)}
                className="w-full py-2.5 bg-white border border-secondary-light text-neutral-text-primary font-medium rounded-lg group-hover:bg-primary group-hover:text-white group-hover:border-transparent transition-all flex items-center justify-center gap-2"
              >
                Gunakan Templat
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
