import type { Contract } from "./contract";

// Re-export commonly used types
export type { Contract, Clause } from "./contract";

// Component Props Interfaces
export interface ContractViewerProps {
  contract: Contract;
}

export interface ClausesListProps {
  contract: Contract;
  onClauseClick: (clauseId: string) => void;
  highlightedClause?: string;
}

export interface PdfUploaderProps {
  onFileSelect: (file: ArrayBuffer) => void;
  onLoadSample?: () => void;
  className?: string;
}
