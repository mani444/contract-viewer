import React, { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';

interface PdfUploaderProps {
  onFileSelect: (file: ArrayBuffer) => void;
  onLoadSample?: () => void;
  className?: string;
}

export function PdfUploader({ onFileSelect, onLoadSample, className = "" }: PdfUploaderProps) {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('File selected:', file);
    
    if (!file) {
      console.log('No file selected');
      return;
    }
    
    if (file.type !== 'application/pdf') {
      console.log('Invalid file type:', file.type);
      alert('Please select a PDF file');
      return;
    }
    
    console.log('Reading PDF file:', file.name, file.size, 'bytes');
    const reader = new FileReader();
    
    reader.onload = (e) => {
      console.log('File read complete');
      if (e.target?.result instanceof ArrayBuffer) {
        console.log('ArrayBuffer size:', e.target.result.byteLength);
        onFileSelect(e.target.result);
      }
    };
    
    reader.onerror = (e) => {
      console.error('Error reading file:', e);
      alert('Error reading PDF file');
    };
    
    reader.readAsArrayBuffer(file);
  }, [onFileSelect]);

  return (
    <div className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 ${className}`}>
      <div className="text-center">
        <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Upload PDF Contract
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Select a PDF file to view and highlight clauses
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Upload PDF
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {onLoadSample && (
            <button
              onClick={onLoadSample}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Load Sample PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}