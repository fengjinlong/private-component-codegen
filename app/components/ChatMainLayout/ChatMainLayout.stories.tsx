import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ChatMainLayout from './ChatMainLayout';
import { ChatMessages, ChatMessagesProps } from '../ChatMessages';
import { Default as ChatMessagesDefault } from '../ChatMessages/ChatMessages.stories';

const meta: Meta<typeof ChatMainLayout> = {
  title: 'Components/ChatMainLayout',
  component: ChatMainLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
};

export default meta;
type Story = StoryObj<typeof ChatMainLayout>;

// 创建一个包装组件来处理状态
const ChatMainLayoutWithState = () => {
  const [selectedModel, setSelectedModel] = useState('OpenAI SDK');

  return (
    <ChatMainLayout
      mainContent={
        <ChatMessages {...(ChatMessagesDefault.args as ChatMessagesProps)} isLoading={true} />
      }
      selectedModel={selectedModel}
      onModelChange={setSelectedModel}
    />
  );
};

export const Default: Story = {
  render: () => <ChatMainLayoutWithState />
};
