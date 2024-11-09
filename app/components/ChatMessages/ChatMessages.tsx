import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
  ChangeEvent
} from 'react';
import { Image } from 'antd';
import { ChatInput } from '../ChatInput';
import { TldrawEdit } from '../TldrawEdit';
import { ChatMessagesProps } from './interface';
import { ToolInvocation } from 'ai';
import { isEmpty } from 'lodash';
import ConfirmCodegen from './ConfirmCodegen';
import { CloseCircleOutlined } from '@ant-design/icons';
import AssistantMessage from './AssistantMessage';
import UserMessage from './UserMessage';

const ChatMessages = forwardRef<{ scrollToBottom: () => void }, ChatMessagesProps>(
  (
    {
      messages,
      input,
      handleInputChange,
      onSubmit,
      addToolResult,
      isLoading,
      messageImgUrl,
      setMessagesImgUrl
    },
    ref
  ) => {
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
      <div className="relative pb-28">
        <div className="flex flex-col rounded-md">
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto rounded-xl text-sm leading-6 sm:leading-7"
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
        <div className="fixed flex justify-center left-0 bottom-0 w-full bg-gradient-to-b from-transparent to-inherit">
          <div className="p-4 w-full max-w-[1058px]">
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
                      <div className="ml-3 relative h-6">
                        <Image className="!h-6 min-w-6" src={messageImgUrl} preview={true} />
                        <CloseCircleOutlined
                          className="absolute size-3 top-[-6px] right-[-6px] cursor-pointer text-white/80 rounded-full hover:text-red-500"
                          onClick={() => setMessagesImgUrl('')}
                        />
                      </div>
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
        </div>
      </div>
    );
  }
);

ChatMessages.displayName = 'ChatMessages';

export default ChatMessages;
