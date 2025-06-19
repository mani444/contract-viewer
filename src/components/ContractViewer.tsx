import { useState, useEffect } from "react";
import { DocumentPreview } from "./DocumentPreview";
import { ClausesList } from "./ClausesList";
import { Contract } from "@/types/contract";

interface ContractViewerProps {
  contract: Contract;
}

export function ContractViewer({ contract }: ContractViewerProps) {
  const [highlightedClause, setHighlightedClause] = useState<string | undefined>(undefined);
  const [pdfFile, setPdfFile] = useState<ArrayBuffer | null>(null);

  // Auto-load sample PDF on component mount
  useEffect(() => {
    const loadSamplePdf = async () => {
      console.log('Auto-loading sample PDF...');
      try {
        const response = await fetch('/sample-contract.pdf');
        console.log('Fetch response:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`Sample PDF not found: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        console.log('Sample PDF loaded, size:', arrayBuffer.byteLength);
        setPdfFile(arrayBuffer);
      } catch (error) {
        console.error('Failed to load sample PDF:', error);
      }
    };

    loadSamplePdf();
  }, []);

  const handleClauseClick = (clauseId: string) => {
    setHighlightedClause(prev => prev === clauseId ? undefined : clauseId);
  };

  const handleTextSelect = (text: string) => {
    // Find matching clause based on text selection using consistent index-based system
    const matchingClauseIndex = contract.clauses.findIndex(clause => 
      clause.content?.includes(text) || 
      clause.title?.includes(text) ||
      text.includes(clause.title || '') ||
      text.includes(clause.number || '')
    );

    if (matchingClauseIndex !== -1) {
      const clauseId = `clause-${matchingClauseIndex}`;
      setHighlightedClause(clauseId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {contract.document_title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Effective Date: {contract.effective_date} • {contract.parties.length} parties • {contract.clauses.length} clauses
          </p>
        </div>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Side - Document Preview */}
          <div className="order-2 lg:order-1">
            <DocumentPreview 
              contract={contract}
              highlightedClause={highlightedClause}
              onTextSelect={handleTextSelect}
              pdfFile={pdfFile}
            />
          </div>

          {/* Right Side - Clauses List */}
          <div className="order-1 lg:order-2">
            <ClausesList 
              contract={contract}
              onClauseClick={handleClauseClick}
              highlightedClause={highlightedClause}
            />
          </div>
        </div>
      </div>
    </div>
  );
}