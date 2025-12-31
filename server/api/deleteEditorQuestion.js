import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

import { retrieveUser } from '../utils/retrieveUser';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '');
  const { questionId } = await readBody(event);

  if (!token || !questionId) {
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

    if (!questionId.toString().startsWith('new-')) {
      const { data: questionData, error: fetchError } = await supabase
        .from('questions')
        .select('week, question')
        .eq('id', questionId)
        .single();

      if (fetchError) {
        console.error('Error fetching question:', fetchError);
        return { error: fetchError.message };
      }

      const { error: answerError } = await supabase
        .from('answer_key')
        .delete()
        .eq('week', questionData.week)
        .eq('question_number', questionData.question);

      if (answerError) {
        console.error('Error deleting answer:', answerError);
        return { error: answerError.message };
      }

      const { error: questionError } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (questionError) {
        console.error('Error deleting question:', questionError);
        return { error: questionError.message };
      }

      const { data: higherQuestions, error: fetchHigherError } = await supabase
        .from('questions')
        .select('id, question')
        .eq('week', questionData.week)
        .gt('question', questionData.question)
        .order('question', { ascending: true });

      if (fetchHigherError) {
        console.error('Error fetching higher questions:', fetchHigherError);
        return { error: fetchHigherError.message };
      }

      for (const higherQuestion of higherQuestions) {
        const oldQuestionNum = higherQuestion.question;
        const newQuestionNum = oldQuestionNum - 1;

        const { error: updateQuestionError } = await supabase
          .from('questions')
          .update({ question: newQuestionNum })
          .eq('id', higherQuestion.id);

        if (updateQuestionError) {
          console.error('Error updating question number:', updateQuestionError);
          return { error: updateQuestionError.message };
        }

        const { error: updateAnswerError } = await supabase
          .from('answer_key')
          .update({ question_number: newQuestionNum })
          .eq('week', questionData.week)
          .eq('question_number', oldQuestionNum);

        if (updateAnswerError) {
          console.error(
            'Error updating answer question number:',
            updateAnswerError
          );
          return { error: updateAnswerError.message };
        }
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Error:', err);
    return { error: 'Internal server error' };
  }
});
