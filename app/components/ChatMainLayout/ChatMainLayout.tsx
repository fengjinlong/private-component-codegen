import React from 'react';
import { Divider, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { ChatMainLayoutProps } from './interface';
import { useStyles } from './styles';

const ChatMainLayout: React.FC<ChatMainLayoutProps> = ({
  mainContent,
  selectedModel,
  onModelChange
}) => {
  const styles = useStyles();
  const items = [
    { label: 'OpenAI SDK', key: 'openai-sdk' },
    { label: 'LangChain', key: 'langchain' },
    { label: 'LLamaIndex', key: 'llamaindex' },
    { label: 'Vercel AI SDK', key: 'vercel-ai-sdk' }
  ];

  return (
    <div className="flex flex-col w-full h-screen bg-black/90 bg-gradient-to-br from-indigo-500/10 to-purple-500/30">
      <div className="flex justify-center items-center gap-2 w-full py-3 border-b border-white/10 bg-[#242424]">
        <div className="flex items-center gap-2 italic text-l font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          <div className="text-2xl">Biz</div>
          <div className="hidden sm:block">Component Codegen</div>
        </div>
        <Divider type="vertical" className="h-3 border-white/20" />
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              const selectedItem = items.find((item) => item.key === key);
              onModelChange(selectedItem?.label || 'OpenAI SDK');
            }
          }}
          dropdownRender={(menu) => (
            <div
              className={`${styles.dropdownClassName} bg-black/80 shadow-md rounded-md !text-white/80`}
            >
              {menu}
            </div>
          )}
        >
          <Button className="!bg-black/80 !text-white/80 !border-black/80">
            {selectedModel} <DownOutlined />
          </Button>
        </Dropdown>
      </div>
      <div className="flex justify-center items-center h-[calc(100%-57px)] overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <div className="w-full h-full p-4 max-w-[1058px] text-white/80">{mainContent}</div>
      </div>
    </div>
  );
};

export default ChatMainLayout;
