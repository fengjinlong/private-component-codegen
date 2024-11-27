import postgres from 'postgres';
import { env } from '@/lib/env.mjs';
import { MetadataMode, OpenAIEmbedding } from 'llamaindex';
import { VectorStoreIndex, PGVectorStore } from 'llamaindex';
import { serviceContextFromDefaults } from 'llamaindex';

// 创建 postgres 连接
const connection = postgres(env.DATABASE_URL);

// 首先创建一个视图来匹配 LlamaIndex 的预期结构
await connection.unsafe(`
  CREATE OR REPLACE VIEW llamaindex_embedding AS
  SELECT 
    id,
    content,
    embedding as embeddings,  -- 重命名 embedding 列为 embeddings
    resource_id as collection -- 使用 resource_id 作为 collection
  FROM embeddings;
`);

// 创建 OpenAI 嵌入模型实例
const embedModel = new OpenAIEmbedding({
  apiKey: env.EMBEDDING_API_KEY,
  model: env.EMBEDDING,
  additionalSessionOptions: {
    baseURL: env.EMBEDDING_BASE_URL
  }
});

const pgvectorStore = new PGVectorStore({
  client: connection,
  shouldConnect: false,
  tableName: 'llamaindex_embedding1',
  schemaName: 'public',
  dimensions: 1536,
  performSetup: false
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

export const createRetriever = async () => {
  // 使用 PGVectorStore 创建索引
  const index = await VectorStoreIndex.fromVectorStore(pgvectorStore, serviceContext);

  // 创建检索器
  return index.asRetriever({
    similarityTopK: 5
  });
};

export const findRelevantContent = async (
  userQuery: string
): Promise<{ name: string; similarity: number }[]> => {
  const retriever = await createRetriever();

  // 执行相似度搜索
  const results = await retriever.retrieve(userQuery);

  console.log('results', results);

  return results.map((node) => ({
    name: node.node.getContent(MetadataMode.ALL) || '',
    similarity: node.score || 0
  }));
};
