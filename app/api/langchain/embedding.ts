import { env } from '@/lib/env.mjs';
import { OpenAIEmbeddings } from '@langchain/openai';
import { findSimilarContent } from '@/lib/db/selectors/resources';
import { HttpsProxyAgent } from 'https-proxy-agent';

// 创建 OpenAIEmbeddings 实例
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: env.EMBEDDING_API_KEY,
  modelName: env.EMBEDDING,
  configuration: {
    baseURL: env.EMBEDDING_BASE_URL,
    ...(env.HTTP_AGENT
      ? {
          httpAgent: new HttpsProxyAgent(env.HTTP_AGENT)
        }
      : {})
  }
});

const generateChunks = (input: string): string[] => {
  return input.split('-------split line-------');
};

export const generateEmbeddings = async (
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);

  // 使用 LangChain 的 embeddings.embedDocuments
  const embeddingVectors = await embeddings.embedDocuments(chunks);

  return chunks.map((chunk, index) => ({
    content: chunk,
    embedding: embeddingVectors[index]
  }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  // 使用 LangChain 的 embeddings.embedQuery
  return await embeddings.embedQuery(input);
};

export const findRelevantContent = async (
  userQuery: string
): Promise<{ name: string; similarity: number }[]> => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  return findSimilarContent(userQueryEmbedded);
};
