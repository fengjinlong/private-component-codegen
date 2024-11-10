'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import ChatMainLayout from './components/ChatMainLayout/ChatMainLayout';
import { Skeleton } from 'antd';

const OpenaiSdk = dynamic(() => import('./openai-sdk'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col gap-4 px-52 py-4">
      <Skeleton active />
      <Skeleton active />
      <Skeleton active />
    </div>
  )
});

const modelItems = [
  { label: 'OpenAI SDK', key: 'openai-sdk', component: <OpenaiSdk /> },
  { label: 'LangChain', key: 'langchain' },
  { label: 'LLamaIndex', key: 'llamaindex' },
  { label: 'Vercel AI SDK', key: 'vercel-ai-sdk' }
];

const Home = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get('type');

  const [selectedModel, setSelectedModel] = useState(
    modelItems.some((item) => item.key === typeFromUrl) ? typeFromUrl! : modelItems[0].key
  );

  const handleModelChange = (model: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('type', model);
    router.push(`${pathname}?${params.toString()}`);
    setSelectedModel(model);
  };

  const MainContent = useMemo(
    () => modelItems.find((item) => item.key === selectedModel)?.component,
    [selectedModel]
  );

  return (
    <ChatMainLayout
      modelItems={modelItems}
      mainContent={MainContent}
      selectedModel={selectedModel}
      onModelChange={handleModelChange}
    />
  );
};

export default Home;
