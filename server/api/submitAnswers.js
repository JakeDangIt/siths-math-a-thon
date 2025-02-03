// server/api/submitAnswers.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { uid, week, answers } = body;

  if (!uid || !week || !answers) {
    return { error: 'Invalid request: Missing parameters' };
  }

  try {
    // Check for existing submission within the last hour
    const { data: existingAnswers, error: fetchError } = await supabase
      .from('submitted_answers')
      .select('created_at')
      .eq('uid', uid)
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

      // Update existing submission
      const { error: updateError } = await supabase
        .from('submitted_answers')
        .update({
          created_at: new Date().toISOString(),
          answers: answers,
        })
        .eq('uid', uid)
        .eq('submitted_week', week);

      if (updateError) {
        console.error('Error updating answers:', updateError.message);
        return { error: 'Failed to update answers' };
      }
    } else {
      // Insert new submission
      const { error: insertError } = await supabase
        .from('submitted_answers')
        .insert({
          uid,
          submitted_week: week,
          answers,
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error inserting answers:', insertError.message);
        return { error: 'Failed to submit answers' };
      }
    }

    return { success: true, message: 'Answers submitted successfully' };
  } catch (err) {
    console.error('Server error:', err);
    return { error: 'Internal server error' };
  }
});
