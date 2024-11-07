import React, { ReactNode, memo } from 'react';
import { Avatar } from 'antd';
import { Markdown } from '../Markdown';
import { isEqual } from 'lodash';

interface AssistantMessageProps {
  message: string | ReactNode;
  isLoading: boolean;
}

const AssistantMessage: React.FC<AssistantMessageProps> = memo(
  ({ message, isLoading }) => {
    return (
      <div className="mb-4 flex rounded-xl bg-slate-50 px-2 py-6 sm:px-4">
        <Avatar>Bot</Avatar>

        <div className="flex items-center rounded-xl overflow-auto">
          {typeof message === 'string' ? (
            <div className="w-full">
              <Markdown source={message} isChatting={isLoading} isStream></Markdown>
            </div>
          ) : (
            message
          )}
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
