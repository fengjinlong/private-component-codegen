import React, { useState } from 'react';
import { Divider, Dropdown, Flex, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { ChatMainLayoutProps } from './interface';
import { useStyles } from './styles';

const ChatMainLayout: React.FC<ChatMainLayoutProps> = ({ mainContent }) => {
  const [selectedModel, setSelectedModel] = useState('OpenAI SDK');
  const styles = useStyles();
  const items = [
    { label: 'OpenAI SDK', key: 'openai-sdk' },
    { label: 'LangChain', key: 'langchain' },
    { label: 'LLamaIndex', key: 'llamaindex' },
    { label: 'Vercel AI SDK', key: 'vercel-ai-sdk' }
  ];

  return (
    <Flex
      vertical
      className="w-full h-2"
      style={{
        width: '100%',
        height: '100vh',
        background:
          'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
        backgroundColor: '#1a1a1a'
      }}
    >
      <Flex
        style={{
          width: '100%',
          padding: '12px 361px',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: '#242424'
        }}
      >
        <Flex align="center" gap={12}>
          <div className="flex items-center gap-2 italic text-l font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            <div className="text-2xl">Biz</div>
            <div>Component Codegen</div>
          </div>
          <Divider
            type="vertical"
            style={{ height: '12px', borderColor: 'rgba(255, 255, 255, 0.2)' }}
          />
          <Dropdown
            menu={{
              items,
              onClick: ({ key }) => {
                const selectedItem = items.find((item) => item.key === key);
                setSelectedModel(selectedItem?.label || 'OpenAI SDK');
              },
              style: {
                backgroundColor: '#242424'
              }
            }}
            dropdownRender={(menu) => (
              <div
                className={styles.dropdownClassName}
                style={{
                  backgroundColor: '#242424',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  borderRadius: '6px',
                  color: '#e6e6e6'
                }}
              >
                {menu}
              </div>
            )}
          >
            <Button
              style={{
                background: '#333',
                color: '#e6e6e6',
                borderColor: 'rgba(255, 255, 255, 0.2)'
              }}
            >
              {selectedModel} <DownOutlined />
            </Button>
          </Dropdown>
        </Flex>
      </Flex>
      <Flex
        vertical
        style={{
          padding: '24px 0px',
          justifyContent: 'center',
          alignItems: 'center',
          flex: '1 0 0',
          alignSelf: 'stretch'
        }}
      >
        <Flex
          vertical
          style={{
            width: '1058px',
            alignItems: 'flex-start',
            gap: '24px',
            flex: '1 0 0'
          }}
        >
          {mainContent}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ChatMainLayout;
