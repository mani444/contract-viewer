import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TextItem, TextContent, PageCallback } from "@/types/pdf";
import type { DocumentPreviewProps } from "@/types/pdf";
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

// Add custom CSS for highlighting
const highlightCSS = `
  .pdf-highlight {
    background-color: rgba(255, 255, 0, 0.4) !important;
    border: 2px solid #fbbf24 !important;
    border-radius: 2px !important;
    animation: pulse 2s infinite !important;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

// Inject CSS into the document
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = highlightCSS;
  document.head.appendChild(style);
}

export function DocumentPreview({
  contract,
  highlightedClause,
  pdfFile,
}: DocumentPreviewProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale] = useState<number>(1.0); // Fixed at 100%
  const [loadError, setLoadError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    console.log("PDF loaded successfully, pages:", numPages);
    setNumPages(numPages);
    setLoadError(null);
  }

  function onDocumentLoadError(error: Error): void {
    console.error("PDF load error:", error);
    setLoadError(error.message);
  }

  // Extract text content when page loads
  const onPageLoadSuccess = (page: PageCallback) => {
    page
      .getTextContent()
      .then((content: TextContent) => {
        const text = content.items
          .filter((item): item is TextItem => "str" in item)
          .map((item: TextItem) => item.str)
          .join(" ");
        console.log("Extracted text:", text.substring(0, 200) + "...");
      })
      .catch((error: Error) => {
        console.error("Failed to extract text:", error);
      });
  };

  // Use CSS to highlight text in the PDF text layer
  useEffect(() => {
    // Get the text to search for based on highlighted clause
    const getSearchText = () => {
      if (!highlightedClause) return "";

      const clauseIndexMatch = highlightedClause.match(/^clause-(\d+)$/);
      if (!clauseIndexMatch) return "";

      const clauseIndex = parseInt(clauseIndexMatch[1], 10);
      const clause = contract.clauses[clauseIndex];

      if (!clause) return "";

      // Return clause number and title for search
      if (clause.number && clause.title) {
        return `${clause.number}. ${clause.title}`;
      }
      if (clause.title) {
        return clause.title;
      }
      if (clause.number) {
        return `${clause.number}.`;
      }
      return "";
    };

    const searchText = getSearchText();
    if (!searchText) {
      // Remove all highlights
      const highlights = document.querySelectorAll(".pdf-highlight");
      highlights.forEach((el) => el.classList.remove("pdf-highlight"));
      return;
    }

    // Add highlights to matching text
    setTimeout(() => {
      const textLayer = document.querySelector(".react-pdf__Page__textContent");
      if (textLayer) {
        const textSpans = textLayer.querySelectorAll("span");
        textSpans.forEach((span) => {
          const spanText = span.textContent || "";
          if (
            spanText.includes(searchText) ||
            searchText.includes(spanText.trim()) ||
            (spanText.trim().length > 2 &&
              searchText.toLowerCase().includes(spanText.toLowerCase().trim()))
          ) {
            span.classList.add("pdf-highlight");
          } else {
            span.classList.remove("pdf-highlight");
          }
        });
      }
    }, 100);
  }, [highlightedClause, pageNumber, contract]);

  // Auto-scroll to page when clause is selected
  const scrollToClause = () => {
    setPageNumber(1);
  };

  // Effect to scroll when highlighted clause changes
  React.useEffect(() => {
    if (highlightedClause) {
      scrollToClause();
    }
  }, [highlightedClause]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">PDF Document Viewer</CardTitle>
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
                        onLoadSuccess={onPageLoadSuccess}
                        loading={
                          <div className="flex items-center justify-center h-96">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          </div>
                        }
                      />
                    </Document>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-lg font-medium">Loading Sample PDF</p>
                  <p className="text-sm">
                    Please wait while the contract document loads...
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
