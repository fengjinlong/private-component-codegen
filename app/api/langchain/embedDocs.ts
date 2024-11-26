import fs from 'fs';
import { env } from '@/lib/env.mjs';
import { createResource, deleteAllEmbeddings } from '@/lib/db/actions/resources';
import { generateEmbeddings } from './embedding';

console.log('env.EMBEDDING', env.EMBEDDING);

export const generateEmbeddingsFromDocs = async () => {
  console.log('start reading docs');
  const docs = fs.readFileSync('./ai-docs/basic-components.txt', 'utf8');

  console.log('start generating embeddings');
  const embeddings = await generateEmbeddings(docs);

  await deleteAllEmbeddings();
  console.log('reset all resources');

  console.log('start creating resource');
  await createResource({ content: docs }, embeddings);

  console.log('success~~~');
};

generateEmbeddingsFromDocs();
