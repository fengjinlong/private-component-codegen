'use client';

import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Message } from '../components/ChatMessages/interface';
import ChatMessages from '../components/ChatMessages/ChatMessages';
import { OpenAIRequest } from '../api/openai/types';

const Home = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageImgUrl, setMessageImgUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async (newMessages: Message[]) => {
    try {
      setMessages(newMessages as Message[]);

      setIsLoading(true);
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: newMessages
        } as OpenAIRequest)
      });
      const reader = response?.body?.getReader();
      const textDecoder = new TextDecoder();
      let received_stream = '';
      const id = nanoid();
      while (true) {
        if (!reader) break;
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const text = textDecoder.decode(value);
        received_stream += text;
        setMessages((messages) => {
          if (messages.find((message) => message.id === id)) {
            const newModifiedMessages = messages.map((message) => {
              if (message.id === id) {
                return { ...message, content: received_stream };
              }
              return message;
            });
            return newModifiedMessages;
          }
          return [...messages, { id, role: 'assistant', content: received_stream }];
        });
      }
      setInput('');
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    await handleSendMessage([
      ...messages,
      {
        id: nanoid(),
        role: 'user',
        content: messageImgUrl
          ? [
              { type: 'image_url', image_url: { url: messageImgUrl } },
              { type: 'text', text: input }
            ]
          : input
      }
    ]);
  };

  const handleRetry = (id: string) => {
    const index = messages.findIndex((message) => message.id === id);
    if (index > 0) {
      const previousMessages = messages.slice(0, index);
      handleSendMessage(previousMessages);
    }
  };

  return (
    <ChatMessages
      messages={messages}
      input={input}
      handleInputChange={handleInputChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      messageImgUrl={messageImgUrl}
      setMessagesImgUrl={setMessageImgUrl}
      onRetry={handleRetry}
    />
  );
};

export default Home;
