import React, { useState } from 'react';
import { AcademicDocument, DocumentStatus, DocumentType, ViewState } from '../types';
import { Search, Filter, FileText, Plus, MoreVertical, Clock, CheckCircle, File } from 'lucide-react';

interface DashboardProps {
  documents: AcademicDocument[];
  onNavigate: (view: ViewState) => void;
  onEditDocument: (doc: AcademicDocument) => void;
  onCreateNew: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ documents, onNavigate, onEditDocument, onCreateNew }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('Semua');

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'Semua' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: documents.length,
    drafts: documents.filter(d => d.status === DocumentStatus.DRAFT).length,
    completed: documents.filter(d => d.status === DocumentStatus.FINAL || d.status === DocumentStatus.READY_TO_PRINT).length
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-text-primary">Dashboard</h1>
          <p className="text-neutral-text-secondary mt-1">Kelola dokumen akademik Anda dan pantau kemajuan.</p>
        </div>
        <button
          onClick={onCreateNew}
          className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Buat Dokumen Baru
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-secondary-light shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-primary rounded-lg">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-text-secondary">Total Dokumen</p>
            <p className="text-2xl font-bold text-neutral-text-primary">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-secondary-light shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-status-warning rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-text-secondary">Draf Sedang Proses</p>
            <p className="text-2xl font-bold text-neutral-text-primary">{stats.drafts}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-secondary-light shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-status-final rounded-lg">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-text-secondary">Selesai & Siap</p>
            <p className="text-2xl font-bold text-neutral-text-primary">{stats.completed}</p>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white border border-secondary-light rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-secondary-light flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-text-secondary" size={18} />
            <input
              type="text"
              placeholder="Cari dokumen..."
              className="w-full pl-10 pr-4 py-2 border border-secondary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-neutral-text-primary placeholder-neutral-text-secondary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-text-secondary" size={16} />
              <select
                className="pl-9 pr-8 py-2 border border-secondary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm appearance-none bg-white text-neutral-text-primary"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="Semua">Semua Tipe</option>
                {Object.values(DocumentType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-bg text-neutral-text-secondary text-xs uppercase tracking-wider font-semibold border-b border-secondary-light">
                <th className="px-6 py-4">Judul Dokumen</th>
                <th className="px-6 py-4">Tipe</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Terakhir Diubah</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-light">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-neutral-bg cursor-pointer transition-colors"
                    onClick={() => onEditDocument(doc)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-primary rounded-lg">
                          <File size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-text-primary">{doc.title}</p>
                          <p className="text-xs text-neutral-text-secondary">{doc.classGrade || 'Kelas Belum Diatur'} • {doc.semester || 'Semester Belum Diatur'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-secondary-light text-secondary rounded-full text-xs font-medium border border-secondary">
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex w-fit items-center gap-1.5
                        ${doc.status === DocumentStatus.FINAL
                          ? 'bg-emerald-50 text-status-final border-emerald-200'
                          : doc.status === DocumentStatus.READY_TO_PRINT
                            ? 'bg-blue-50 text-status-ready border-blue-200'
                            : 'bg-slate-100 text-status-draft border-slate-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full 
                          ${doc.status === DocumentStatus.FINAL ? 'bg-status-final'
                            : doc.status === DocumentStatus.READY_TO_PRINT ? 'bg-status-ready'
                              : 'bg-status-draft'}`}></span>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-text-secondary">
                      {new Date(doc.lastModified).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right text-neutral-text-secondary">
                      <button className="p-1 hover:bg-secondary-light rounded-full transition-colors" onClick={(e) => { e.stopPropagation(); /* Add menu logic */ }}>
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-text-secondary">
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={48} className="text-secondary-light" />
                      <p>Tidak ada dokumen yang ditemukan sesuai kriteria Anda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
