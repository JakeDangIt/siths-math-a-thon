import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

import { retrieveUser } from '../utils/retrieveUser';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '');
  const { questions, answers } = await readBody(event);

  if (!token || !questions || !answers) {
    return { error: 'Invalid parameters' };
  }

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    const userId = decoded.sub;

    if (!userId) return { error: 'Unauthorized' };

    const { user, userError } = await retrieveUser(userId);

    if (userError) {
      return { error: userError.message };
    }

    if (user.role !== 'admin') {
      return { error: 'Admin access required' };
    }

    for (const question of questions) {
      if (question.id.toString().startsWith('new-')) {
        const { error } = await supabase.from('questions').insert({
          week: question.week,
          question: question.question,
          math_content: question.math_content,
          extra_info: question.extra_info,
          image_url: question.image_url,
        });

        if (error) {
          console.error('Error inserting question:', error);
          return { error: error.message };
        }
      } else {
        const { error } = await supabase
          .from('questions')
          .update({
            week: question.week,
            question: question.question,
            math_content: question.math_content,
            extra_info: question.extra_info,
            image_url: question.image_url,
          })
          .eq('id', question.id);

        if (error) {
          console.error('Error updating question:', error);
          return { error: error.message };
        }
      }
    }

    for (const question of questions) {
      const answer = answers[question.id];
      if (answer !== undefined) {
        const { data, error } = await supabase
          .from('answer_key')
          .update({ answer: answer })
          .eq('week', question.week)
          .eq('question_number', question.question)
          .select();

        if (error) {
          console.error('Error updating answer:', error);
          return { error: error.message };
        }

        if (data.length === 0) {
          const { error } = await supabase.from('answer_key').insert({
            week: question.week,
            question_number: question.question,
            answer: answer,
            point_value: 1,
          });

          if (error) {
            console.error('Error inserting answer:', error);
            return { error: error.message };
          }
        }
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    return { error: 'Internal server error' };
  }
});
