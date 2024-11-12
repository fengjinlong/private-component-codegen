interface RAGDocument {
  id: string;
  title: string;
  content: string;
  score?: number;
  metadata?: Record<string, string>;
}

interface RAGDocsShowProps {
  documents: RAGDocument[];
  loading?: boolean;
  onDocumentClick?: (doc: RAGDocument) => void;
}

export type { RAGDocsShowProps, RAGDocument };
