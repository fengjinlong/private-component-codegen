import { env } from '@/lib/env.mjs';
import { MetadataMode, OpenAIEmbedding } from 'llamaindex';
import { VectorStoreIndex, PGVectorStore } from 'llamaindex';
import { serviceContextFromDefaults } from 'llamaindex';

// 创建 OpenAI 嵌入模型实例
const embedModel = new OpenAIEmbedding({
  apiKey: env.EMBEDDING_API_KEY,
  model: env.EMBEDDING
});

// 添加 PG 数据库连接配置
const pgvectorStore = new PGVectorStore({
  clientConfig: {
    connectionString: env.DATABASE_URL
  },
  tableName: 'embeddings'
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

  // const documents = chunks.map((chunk) => new Document({ text: chunk }));

  // 获取所有文档的嵌入
  const embeddings = await Promise.all(
    chunks.map(async (chunk) => {
      const embedding = await embedModel.getTextEmbedding(chunk);
      return {
        content: chunk,
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
  // 使用 PGVectorStore 创建索引
  const index = await VectorStoreIndex.fromVectorStore(pgvectorStore, serviceContext);

  // 创建检索器
  const retriever = index.asRetriever({
    similarityTopK: 5
  });

  // 执行相似度搜索
  const results = await retriever.retrieve(userQuery);

  return results.map((node) => ({
    name: node.node.getContent(MetadataMode.ALL) || '',
    similarity: node.score || 0
  }));
};
