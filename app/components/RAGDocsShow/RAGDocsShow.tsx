import React from 'react';
import { List, Card, Typography } from 'antd';
import type { RAGDocsShowProps } from './interface';

const { Text, Paragraph } = Typography;

const RAGDocsShow: React.FC<RAGDocsShowProps> = ({
  documents,
  loading = false,
  onDocumentClick
}) => {
  return (
    <List
      className="w-full"
      loading={loading}
      dataSource={documents}
      renderItem={(doc) => (
        <List.Item key={doc.id}>
          <Card
            className="w-full cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onDocumentClick?.(doc)}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Text strong className="text-lg">
                  {doc.title}
                </Text>
                {doc.score && (
                  <Text type="secondary" className="text-sm">
                    相关度: {(doc.score * 100).toFixed(2)}%
                  </Text>
                )}
              </div>
              <Paragraph className="text-gray-600 mb-0" ellipsis={{ rows: 3 }}>
                {doc.content}
              </Paragraph>
              {doc.metadata && Object.keys(doc.metadata).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(doc.metadata).map(([key, value]) => (
                    <Text key={key} type="secondary" className="text-xs">
                      {key}: {value}
                    </Text>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default RAGDocsShow;
