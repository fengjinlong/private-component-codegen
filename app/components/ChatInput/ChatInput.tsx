import React, { memo } from 'react';
import { Input, Space, Button, Divider, message } from 'antd';
import { ChatInputProps } from './interface';
import { useClassName } from './styles';
import { isEmpty, isEqual } from 'lodash';
import { InteractiveTagList } from '../InteractiveTagList';
import { SendOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const ChatInput: React.FC<ChatInputProps> = memo(
  ({ value, onChange, actions, onSubmit, loading, handleInputChange, minRows, prompts }) => {
    const className = useClassName({ loading: !!loading, notActions: isEmpty(actions) });
    return (
      <>
        {isEmpty(prompts) ? null : (
          <div className="w-full">
            <InteractiveTagList
              onTagClick={(tag) => {
                onChange?.(tag, { immediately: true });
              }}
              tags={prompts!}
            />
          </div>
        )}
        <div className={className}>
          <TextArea
            size="large"
            value={value}
            onChange={(event) => {
              onChange?.(event.target.value);
              handleInputChange?.(event);
            }}
            placeholder="Type a message..."
            autoSize={{ minRows: minRows ?? 2, maxRows: 6 }}
          />
          <div className="action-wrapper">
            <Space size="small">
              {actions.map((action, index) => (
                <React.Fragment key={index}>
                  {action}
                  {index < actions.length - 1 && <Divider type="vertical" />}
                </React.Fragment>
              ))}
            </Space>
          </div>
          <Button
            loading={loading}
            className={`generate-btn ${
              loading && 'animate-bounce'
            } bg-gradient-to-r from-indigo-500 to-purple-500`}
            type="primary"
            shape="circle"
            size="large"
            onClick={() => {
              if (!value) {
                message.warning('Please input your message');
                return;
              }
              onSubmit();
            }}
            icon={<SendOutlined />}
          />
        </div>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.value === nextProps.value &&
      prevProps.loading === nextProps.loading &&
      isEqual(prevProps.actions, nextProps.actions) &&
      isEqual(prevProps.prompts, nextProps.prompts)
    );
  }
);

ChatInput.displayName = 'ChatInput';

export default ChatInput;
