import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const userId = query.uid; // Get user ID from request
  if (!userId) {
    return { error: 'User ID is required' };
  }

  const { data, error } = await supabase
    .from('leaderboard')
    .select('uid, total_points')
    .order('total_points', { ascending: false });

  if (error) {
    return { error: error.message };
  }

  const userIndex = data.findIndex((user) => user.uid == userId);
  return { place: userIndex + 1 };
});
