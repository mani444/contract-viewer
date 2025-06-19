import { useState, useEffect } from "react";
import { DocumentPreview } from "./DocumentPreview";
import { ClausesList } from "./ClausesList";
import { ContractHeader } from "./ContractHeader";
// import { LoadingOverlay } from "./LoadingOverlay";
import { Layout, TwoColumnLayout, MainContent, Sidebar } from "./Layout";
import type { ContractViewerProps } from "@/types";

export function ContractViewer({ contract }: ContractViewerProps) {
  const [highlightedClause, setHighlightedClause] = useState<
    string | undefined
  >(undefined);
  const [pdfFile, setPdfFile] = useState<ArrayBuffer | null>(null);

  // Auto-load sample PDF on component mount
  useEffect(() => {
    const loadSamplePdf = async () => {
      console.log("Auto-loading sample PDF...");
      try {
        const response = await fetch("/sample-contract.pdf");
        console.log("Fetch response:", response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`Sample PDF not found: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        console.log("Sample PDF loaded, size:", arrayBuffer.byteLength);
        setPdfFile(arrayBuffer);
      } catch (error) {
        console.error("Failed to load sample PDF:", error);
      }
    };

    loadSamplePdf();
  }, []);

  const handleClauseClick = (clauseId: string) => {
    setHighlightedClause((prev) => (prev === clauseId ? undefined : clauseId));
  };

  const handleTextSelect = (text: string) => {
    // Find matching clause based on text selection using consistent index-based system
    const matchingClauseIndex = contract.clauses.findIndex(
      (clause) =>
        clause.content?.includes(text) ||
        clause.title?.includes(text) ||
        text.includes(clause.title || "") ||
        text.includes(clause.number || ""),
    );

    if (matchingClauseIndex !== -1) {
      const clauseId = `clause-${matchingClauseIndex}`;
      setHighlightedClause(clauseId);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <ContractHeader contract={contract} />

      {/* Split Screen Layout */}
      <TwoColumnLayout>
        {/* Left Side - Document Preview */}
        <MainContent>
          <DocumentPreview
            contract={contract}
            highlightedClause={highlightedClause}
            onTextSelect={handleTextSelect}
            pdfFile={pdfFile}
          />
        </MainContent>

        {/* Right Side - Clauses List */}
        <Sidebar>
          <ClausesList
            contract={contract}
            onClauseClick={handleClauseClick}
            highlightedClause={highlightedClause}
          />
        </Sidebar>
      </TwoColumnLayout>
    </Layout>
  );
}
