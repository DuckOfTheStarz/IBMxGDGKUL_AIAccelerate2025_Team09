export interface Paragraph {
  para: string;
  para_number: number;
}

export interface ParsedDocument {
  file: string;
  para: Paragraph[];
  language?: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  language: string;
  data: ParsedDocument;
  uploadedAt: Date;
}

export type InconsistencyType = 'date' | 'number' | 'currency' | 'percentage' | 'text';

export interface Inconsistency {
  id: string;
  type: InconsistencyType;
  severity: 'high' | 'medium' | 'low';
  description: string;
  location: {
    documents: string[];
    paragraphNumbers: number[];
  };
  values: {
    [documentName: string]: string;
  };
  context?: string;
}

export interface DocumentAnalysis {
  documents: UploadedDocument[];
  inconsistencies: Inconsistency[];
  analyzedAt: Date;
  totalInconsistencies: number;
  summary: {
    high: number;
    medium: number;
    low: number;
  };
}

