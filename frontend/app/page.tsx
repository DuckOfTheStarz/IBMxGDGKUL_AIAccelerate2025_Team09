"use client";

import { useState } from "react";
import { FileCheck2, Sparkles } from "lucide-react";
import DocumentUploader from "@/components/DocumentUploader";
import InconsistencyDisplay from "@/components/InconsistencyDisplay";
import { DocumentAnalysis } from "@/types/document";

export default function Home() {
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (files: File[]) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze documents');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (err) {
      console.error('Error analyzing documents:', err);
      setError('Failed to analyze documents. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="https://logos-world.net/wp-content/uploads/2024/07/European-Union-Logo.jpg" alt="European Union Logo" width={150} height={150} />
              <div>
                <h1 className="text-2xl font-bold text-blue-800 pl-4">
                  EuroVeritas
                </h1>
                <p className="text-sm text-gray-600 pl-4">
                  AI-powered multilingual document consistency verification
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Powered by IBM watsonx.ai</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Info Section */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              How to use the comparison tool
            </h2>
            <p className="text-gray-600 mb-4">
              Upload the two versions of the same document in different languages. <br />
              Our AI model will analyze and detect factual inconsistencies between the two documents.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Upload Documents</h3>
                  <p className="text-sm text-gray-600">
                    Upload 2 document versions in JSON format
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">AI Analysis</h3>
                  <p className="text-sm text-gray-600">
                    Advanced algorithms detect inconsistencies automatically
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Review Results</h3>
                  <p className="text-sm text-gray-600">
                    Get a detailed report of factual inconsistencies between the two documents
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Upload Section */}
          <DocumentUploader onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
          

          {/* Analysis Results */}
          <InconsistencyDisplay analysis={analysis} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
          <img src="https://www.freepnglogos.com/uploads/ibm-logo-png/ibm-logo-acm-icpc-kanpur-site-0.png" alt="IBM Logo" className="w-24" />
          <img src="https://www.kuleuven.be/aepz/afbeeldingen/logos/ku-leuven-logo.png/@@download/image/KU-Leuven-logo.png" alt="KU Leuven Logo" className="w-24" />
            <p>
              Implemented by Domen Beden, John Bounds, Imane Guesmia, Maximilian Mangosi 
            </p>
            <p>
              Built with Next.js and IBM watsonx.ai
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
