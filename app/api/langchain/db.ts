import { Pool } from 'pg';
import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { OpenAIEmbeddings } from '@langchain/openai';
import { env } from '@/lib/env.mjs';

const connectionConfig = {
  pool: new Pool({
    connectionString: env.DATABASE_URL
  }),
  tableName: 'langchain_embeddings'
};

export const vectorStore = await PGVectorStore.initialize(
  new OpenAIEmbeddings({
    modelName: env.EMBEDDING,
    apiKey: env.EMBEDDING_API_KEY,
    configuration: {
      baseURL: env.EMBEDDING_BASE_URL
    }
  }),
  connectionConfig
);
