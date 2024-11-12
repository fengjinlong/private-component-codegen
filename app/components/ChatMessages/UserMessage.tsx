import React, { memo } from 'react';
import { Avatar } from 'antd';
import { isArray, isEqual } from 'lodash';
import { Markdown } from '../Markdown';

interface MessageContent {
  type: 'image_url' | 'text';
  image_url?: {
    url: string;
  };
  text?: string;
}

interface UserMessageProps {
  message: string | MessageContent[];
}

const UserMessage: React.FC<UserMessageProps> = memo(
  ({ message }) => {
    return (
      <div className="flex flex-row px-2 py-4 mb-4 gap-2">
        <Avatar className="!bg-purple-500" size={32}>
          You
        </Avatar>
        <div className="flex flex-1">
          {typeof message === 'string' ? (
            <Markdown source={message}></Markdown>
          ) : isArray(message) ? (
            <React.Fragment>
              {message.map((content, index) => {
                if (content.type === 'image_url') {
                  return (
                    <div key={index}>
                      <img
                        className="w-60 rounded-lg"
                        src={content.image_url!.url}
                        alt="assistant"
                      />
                    </div>
                  );
                }
                return <Markdown key={index} source={content.text!}></Markdown>;
              })}
            </React.Fragment>
          ) : (
            message
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps.message, nextProps.message);
  }
);

UserMessage.displayName = 'UserMessage';

export default UserMessage;
