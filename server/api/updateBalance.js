// server/api/updateBalance.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default defineEventHandler(async (event) => {
  // Parse request body
  const { userId, balance, gameState } = await readBody(event);
  const now = new Date().toISOString();

  if (!userId || balance === undefined) {
    return { error: 'Invalid parameters' };
  }

  try {
    // Check if the row exists
    const { data: existingData, error: fetchError } = await supabase
      .from('balances')
      .select('user_id')
      .eq('user_id', userId);

    if (fetchError) {
      console.error('Error fetching existing balance:', fetchError);
      return { error: fetchError.message };
    }

    if (existingData.length > 0) {
      const { error: updateError } = await supabase
        .from('balances')
        .update({ balance, last_updated: now, gameState })
        .eq('user_id', userId);
    } 
    
    else {
      const { error: insertError } = await supabase
        .from('balances')
        .insert({ user_id: userId, balance, last_updated: now, gameState });
    }

    return { success: true };
  } catch (err) {
    console.error('Error updating balance in Supabase:', err);
    return { error: 'Internal server error' };
  }
});
