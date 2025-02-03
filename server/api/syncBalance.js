// server/api/syncBalance.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default defineEventHandler(async (event) => {
  const { userId } = await readBody(event);

  if (!userId) {
    return { error: 'User ID is required' };
  }

  const { data, error } = await supabase
    .from('balances')
    .select('balance, last_updated, gameState')
    .eq('user_id', userId)
    .order('last_updated', { ascending: false })
    .limit(1);

  if (error || data.length === 0) {
    return { error: 'Could not retrieve balance data' };
  }

  return { success: true, balanceData: data[0] };
});
