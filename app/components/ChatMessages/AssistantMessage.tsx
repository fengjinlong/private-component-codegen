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
      <div className="flex mb-4 rounded-xl px-2 py-6 gap-2">
        <Avatar className="!bg-indigo-500" size={32}>
          Bot
        </Avatar>

        <div className="flex flex-1 items-center rounded-xl overflow-auto">
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
