import type { Meta, StoryObj } from '@storybook/react';
import { RAGDocs } from './index';

const meta: Meta<typeof RAGDocs> = {
  title: 'Components/RAGDocs',
  component: RAGDocs,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof RAGDocs>;

const mockDocs = [
  {
    id: '1',
    content: '这是第一段RAG文档内容。这是一段很长的文字，用来测试展开收起功能。'.repeat(10)
  },
  {
    id: '2',
    content: '这是第二段RAG文档内容。这也是一段很长的文字，用来测试展开收起功能。'.repeat(10)
  },
  {
    id: '3',
    content: '这是第三段RAG文档内容。这同样是一段很长的文字，用来测试展开收起功能。'.repeat(10)
  }
];

export const Default: Story = {
  args: {
    docs: mockDocs,
    expandRows: 3
  }
};

export const SingleLine: Story = {
  args: {
    docs: mockDocs,
    expandRows: 1
  }
};

export const FiveLines: Story = {
  args: {
    docs: mockDocs,
    expandRows: 5
  }
};
