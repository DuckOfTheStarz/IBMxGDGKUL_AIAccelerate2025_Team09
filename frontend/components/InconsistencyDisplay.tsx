"use client";

import React, { useState } from 'react';
import { AlertTriangle, Calendar, Hash, DollarSign, Percent, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Inconsistency, DocumentAnalysis } from '@/types/document';

interface InconsistencyDisplayProps {
  analysis: DocumentAnalysis | null;
}

const getIconForType = (type: string) => {
  switch (type) {
    case 'date':
      return <Calendar className="w-4 h-4" />;
    case 'number':
      return <Hash className="w-4 h-4" />;
    case 'currency':
      return <DollarSign className="w-4 h-4" />;
    case 'percentage':
      return <Percent className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'warning';
    case 'low':
      return 'secondary';
    default:
      return 'outline';
  }
};

function InconsistencyCard({ inconsistency }: { inconsistency: Inconsistency }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div 
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1">
            {getIconForType(inconsistency.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={getSeverityColor(inconsistency.severity) as any}>
                {inconsistency.severity.toUpperCase()}
              </Badge>
              <Badge variant="outline">
                {inconsistency.type.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              {inconsistency.description}
            </p>
            <p className="text-xs text-gray-500">
              Paragraphs: {inconsistency.location.paragraphNumbers.join(', ')}
            </p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t space-y-3">
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Detected Values:</h4>
            <div className="space-y-2">
              {Object.entries(inconsistency.values).map(([doc, value]) => (
                <div key={doc} className="flex items-start gap-2 text-sm">
                  <span className="font-medium text-gray-600 min-w-[80px]">{doc}:</span>
                  <span className="text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {inconsistency.context && (
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Context:</h4>
              <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                {inconsistency.context}
              </p>
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Affected Documents:</h4>
            <div className="flex flex-wrap gap-1">
              {inconsistency.location.documents.map((doc, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {doc}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InconsistencyDisplay({ analysis }: InconsistencyDisplayProps) {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  if (!analysis) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>
            Upload and analyze documents to see inconsistencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertTriangle className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500">No analysis results yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Upload documents above to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredInconsistencies = analysis.inconsistencies.filter(
    inc => filter === 'all' || inc.severity === filter
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Found {analysis.totalInconsistencies} inconsistencies across {analysis.documents.length} documents
            </CardDescription>
          </div>
          <div className="text-right text-sm text-gray-500">
            Analyzed: {new Date(analysis.analyzedAt).toLocaleString()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-600 font-medium">High Severity</p>
                <p className="text-2xl font-bold text-red-700">{analysis.summary.high}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-yellow-600 font-medium">Medium Severity</p>
                <p className="text-2xl font-bold text-yellow-700">{analysis.summary.medium}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium">Low Severity</p>
                <p className="text-2xl font-bold text-gray-700">{analysis.summary.low}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Documents Analyzed */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Documents Analyzed:</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.documents.map((doc, idx) => (
              <Badge key={idx} variant="outline" className="text-sm">
                {doc.name} ({doc.language})
              </Badge>
            ))}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({analysis.totalInconsistencies})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'high'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            High ({analysis.summary.high})
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'medium'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Medium ({analysis.summary.medium})
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'low'
                ? 'bg-gray-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Low ({analysis.summary.low})
          </button>
        </div>

        {/* Inconsistency List */}
        <div className="space-y-3">
          {filteredInconsistencies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No inconsistencies found in this category
            </div>
          ) : (
            filteredInconsistencies.map((inconsistency) => (
              <InconsistencyCard key={inconsistency.id} inconsistency={inconsistency} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

