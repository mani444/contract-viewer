export interface Party {
  name: string;
  role: string;
}

export interface Clause {
  number?: string;
  title?: string;
  content?: string;
}

export interface Contract {
  document_title: string;
  effective_date: string;
  parties: Party[];
  clauses: Clause[];
}

export interface HighlightRef {
  clauseId: string;
  highlighted: boolean;
}