// server/api/saveAnswers.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default defineEventHandler(async (event) => {
  // Parse request body
  const { userId, answers } = await readBody(event);
  const now = new Date().toISOString();

  if (!userId || !answers) {
    return { error: 'Invalid parameters' };
  }

  try {
    // Check if the user already has saved answers
    const { data: existingData, error: fetchError } = await supabase
      .from('saved_answers')
      .select('uid')
      .eq('uid', userId);

    if (fetchError) {
      console.error('Error fetching saved answers:', fetchError);
      return { error: fetchError.message };
    }

    if (existingData.length > 0) {
      // Update existing answers
      const { error: updateError } = await supabase
        .from('saved_answers')
        .update({ answers, created_at: now })
        .eq('uid', userId);

      if (updateError) {
        console.error('Error updating saved answers:', updateError);
        return { error: updateError.message };
      }
    } else {
      // Insert new answers
      const { error: insertError } = await supabase
        .from('saved_answers')
        .insert({ uid: userId, answers, created_at: now });

      if (insertError) {
        console.error('Error inserting saved answers:', insertError);
        return { error: insertError.message };
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Error saving answers in Supabase:', err);
    return { error: 'Internal server error' };
  }
});
