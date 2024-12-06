import { createClient } from '@sanity/client';
import streamifier from 'streamifier';

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

    const filePath = `week${questionInfo.week}_question${questionInfo.number}.png`;

    if (existingQuestion) {
      await sanityClient
        .patch(existingQuestion._id)
        .set({
          title: changes.title,
          content: changes.content,
          author: changes.author,
          points: changes.points,
        })
        .commit();

      if (changes.image) {
        const base64String = changes.image.split(',')[1];
        const image = Buffer.from(base64String, 'base64');
        
        await sanityClient.assets
          .upload('image', await streamifier.createReadStream(image), {
            filename: filePath,
          })
          .then(async (imageAsset) => {
            return await sanityClient
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
