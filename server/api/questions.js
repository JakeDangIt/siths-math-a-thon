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

    const image = changes.image;
    const filePath = `week${questionInfo.week}_question${questionInfo.number}.png`;

    if (existingQuestion) {
      await sanityClient
        .patch(existingQuestion._id)
        .set({
          title: changes.title,
          content: changes.content,
          author: changes.author,
        })
        .commit();

      if (image) {
        await sanityClient.assets
          .upload('image', image, {
            filename: filePath,
          })
          .then((imageAsset) => {
            return sanityClient
              .patch(existingQuestion._id)
              .set({
                image: {
                  _type: 'image',
                  asset: {
                    _type: 'reference',
                    _ref: imageAsset._id,
                  },
                },
              })
              .commit();
          });
      }

      return { status: 'success', message: 'Question updated successfully' };
    } else {
      await sanityClient.create({ ...changes, _type: 'questions' });
      return { status: 'success', message: 'Question created successfully' };
    }
  } catch (error) {
    return { status: 'error', message: error.message };
  }
});
