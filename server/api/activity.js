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

    const { _id, changes } = body;

    if (_id) {
      await sanityClient
        .patch(_id)
        .set({
          content: changes.content,
          date: changes.date,
        })
        .commit();

      return { status: 'success', message: 'Question updated successfully' };
    } else {
      await sanityClient.create({...changes, _type: "activity"});
      return { status: 'success', message: 'Question created successfully' };
    }
  } catch (error) {
    return { status: 'error', message: error.message };
  }
});
