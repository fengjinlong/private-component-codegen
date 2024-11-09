'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ChatMainLayout from './components/ChatMainLayout/ChatMainLayout';
import { Skeleton } from 'antd';

const ChatMessages = dynamic(() => import('./components/ChatMessages/ChatMessages'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col gap-4 p-4">
      <Skeleton active />
      <Skeleton active />
      <Skeleton active />
    </div>
  )
});

const Home = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'user',
      content: 'Hello, how are you?'
    },
    {
      id: '2',
      role: 'assistant',
      content: 'I am fine, thank you!'
    }
  ]);
  const [messageImgUrl, setMessageImgUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // 处理提交逻辑
    setIsLoading(false);
  };

  const handleCancel = () => {
    setIsLoading(false);
  };

  const handleModelChange = (model: string) => {
    // 处理模型变更逻辑
  };

  const handleToolResult = (result: any) => {
    // 处理工具结果逻辑
  };

  return (
    <ChatMainLayout
      mainContent={
        <ChatMessages
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          onSubmit={handleSubmit}
          addToolResult={handleToolResult}
          onCancel={handleCancel}
          isLoading={isLoading}
          messageImgUrl={messageImgUrl}
          setMessagesImgUrl={setMessageImgUrl}
        />
      }
      selectedModel="OpenAI SDK"
      onModelChange={handleModelChange}
    />
  );
};

export default Home;
