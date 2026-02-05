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
  const [filterType, setFilterType] = useState<string>('All');

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: documents.length,
    drafts: documents.filter(d => d.status === DocumentStatus.DRAFT).length,
    completed: documents.filter(d => d.status === DocumentStatus.FINAL || d.status === DocumentStatus.READY_TO_PRINT).length
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your academic documents and track progress.</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Create New Document
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Documents</p>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Drafts In Progress</p>
            <p className="text-2xl font-bold text-slate-800">{stats.drafts}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Completed & Ready</p>
            <p className="text-2xl font-bold text-slate-800">{stats.completed}</p>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                className="pl-9 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none bg-white"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All Types</option>
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
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                <th className="px-6 py-4">Document Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Modified</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr 
                    key={doc.id} 
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => onEditDocument(doc)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                          <File size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{doc.title}</p>
                          <p className="text-xs text-slate-500">{doc.classGrade || 'Class Not Set'} • {doc.semester || 'Semester Not Set'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex w-fit items-center gap-1.5
                        ${doc.status === DocumentStatus.FINAL || doc.status === DocumentStatus.READY_TO_PRINT
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${doc.status === DocumentStatus.FINAL ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(doc.lastModified).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-400">
                      <button className="p-1 hover:bg-slate-200 rounded-full transition-colors" onClick={(e) => { e.stopPropagation(); /* Add menu logic */ }}>
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={48} className="text-slate-200" />
                      <p>No documents found matching your criteria.</p>
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
