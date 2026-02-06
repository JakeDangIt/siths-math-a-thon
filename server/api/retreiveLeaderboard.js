import { createClient } from '@supabase/supabase-js';
import { setHeader } from 'h3';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, max-age=60');

  const { data, error } = await supabase
    .from('leaderboard')
    .select('uid, user_name, total_points')
    .order('total_points', { ascending: false })
    .limit(150);

  if (error) {
    return { error: error.message };
  }

  return { leaderboard: data };
});
