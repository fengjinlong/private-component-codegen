import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
  ChangeEvent
} from 'react';
import { Modal, Image } from 'antd';
import { ChatInput } from '../ChatInput';
import { TldrawEdit } from '../TldrawEdit';
import { ChatMessagesProps } from './interface';
import { useClassName } from './styles';
import { ToolInvocation } from 'ai';
import { isEmpty } from 'lodash';
import ConfirmCodegen from './ConfirmCodegen';
import { CloseCircleOutlined } from '@ant-design/icons';
import AssistantMessage from './AssistantMessage';
import UserMessage from './UserMessage';

const ChatMessages = forwardRef<{ scrollToBottom: () => void }, ChatMessagesProps>(
  (
    {
      visible,
      messages,
      input,
      handleInputChange,
      onSubmit,
      addToolResult,
      onCancel,
      isLoading,
      messageImgUrl,
      setMessagesImgUrl
    },
    ref
  ) => {
    const className = useClassName();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      scrollToBottom: () => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }));

    useEffect(() => {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        const lastMessage = messages?.[messages?.length - 1];
        const isUserOrAssistantWithTool =
          lastMessage?.role === 'user' ||
          (lastMessage?.role === 'assistant' &&
            !isEmpty(lastMessage?.toolInvocations) &&
            lastMessage?.toolInvocations?.[0]?.toolName === 'askForConfirmation');

        if (isUserOrAssistantWithTool) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
          return;
        }

        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        if (distanceFromBottom <= 100) {
          scrollContainer.scrollTop = scrollHeight;
        }
      }
    }, [messages]);

    return (
      <Modal
        title="Chat Messages"
        open={visible}
        onCancel={onCancel}
        width={800}
        style={{ top: 50 }}
        maskClosable={false}
        footer={null}
      >
        <div className={className}>
          <div className="flex flex-col rounded-md h-80vh">
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto rounded-xl p-4 text-sm leading-6 sm:leading-7"
            >
              {messages?.map((message, index) => {
                return (
                  <React.Fragment key={message.id}>
                    {message.role === 'user' ? (
                      <UserMessage message={message.content} />
                    ) : (
                      <React.Fragment>
                        {!isEmpty(message.content) && (
                          <AssistantMessage
                            message={message.content}
                            isLoading={isLoading && index === messages.length - 1}
                          />
                        )}
                        {!isEmpty(message.toolInvocations) && (
                          <AssistantMessage
                            message={message.toolInvocations?.map(
                              (toolInvocation: ToolInvocation) => {
                                const toolCallId = toolInvocation.toolCallId;

                                if (toolInvocation.toolName === 'askForConfirmation') {
                                  return (
                                    <div key={toolCallId}>
                                      {toolInvocation.args.message}
                                      <div>
                                        {'result' in toolInvocation ? (
                                          <b>{toolInvocation.result}</b>
                                        ) : (
                                          <ConfirmCodegen
                                            onNoClick={() =>
                                              addToolResult({
                                                toolCallId,
                                                result: 'No, denied'
                                              })
                                            }
                                            onYesClick={() =>
                                              addToolResult({
                                                toolCallId,
                                                result: 'Yes, confirmed.'
                                              })
                                            }
                                          />
                                        )}
                                      </div>
                                    </div>
                                  );
                                }

                                return 'result' in toolInvocation ? (
                                  <div key={toolCallId}>
                                    Tool call {`${toolInvocation.toolName}: `}
                                    {toolInvocation.result}
                                  </div>
                                ) : (
                                  <div key={toolCallId}>Calling {toolInvocation.toolName}...</div>
                                );
                              }
                            )}
                            isLoading={isLoading && index === messages.length - 1}
                          />
                        )}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          <ChatInput
            value={input}
            handleInputChange={(e) =>
              handleInputChange(e as unknown as ChangeEvent<HTMLInputElement>)
            }
            actions={useMemo(
              () => [
                <div className="flex items-center" key="draw a ui">
                  <TldrawEdit key="draw a ui" onSubmit={setMessagesImgUrl} />
                  {messageImgUrl && (
                    <span className="ml-3 relative">
                      <Image height={35} src={messageImgUrl} preview={true} />
                      <CloseCircleOutlined
                        className="absolute top-0 right-0 cursor-pointer bg-white rounded-full"
                        onClick={() => setMessagesImgUrl('')}
                      />
                    </span>
                  )}
                </div>
              ],
              [messageImgUrl, setMessagesImgUrl]
            )}
            onSubmit={() => {
              onSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
            }}
            loading={isLoading}
            minRows={1}
          />
        </div>
      </Modal>
    );
  }
);

ChatMessages.displayName = 'ChatMessages';

export default ChatMessages;
