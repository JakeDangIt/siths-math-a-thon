import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '');
  const { balance, gameState } = await readBody(event);
  const now = new Date().toISOString();

  if (!token || balance === undefined) {
    return { error: 'Invalid parameters' };
  }

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    const userId = decoded.sub;

    if (!userId) return { error: 'Unauthorized' };

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

      if (updateError) {
        console.error('Error updating balance:', updateError);
        return { error: 'Failed to update balance' };
      }
    } else {
      const { error: insertError } = await supabase
        .from('balances')
        .insert({ user_id: userId, balance, last_updated: now, gameState });

      if (insertError) {
        console.error('Error inserting balance:', insertError);
        return { error: 'Failed to insert balance' };
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Server error:', err);
    return { error: 'Unauthorized or internal server error' };
  }
});
