import { createClient } from '@sanity/client';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  try {
    const token = getHeader(event, 'authorization')?.replace('Bearer ', '');
    if (!token) return { status: 'error', message: 'Unauthorized' };

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

    const { questionInfo } = body;

    const QUESTIONS_QUERY = `*[_type == "questions" && week == '${questionInfo.week}' && number == '${questionInfo.number}'][0]`;
    const existingQuestion = await sanityClient.fetch(QUESTIONS_QUERY);

    if (!existingQuestion) {
      return { status: 'error', message: 'Question not found' };
    }

    const updatedQuestion = await sanityClient
      .patch(existingQuestion._id)
      .unset([`image`])
      .commit();

    return {
      status: 'success',
      message: 'Image reference removed successfully',
      data: updatedQuestion,
    };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
});
