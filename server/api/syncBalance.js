import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '');

  if (!token) return { error: 'Unauthorized' };

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    const userId = decoded.sub;

    if (!userId) return { error: 'Unauthorized' };

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
  } catch (err) {
    console.error('Authorization error:', err);
    return { error: 'Unauthorized or internal server error' };
  }
});
