export enum DocumentStatus {
  DRAFT = 'Draf',
  FINAL = 'Final',
  READY_TO_PRINT = 'Siap Cetak'
}

export enum DocumentType {
  TEACHING_MODULE = 'Modul Ajar',
  ACTIVITY_REPORT = 'Laporan Kegiatan',
  REFLECTION_SHEET = 'Lembar Refleksi',
  LESSON_PLAN = 'Rencana Pembelajaran (RPP)'
}

export interface DocContent {
  outcomes: string;
  objectives: string;
  activities: string;
  assessments: string;
}

export interface AcademicDocument {
  id: string;
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  lastModified: string; // ISO date string
  classGrade?: string;
  semester?: string;
  curriculumCategory?: string;
  content: DocContent;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  type: DocumentType;
  isVerified: boolean; // "Batam Curriculum Standard"
  thumbnailUrl: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  EDITOR = 'EDITOR',
  PREVIEW = 'PREVIEW',
  TEMPLATES = 'TEMPLATES'
}
