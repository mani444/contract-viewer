import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Contract } from "@/types/contract";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

// Configure PDF.js worker - try multiple approaches for compatibility
try {
  // Primary approach: Use CDN
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
} catch (error) {
  console.warn("Failed to set PDF worker from CDN, trying fallback:", error);
  try {
    // Fallback approach: Use local worker if available
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
  } catch (fallbackError) {
    console.error("Failed to configure PDF worker:", fallbackError);
  }
}

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

interface DocumentPreviewProps {
  contract: Contract;
  highlightedClause?: string;
  onTextSelect?: (text: string) => void;
  pdfFile?: string | ArrayBuffer | null;
}

// Define highlight zones for each clause (dummy coordinates for demonstration)
const getHighlightZones = (clauseIndex: number) => {
  const zones: {
    [key: string]: {
      page: number;
      x: number;
      y: number;
      width: number;
      height: number;
    }[];
  } = {
    "clause-0": [{ page: 1, x: 50, y: 200, width: 400, height: 60 }], // Scope of Services
    "clause-1": [{ page: 1, x: 50, y: 300, width: 400, height: 80 }], // Term
    "clause-2": [{ page: 1, x: 50, y: 420, width: 400, height: 60 }], // Compensation
    "clause-3": [{ page: 1, x: 50, y: 520, width: 400, height: 80 }], // Confidentiality
    "clause-4": [{ page: 1, x: 50, y: 640, width: 400, height: 40 }], // Termination
    "clause-5": [{ page: 2, x: 50, y: 100, width: 400, height: 60 }], // Governing Law
    "clause-6": [{ page: 2, x: 50, y: 200, width: 400, height: 60 }], // Entire Agreement
  };

  return zones[`clause-${clauseIndex}`] || [];
};

export function DocumentPreview({
  contract,
  highlightedClause,
  pdfFile,
}: DocumentPreviewProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [loadError, setLoadError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    console.log("PDF loaded successfully, pages:", numPages);
    setNumPages(numPages);
    setLoadError(null);
  }

  function onDocumentLoadError(error: Error): void {
    console.error("PDF load error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    setLoadError(error.message);
  }

  // Get highlight zones for the current highlighted clause
  const getActiveHighlightZones = () => {
    if (!highlightedClause) return [];

    const clauseIndexMatch = highlightedClause.match(/^clause-(\d+)$/);
    if (!clauseIndexMatch) return [];

    const clauseIndex = parseInt(clauseIndexMatch[1], 10);
    return getHighlightZones(clauseIndex);
  };

  // Auto-scroll to page when clause is selected
  const scrollToClause = (clauseId: string) => {
    const clauseIndexMatch = clauseId.match(/^clause-(\d+)$/);
    if (!clauseIndexMatch) return;

    const clauseIndex = parseInt(clauseIndexMatch[1], 10);
    const zones = getHighlightZones(clauseIndex);

    if (zones.length > 0) {
      setPageNumber(zones[0].page);
    }
  };

  // Effect to scroll when highlighted clause changes
  React.useEffect(() => {
    if (highlightedClause) {
      scrollToClause(highlightedClause);
    }
  }, [highlightedClause]);

  const highlightZones = getActiveHighlightZones();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          PDF Document Viewer
          <div className="flex items-center gap-2 text-sm font-normal">
            <button
              onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              -
            </button>
            <span className="min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((prev) => Math.min(3, prev + 0.1))}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              +
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[calc(100vh-200px)] flex flex-col">
          {/* PDF Controls */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                disabled={pageNumber <= 1}
                className="p-2 rounded bg-gray-100 dark:bg-gray-800 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm">
                Page {pageNumber} of {numPages || "..."}
              </span>
              <button
                onClick={() =>
                  setPageNumber((prev) => Math.min(numPages || 1, prev + 1))
                }
                disabled={pageNumber >= (numPages || 1)}
                className="p-2 rounded bg-gray-100 dark:bg-gray-800 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {highlightedClause && (
              <div className="text-xs bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded">
                Highlighting:{" "}
                {contract.clauses[parseInt(highlightedClause.split("-")[1])]
                  ?.title || "Clause"}
              </div>
            )}
          </div>

          {/* PDF Viewer */}
          <ScrollArea className="flex-1">
            <div className="flex justify-center p-4 relative">
              {pdfFile ? (
                loadError ? (
                  <div className="flex flex-col items-center justify-center h-96 text-red-500">
                    <Download className="w-16 h-16 mb-4" />
                    <p className="text-lg font-medium">Failed to load PDF</p>
                    <p className="text-sm text-center max-w-md">{loadError}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Try uploading a different PDF file
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <Document
                      file={pdfFile}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={onDocumentLoadError}
                      className="border border-gray-300 dark:border-gray-600 shadow-lg"
                      loading={
                        <div className="flex items-center justify-center h-96">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                      }
                    >
                      <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        loading={
                          <div className="flex items-center justify-center h-96">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          </div>
                        }
                      />
                    </Document>

                    {/* Highlight Overlays */}
                    {highlightZones.map(
                      (zone, index) =>
                        zone.page === pageNumber && (
                          <div
                            key={index}
                            className="absolute bg-yellow-300/40 border-2 border-yellow-500 pointer-events-none animate-pulse"
                            style={{
                              left: zone.x * scale,
                              top: zone.y * scale,
                              width: zone.width * scale,
                              height: zone.height * scale,
                            }}
                          />
                        ),
                    )}
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 dark:text-gray-400">
                  <Download className="w-16 h-16 mb-4" />
                  <p className="text-lg font-medium">No PDF Loaded</p>
                  <p className="text-sm">
                    Upload a PDF file to view and highlight clauses
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
