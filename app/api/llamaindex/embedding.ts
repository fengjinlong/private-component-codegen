import { env } from '@/lib/env.mjs';
import { OpenAIEmbedding } from 'llamaindex';
import { Document } from 'llamaindex';
import { VectorStoreIndex } from 'llamaindex';
import { serviceContextFromDefaults } from 'llamaindex';

// 创建 OpenAI 嵌入模型实例
const embedModel = new OpenAIEmbedding({
  apiKey: env.EMBEDDING_API_KEY,
  model: env.EMBEDDING
});

// 创建服务上下文
const serviceContext = serviceContextFromDefaults({
  embedModel
});

// 生成多个文档的嵌入
export const generateEmbeddings = async (
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = value.split('-------split line-------');

  const documents = chunks.map((chunk) => new Document({ text: chunk }));

  // 获取所有文档的嵌入
  const embeddings = await Promise.all(
    documents.map(async (doc) => {
      const embedding = await embedModel.getTextEmbedding(doc.text);
      return {
        content: doc.text,
        embedding: embedding
      };
    })
  );

  return embeddings;
};

// 生成单个文本的嵌入
export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  return await embedModel.getTextEmbedding(input);
};

// 查找相关内容

export const findRelevantContent = async (
  userQuery: string
): Promise<{ name: string; similarity: number }[]> => {
  // 创建或获取已存在的索引
  const index = await VectorStoreIndex.fromDocuments([], { serviceContext });

  // 创建检索器
  const retriever = index.asRetriever();
  retriever.similarityTopK = 5; // 获取前5个最相似的结果

  // 执行相似度搜索
  const results = await retriever.retrieve(userQuery);

  return results.map((node) => ({
    name: node.text,
    similarity: node.score || 0
  }));
};
