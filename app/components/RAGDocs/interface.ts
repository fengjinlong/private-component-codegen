interface RAGDoc {
  id: string;
  content: string;
}

interface RAGDocsProps {
  /**
   * RAG文档数据数组
   */
  docs: RAGDoc[];
  /**
   * 文本展开时的行数，默认为3
   */
  expandRows?: number;
}

export type { RAGDocsProps, RAGDoc };
