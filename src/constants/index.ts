// App-wide constants
export const APP_CONFIG = {
  PDF: {
    SAMPLE_PATH: "/sample-contract.pdf",
    SCALE: {
      DEFAULT: 1.0,
      MIN: 0.5,
      MAX: 3.0,
    },
    HIGHLIGHT_TIMEOUT: 100,
  },
  UI: {
    VIEWPORT_HEIGHT: "calc(100vh - 200px)",
    ANIMATION: {
      PULSE_DURATION: "2s",
    },
  },
  SEARCH: {
    MIN_TEXT_LENGTH: 2,
  },
} as const;

export const CSS_SELECTORS = {
  PDF_TEXT_LAYER: ".react-pdf__Page__textContent",
  PDF_HIGHLIGHT: "pdf-highlight",
} as const;

export const MESSAGES = {
  PDF: {
    LOADING: "Loading Sample PDF",
    LOADING_DESCRIPTION: "Please wait while the contract document loads...",
    FAILED_TO_LOAD: "Failed to load PDF",
    FAILED_TO_LOAD_DESCRIPTION: "Try uploading a different PDF file",
    NO_PDF: "No PDF Loaded",
    NO_PDF_DESCRIPTION: "Upload a PDF file to view and highlight clauses",
  },
  ERRORS: {
    SAMPLE_PDF_NOT_FOUND: "Sample PDF not found",
    FAILED_TO_EXTRACT_TEXT: "Failed to extract text content",
    PDF_WORKER_FALLBACK: "Failed to set PDF worker from CDN, trying fallback",
    PDF_WORKER_ERROR: "Failed to configure PDF worker",
  },
} as const;
