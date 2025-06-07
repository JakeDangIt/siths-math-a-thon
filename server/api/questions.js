import { createClient } from '@sanity/client';
import streamifier from 'streamifier';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  return
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '');
  if (!token) return { status: 'error', message: 'Unauthorized' };

  try {
    // Verify JWT
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
          points: changes.points,
        })
        .commit();

      // Process image only if it exists
      if (changes.image) {
        try {
          const base64String = changes.image.split(',')[1]; // Extract base64 data
          const imageBuffer = Buffer.from(base64String, 'base64');

          const imageAsset = await sanityClient.assets.upload(
            'image',
            streamifier.createReadStream(imageBuffer),
            {
              filename: `week${questionInfo.week}_question${questionInfo.number}.png`,
            }
          );

          await sanityClient
            .patch(existingQuestion._id)
            .set({
              image: {
                _type: 'image',
                asset: {
                  _type: 'reference',
                  _ref: imageAsset._id, // Save only the reference
                },
              },
            })
            .commit();
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          return { status: 'error', message: 'Image upload failed' };
        }
      }

      return { status: 'success', message: 'Question updated successfully' };
    } else {
      // Create new question entry
      const newQuestion = await sanityClient.create({
        ...changes,
        _type: 'questions',
      });

      return {
        status: 'success',
        message: 'Question created successfully',
        id: newQuestion._id,
      };
    }
  } catch (error) {
    console.error('Error in saveQuestion API:', error);
    return { status: 'error', message: error.message };
  }
});
