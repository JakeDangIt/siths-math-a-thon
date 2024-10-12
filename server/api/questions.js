import { createClient } from '@sanity/client';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const sanityToken = useRuntimeConfig().sanityToken;

    const sanityClient = createClient({
      projectId: 'ferer2d9',
      dataset: 'production',
      token: sanityToken,
      useCdn: false,
    });

    const { changes, questionInfo } = body;

    const QUESTIONS_QUERY = `*[_type == "questions" && week == '${questionInfo.week}' && number == '${questionInfo.number}'][0]`;
    const existingQuestion = await sanityClient.fetch(QUESTIONS_QUERY);

    if (existingQuestion) {
      await sanityClient
        .patch(existingQuestion._id)
        .set({
          title: changes.title,
          content: changes.content,
          author: changes.author,
        })
        .commit();

      return { status: 'success', message: 'Question updated successfully' };
    } else {
      await sanityClient.create(changes);
      return { status: 'success', message: 'Question created successfully' };
    }
  } catch (error) {
    return { status: 'error', message: error.message };
  }
});
