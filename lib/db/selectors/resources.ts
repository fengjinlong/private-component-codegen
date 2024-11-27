import { cosineDistance } from 'drizzle-orm/sql';

import { embeddings } from '@/lib/db/schema/embeddings';
import { db } from '@/lib/db';
import { sql, gt, desc } from 'drizzle-orm';

export const findSimilarContent = async (userQueryEmbedded: number[]) => {
  const similarity = sql<number>`1 - (${cosineDistance(embeddings.embedding, userQueryEmbedded)})`;
  const similarGuides = await db
    .select({ content: embeddings.content, similarity, resourceId: embeddings.resourceId })
    .from(embeddings)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
  return similarGuides;
};
