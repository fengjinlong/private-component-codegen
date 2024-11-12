import React, { memo } from 'react';
import { Avatar, Button, Badge } from 'antd';
import { CopyOutlined, FileOutlined, RedoOutlined } from '@ant-design/icons';
import { Markdown } from '../Markdown';
import { isEqual } from 'lodash';

interface AssistantMessageProps {
  message: string;
  isLoading: boolean;
}

const AssistantMessage: React.FC<AssistantMessageProps> = memo(
  ({ message, isLoading }) => {
    return (
      <div className="flex mb-4 rounded-xl px-2 py-6 gap-2">
        <Avatar className="!bg-indigo-500" size={32}>
          Bot
        </Avatar>

        <div className="flex flex-col flex-1 items-start gap-4">
          {typeof message === 'string' ? (
            <div className="w-full">
              <Markdown source={message} isChatting={isLoading} isStream></Markdown>
            </div>
          ) : (
            message
          )}
          <div className="flex items-center gap-2">
            <Badge dot color="green">
              <Button size="small" type="default" icon={<FileOutlined />}>
                RAG Docs
              </Button>
            </Badge>
            <Button size="small" type="default" icon={<CopyOutlined />}>
              Copy
            </Button>
            <Button size="small" type="default" icon={<RedoOutlined />}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isLoading === nextProps.isLoading && isEqual(prevProps.message, nextProps.message)
    );
  }
);

AssistantMessage.displayName = 'AssistantMessage';

export default AssistantMessage;
