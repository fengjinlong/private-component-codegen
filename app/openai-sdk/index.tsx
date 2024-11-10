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

  const handleSubmit = async () => {
    const newMessages = [
      ...messages,
      {
        id: nanoid(),
        role: 'user',
        content: input
      }
    ];
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
    />
  );
};

export default Home;
