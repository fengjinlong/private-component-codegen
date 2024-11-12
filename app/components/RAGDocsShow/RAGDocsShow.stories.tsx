import type { Meta, StoryObj } from '@storybook/react';
import { RAGDocsShow } from './index';
import { RAGDocument } from './interface';

const meta: Meta<typeof RAGDocsShow> = {
  title: 'Components/RAGDocsShow',
  component: RAGDocsShow,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof RAGDocsShow>;

const mockDocuments: RAGDocument[] = [
  {
    id: '1',
    title: '什么是RAG?',
    content: 'RAG（检索增强生成）是一种将大型语言模型与外部知识库结合的技术...',
    score: 0.95,
    metadata: {
      source: 'AI文档',
      date: '2024-03-20'
    }
  },
  {
    id: '2',
    title: 'RAG的应用场景',
    content: 'RAG技术可以应用在问答系统、文档摘要、知识检索等多个领域...',
    score: 0.88,
    metadata: {
      source: '技术博客',
      author: 'John Doe'
    }
  }
];

export const Default: Story = {
  args: {
    documents: mockDocuments,
    loading: false
  }
};

export const Loading: Story = {
  args: {
    documents: mockDocuments,
    loading: true
  }
};

export const Empty: Story = {
  args: {
    documents: [],
    loading: false
  }
};
