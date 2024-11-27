import { env } from '@/lib/env.mjs';
import OpenAI from 'openai';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { findSimilarContent } from '@/lib/db/selectors/resources';

const embeddingAI = new OpenAI({
  apiKey: env.EMBEDDING_API_KEY,
  baseURL: env.EMBEDDING_BASE_URL,
  ...(env.HTTP_AGENT ? { httpAgent: new HttpsProxyAgent(env.HTTP_AGENT) } : {})
});

const generateChunks = (input: string): string[] => {
  return input.split('-------split line-------');
};

export const generateEmbeddings = async (
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);

  const embeddings = await Promise.all(
    chunks.map(async (chunk) => {
      const response = await embeddingAI.embeddings.create({
        model: env.EMBEDDING,
        input: chunk
      });
      return {
        content: chunk,
        embedding: response.data[0].embedding
      };
    })
  );

  return embeddings;
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  const response = await embeddingAI.embeddings.create({
    model: env.EMBEDDING,
    input
  });
  return response.data[0].embedding;
};

export const findRelevantContent = async (
  userQuery: string
): Promise<{ content: string; similarity: number }[]> => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  return findSimilarContent(userQueryEmbedded);
};
