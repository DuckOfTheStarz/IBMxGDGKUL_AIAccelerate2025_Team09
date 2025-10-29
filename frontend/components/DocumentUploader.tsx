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
  onAnalyze: (files: File[], apiKey: string) => void;
  isAnalyzing?: boolean;
}

export default function DocumentUploader({ onAnalyze, isAnalyzing = false }: DocumentUploaderProps) {
  const [leftFile, setLeftFile] = useState<UploadedFile | null>(null);
  const [rightFile, setRightFile] = useState<UploadedFile | null>(null);
  const [dragActiveLeft, setDragActiveLeft] = useState(false);
  const [dragActiveRight, setDragActiveRight] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const isValidFile = (file: File) =>
    file.type === 'application/json' ||
    file.name.endsWith('.json');
    //file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    //file.name.endsWith('.docx');

  const makeUploadedFile = (file: File): UploadedFile => ({
    id: Math.random().toString(36).substring(7),
    file,
    language: detectLanguageFromFilename(file.name),
    status: 'uploaded',
  });

  const handleDrag = useCallback((e: React.DragEvent, side: 'left' | 'right') => {
    e.preventDefault();
    e.stopPropagation();
    const setFn = side === 'left' ? setDragActiveLeft : setDragActiveRight;
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setFn(true);
    } else if (e.type === 'dragleave') {
      setFn(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, side: 'left' | 'right') => {
    e.preventDefault();
    e.stopPropagation();
    if (side === 'left') setDragActiveLeft(false); else setDragActiveRight(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (isValidFile(file)) {
        const uploaded = makeUploadedFile(file);
        if (side === 'left') setLeftFile(uploaded); else setRightFile(uploaded);
      }
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, side: 'left' | 'right') => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (isValidFile(file)) {
        const uploaded = makeUploadedFile(file);
        if (side === 'left') setLeftFile(uploaded); else setRightFile(uploaded);
      }
    }
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

  const removeFile = (side: 'left' | 'right') => {
    if (side === 'left') setLeftFile(null); else setRightFile(null);
  };

  const updateLanguage = (side: 'left' | 'right', language: string) => {
    if (side === 'left' && leftFile) setLeftFile({ ...leftFile, language });
    if (side === 'right' && rightFile) setRightFile({ ...rightFile, language });
  };

  const handleAnalyze = () => {
    if (leftFile && rightFile) {
      onAnalyze([leftFile.file, rightFile.file], apiKey);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Documents</CardTitle>
        <CardDescription>
          Upload exactly two documents (one per container) to compare for inconsistencies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* WatsonX API Key Input */}
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="watsonx-api-key">IBM WatsonX API Key</label>
          <input
            type="password"
            id="watsonx-api-key"
            className="border rounded w-full px-3 py-2 mb-2"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="Paste your IBM WatsonX API Key here..."
            autoComplete="off"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left container */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
              dragActiveLeft ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={(e) => handleDrag(e, 'left')}
            onDragLeave={(e) => handleDrag(e, 'left')}
            onDragOver={(e) => handleDrag(e, 'left')}
            onDrop={(e) => handleDrop(e, 'left')}
          >
            {!leftFile ? (
              <>
                <input
                  type="file"
                  id="file-upload-left"
                  accept=".json,.docx,application/json,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => handleFileInput(e, 'left')}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload-left"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">Drop file here or click to upload</p>
                  <p className="text-sm text-gray-500">Supports JSON files</p>
                </label>
              </>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{leftFile.file.name}</p>
                    <p className="text-xs text-gray-500">{(leftFile.file.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={leftFile.language}
                      onChange={(e) => updateLanguage('left', e.target.value)}
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
                    {leftFile.status === 'uploaded' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeFile('left')} className="ml-2">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Right container */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
              dragActiveRight ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={(e) => handleDrag(e, 'right')}
            onDragLeave={(e) => handleDrag(e, 'right')}
            onDragOver={(e) => handleDrag(e, 'right')}
            onDrop={(e) => handleDrop(e, 'right')}
          >
            {!rightFile ? (
              <>
                <input
                  type="file"
                  id="file-upload-right"
                  accept=".json,.docx,application/json,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => handleFileInput(e, 'right')}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload-right"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">Drop file here or click to upload</p>
                  <p className="text-sm text-gray-500">Supports JSON and DOCX files</p>
                </label>
              </>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{rightFile.file.name}</p>
                    <p className="text-xs text-gray-500">{(rightFile.file.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={rightFile.language}
                      onChange={(e) => updateLanguage('right', e.target.value)}
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
                    {rightFile.status === 'uploaded' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeFile('right')} className="ml-2">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <p className="text-sm text-gray-600">
            {!leftFile && !rightFile ? 'No files selected yet' :
             (leftFile ? 1 : 0) + (rightFile ? 1 : 0) === 1 ? '1 file ready' : '2 files ready'}
          </p>
          <Button onClick={handleAnalyze} disabled={!leftFile || !rightFile || isAnalyzing} size="lg">
            {isAnalyzing ? 'Analyzing...' : 'Analyze Documents'}
          </Button>
        </div>

        {((leftFile ? 1 : 0) + (rightFile ? 1 : 0)) === 1 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">Please upload a file in both containers to compare.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

