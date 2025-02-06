import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '');
  const { week, answers } = await readBody(event);

  if (!token || !week || !answers) {
    return { error: 'Invalid request: Missing parameters' };
  }

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    const userId = decoded.sub;

    if (!userId) return { error: 'Unauthorized' };

    const now = new Date().toISOString();

    // Check for existing submission within the last hour
    const { data: existingAnswers, error: fetchError } = await supabase
      .from('submitted_answers')
      .select('created_at')
      .eq('uid', userId)
      .eq('submitted_week', week)
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching previous answers:', fetchError.message);
      return { error: 'Failed to check previous submissions' };
    }

    if (existingAnswers) {
      const lastSubmissionTime = new Date(existingAnswers.created_at).getTime();
      if (Date.now() - lastSubmissionTime < 1000 * 60 * 60) {
        return { error: 'You can only submit once per hour' };
      }

      const { error: updateError } = await supabase
        .from('submitted_answers')
        .update({ created_at: now, answers })
        .eq('uid', userId)
        .eq('submitted_week', week);

      if (updateError) {
        console.error('Error updating answers:', updateError.message);
        return { error: 'Failed to update answers' };
      }
    } else {
      const { error: insertError } = await supabase
        .from('submitted_answers')
        .insert({
          uid: userId,
          submitted_week: week,
          answers,
          created_at: now,
        });

      if (insertError) {
        console.error('Error inserting answers:', insertError.message);
        return { error: 'Failed to submit answers' };
      }
    }

    return { success: true, message: 'Answers submitted successfully' };
  } catch (err) {
    console.error('Server error:', err);
    return { error: 'Unauthorized or internal server error' };
  }
});
