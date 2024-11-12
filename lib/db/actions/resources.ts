'use server';

import { NewResourceParams, insertResourceSchema, resources } from '@/lib/db/schema/resources';
import { db } from '..';
import { embeddings as embeddingsTable } from '../schema/embeddings';

export const createResource = async (
  input: NewResourceParams,
  embeddings: Array<{ embedding: number[]; content: string }>
) => {
  try {
    const { content } = insertResourceSchema.parse(input);

    const [resource] = await db.insert(resources).values({ content }).returning();

    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        resourceId: resource.id,
        ...embedding
      }))
    );

    return 'Resource successfully created and embedded.';
  } catch (error) {
    console.log('error', error);
    return error instanceof Error && error.message.length > 0
      ? error.message
      : 'Error, please try again.';
  }
};

// delete all embeddings
export const deleteAllEmbeddings = async () => {
  await db.delete(resources);
  await db.delete(embeddingsTable);
};
