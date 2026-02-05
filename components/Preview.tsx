import React from 'react';
import { AcademicDocument, DocumentStatus, ViewState } from '../types';
import { ArrowLeft, Download } from 'lucide-react';

interface PreviewProps {
  document: AcademicDocument;
  onNavigate: (view: ViewState) => void;
  onStatusChange: (status: DocumentStatus) => void;
}

export const Preview: React.FC<PreviewProps> = ({ document, onNavigate, onStatusChange }) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col h-full bg-secondary-light">
      {/* Action Bar - Hidden on Print */}
      <div className="no-print bg-neutral-text-primary text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate(ViewState.EDITOR)}
            className="flex items-center gap-2 text-neutral-text-secondary hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Kembali ke Editor</span>
          </button>
          <div className="h-6 w-px bg-secondary mx-2"></div>
          <span className="text-neutral-text-secondary text-sm">Mode Pratinjau</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-neutral-text-primary rounded-lg p-1 mr-4 border border-secondary">
            {Object.values(DocumentStatus).map(status => (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${document.status === status
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-neutral-text-secondary hover:text-white'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
          >
            <Download size={18} />
            Ekspor / Cetak PDF
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        {/* A4 Paper Simulation */}
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-2xl p-[20mm] text-neutral-text-primary mx-auto relative print:shadow-none print:w-full print:m-0 print:p-0">

          {/* Header / Letterhead */}
          <div className="border-b-4 border-primary pb-6 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                SC
              </div>
              <div>
                <h1 className="text-xl font-bold uppercase tracking-wider text-neutral-text-primary">Standar Kurikulum Sekolah</h1>
                <p className="text-sm text-neutral-text-secondary">Dokumen Akademik Resmi • Wilayah Batam</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-block px-3 py-1 border-2 font-bold uppercase tracking-widest text-xs rounded mb-2
                    ${document.status === DocumentStatus.FINAL ? 'border-status-final text-status-final' : 'border-neutral-text-secondary text-neutral-text-secondary'}`}>
                {document.status === DocumentStatus.FINAL ? 'RESMI' : 'SALINAN DRAF'}
              </div>
              <p className="text-xs text-neutral-text-secondary">Ref: {document.id.substring(0, 8).toUpperCase()}</p>
            </div>
          </div>

          {/* Document Title & Meta */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-serif font-bold text-neutral-text-primary mb-4">{document.title || "Dokumen Tanpa Judul"}</h2>
            <div className="flex justify-center gap-8 text-sm text-neutral-text-primary border-t border-b border-secondary-light py-3">
              <span><strong>Tipe:</strong> {document.type}</span>
              <span><strong>Kelas:</strong> {document.classGrade || "-"}</span>
              <span><strong>Semester:</strong> {document.semester || "-"}</span>
              <span><strong>Tanggal:</strong> {formattedDate}</span>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8 font-serif">
            <section>
              <h3 className="text-lg font-bold text-primary uppercase tracking-wide border-b border-secondary-light mb-3 pb-1">1. Capaian Pembelajaran</h3>
              <div className="whitespace-pre-wrap leading-relaxed text-justify text-neutral-text-primary">
                {document.content.outcomes || <span className="text-neutral-text-secondary italic">Belum ada capaian.</span>}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-primary uppercase tracking-wide border-b border-secondary-light mb-3 pb-1">2. Tujuan Pembelajaran</h3>
              <div className="whitespace-pre-wrap leading-relaxed text-justify text-neutral-text-primary">
                {document.content.objectives || <span className="text-neutral-text-secondary italic">Belum ada tujuan.</span>}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-primary uppercase tracking-wide border-b border-secondary-light mb-3 pb-1">3. Langkah Kegiatan</h3>
              <div className="whitespace-pre-wrap leading-relaxed text-justify text-neutral-text-primary">
                {document.content.activities || <span className="text-neutral-text-secondary italic">Belum ada kegiatan.</span>}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-primary uppercase tracking-wide border-b border-secondary-light mb-3 pb-1">4. Instrumen Penilaian</h3>
              <div className="whitespace-pre-wrap leading-relaxed text-justify text-neutral-text-primary">
                {document.content.assessments || <span className="text-neutral-text-secondary italic">Belum ada penilaian.</span>}
              </div>
            </section>
          </div>

          {/* Footer Signature Area */}
          <div className="mt-20 pt-10 grid grid-cols-2 gap-20 page-break-inside-avoid">
            <div className="text-center">
              <p className="mb-16 font-medium text-neutral-text-primary">Mengetahui,<br />Kepala Sekolah</p>
              <div className="border-t border-neutral-text-secondary w-2/3 mx-auto pt-2">
                <p className="text-sm text-neutral-text-secondary">(Tanda Tangan & Stempel)</p>
              </div>
            </div>
            <div className="text-center">
              <p className="mb-16 font-medium text-neutral-text-primary">Disusun oleh,<br />Guru Mata Pelajaran</p>
              <div className="border-t border-neutral-text-secondary w-2/3 mx-auto pt-2">
                <p className="text-sm text-neutral-text-secondary">(Nama & Tanda Tangan)</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
