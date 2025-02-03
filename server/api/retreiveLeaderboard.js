import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default defineEventHandler(async (event) => {

  const { data, error } = await supabase
    .from('leaderboard')
    .select('uid, user_name, total_points')
    .order('total_points', { ascending: false })

  if (error) {
    return { error: error.message };
  }

  return { leaderboard: data };
});
