import React from 'react';
import { Typography } from 'antd';
import type { RAGDocsProps } from './interface';

const { Paragraph } = Typography;

const RAGDocs: React.FC<RAGDocsProps> = ({ docs, expandRows = 3 }) => {
  return (
    <div className="space-y-4">
      {docs.map((doc) => (
        <div key={doc.id} className="p-4 bg-gray-50 rounded-lg">
          <Paragraph
            ellipsis={{
              rows: expandRows,
              expandable: true,
              symbol: '展开'
            }}
          >
            {doc.content}
          </Paragraph>
        </div>
      ))}
    </div>
  );
};

export default RAGDocs;
