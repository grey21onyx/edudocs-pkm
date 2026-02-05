export enum DocumentStatus {
  DRAFT = 'Draft',
  FINAL = 'Final',
  READY_TO_PRINT = 'Ready to Print'
}

export enum DocumentType {
  TEACHING_MODULE = 'Teaching Module',
  ACTIVITY_REPORT = 'Activity Report',
  REFLECTION_SHEET = 'Reflection Sheet',
  LESSON_PLAN = 'Lesson Plan'
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
