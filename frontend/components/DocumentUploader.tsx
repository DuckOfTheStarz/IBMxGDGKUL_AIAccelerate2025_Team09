"use client";

import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UploadedFile {
  id: string;
  file: File;
  language: string;
  status: 'pending' | 'uploaded' | 'error';
}

interface DocumentUploaderProps {
  onAnalyze: (files: File[]) => void;
  isAnalyzing?: boolean;
}

export default function DocumentUploader({ onAnalyze, isAnalyzing = false }: DocumentUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(
      file => file.type === 'application/json' || 
              file.name.endsWith('.json') ||
              file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
              file.name.endsWith('.docx')
    );

    const uploadedFiles: UploadedFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      language: detectLanguageFromFilename(file.name),
      status: 'uploaded' as const,
    }));

    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const detectLanguageFromFilename = (filename: string): string => {
    const lower = filename.toLowerCase();
    if (lower.includes('_bg') || lower.includes('bulgarian')) return 'BG';
    if (lower.includes('_hr') || lower.includes('croatian')) return 'HR';
    if (lower.includes('_cs') || lower.includes('czech')) return 'CS';
    if (lower.includes('_da') || lower.includes('danish')) return 'DA';
    if (lower.includes('_nl') || lower.includes('dutch')) return 'NL';
    if (lower.includes('_en') || lower.includes('english')) return 'EN';
    if (lower.includes('_et') || lower.includes('estonian')) return 'ET';
    if (lower.includes('_fi') || lower.includes('finnish')) return 'FI';
    if (lower.includes('_fr') || lower.includes('french')) return 'FR';
    if (lower.includes('_de') || lower.includes('german') || lower.includes('deutsch')) return 'DE';
    if (lower.includes('_el') || lower.includes('greek')) return 'EL';
    if (lower.includes('_hu') || lower.includes('hungarian')) return 'HU';
    if (lower.includes('_ga') || lower.includes('irish')) return 'GA';
    if (lower.includes('_it') || lower.includes('italian')) return 'IT';
    if (lower.includes('_lv') || lower.includes('latvian')) return 'LV';
    if (lower.includes('_lt') || lower.includes('lithuanian')) return 'LT';
    if (lower.includes('_mt') || lower.includes('maltese')) return 'MT';
    if (lower.includes('_pl') || lower.includes('polish')) return 'PL';
    if (lower.includes('_pt') || lower.includes('portuguese')) return 'PT';
    if (lower.includes('_ro') || lower.includes('romanian')) return 'RO';
    if (lower.includes('_sk') || lower.includes('slovak')) return 'SK';
    if (lower.includes('_sl') || lower.includes('slovenian')) return 'SL';
    if (lower.includes('_es') || lower.includes('spanish')) return 'ES';
    if (lower.includes('_sv') || lower.includes('swedish')) return 'SV';
    return 'Unknown';
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateLanguage = (id: string, language: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, language } : f));
  };

  const handleAnalyze = () => {
    if (files.length > 0) {
      onAnalyze(files.map(f => f.file));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Documents</CardTitle>
        <CardDescription>
          Upload multiple versions of your document in different languages to detect inconsistencies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            multiple
            accept=".json,.docx,application/json,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileInput}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-gray-500">
              Supports JSON and DOCX files
            </p>
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Uploaded Files ({files.length})</h3>
            <div className="space-y-2">
              {files.map((uploadedFile) => (
                <div
                  key={uploadedFile.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(uploadedFile.file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={uploadedFile.language}
                        onChange={(e) => updateLanguage(uploadedFile.id, e.target.value)}
                        className="text-xs border rounded px-2 py-1 bg-white"
                      >
                        <option value="BG">BG</option>
                        <option value="HR">HR</option>
                        <option value="CS">CS</option>
                        <option value="DA">DA</option>
                        <option value="NL">NL</option>
                        <option value="EN">EN</option>
                        <option value="ET">ET</option>
                        <option value="FI">FI</option>
                        <option value="FR">FR</option>
                        <option value="DE">DE</option>
                        <option value="EL">EL</option>
                        <option value="HU">HU</option>
                        <option value="GA">GA</option>
                        <option value="IT">IT</option>
                        <option value="LV">LV</option>
                        <option value="LT">LT</option>
                        <option value="MT">MT</option>
                        <option value="PL">PL</option>
                        <option value="PT">PT</option>
                        <option value="RO">RO</option>
                        <option value="SK">SK</option>
                        <option value="SL">SL</option>
                        <option value="ES">ES</option>
                        <option value="SV">SV</option>
                        <option value="Unknown">Unknown</option>
                      </select>
                      {uploadedFile.status === 'uploaded' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadedFile.id)}
                    className="ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4">
          <p className="text-sm text-gray-600">
            {files.length === 0 ? 'No files uploaded yet' : 
             files.length === 1 ? '1 file ready' : 
             `${files.length} files ready`}
          </p>
          <Button
            onClick={handleAnalyze}
            disabled={files.length < 2 || isAnalyzing}
            size="lg"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Documents'}
          </Button>
        </div>

        {files.length === 1 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Please upload at least 2 documents to compare for inconsistencies.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

