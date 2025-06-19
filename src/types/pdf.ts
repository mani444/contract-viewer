import type { Contract } from "./contract";

// Type definitions for PDF.js text content
export interface TextItem {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
}

export interface TextContent {
  items: (TextItem | { type: string })[];
  styles: Record<string, unknown>;
}

export interface PageCallback {
  getTextContent(): Promise<TextContent>;
}

export interface DocumentPreviewProps {
  contract: Contract;
  highlightedClause?: string;
  onTextSelect?: (text: string) => void;
  pdfFile?: string | ArrayBuffer | null;
}
