import { createClient } from '@sanity/client';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  try {
    const token = getHeader(event, 'authorization')?.replace('Bearer ', '');
    if (!token) return { status: 'error', message: 'Unauthorized' };

    // Verify JWT with Supabase secret
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    const userId = decoded.sub;

    if (!userId) return { status: 'error', message: 'Unauthorized' };

    const body = await readBody(event);
    const sanityToken = useRuntimeConfig().sanityToken;

    const sanityClient = createClient({
      projectId: 'ferer2d9',
      dataset: 'production',
      token: sanityToken,
      useCdn: false,
    });

    const { _id, changes } = body;

    if (_id && _id !== '') {
      await sanityClient
        .patch(_id)
        .set({
          content: changes.content,
          date: changes.date,
        })
        .commit();

      return { status: 'success', message: 'Activity updated successfully' };
    } else {
      await sanityClient.create({ ...changes, _type: 'activity' });
      return { status: 'success', message: 'Activity created successfully' };
    }
  } catch (error) {
    console.error('Authorization or Database Error:', error);
    return { status: 'error', message: 'Unauthorized or Internal server error' };
  }
});
