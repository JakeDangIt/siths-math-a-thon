import { createClient } from '@supabase/supabase-js';
import { defineEventHandler } from 'h3';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default defineEventHandler(async () => {
  try {
    // Step 1: Get top 3 user UIDs from leaderboard
    const { data: top3Users, error: leaderboardError } = await supabase
      .from('leaderboard')
      .select('uid')
      .order('total_points', { ascending: false })
      .limit(3);

    if (leaderboardError) {
      console.error('Error fetching leaderboard:', leaderboardError.message);
      return { error: 'Failed to fetch leaderboard' };
    }

    if (!top3Users?.length) {
      return { error: 'No leaderboard data available' };
    }

    const top3UIDs = top3Users.map((user) => user.uid);

    // Step 2: Get just names for those UIDs
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('name, uid')
      .in('uid', top3UIDs);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError.message);
      return { error: 'Failed to fetch profile data' };
    }

    // Step 3: Sort to match leaderboard order
    profiles.sort((a, b) => top3UIDs.indexOf(a.uid) - top3UIDs.indexOf(b.uid));

    // Return only names
    return profiles.map((profile) => ({ name: profile.name }));
  } catch (err) {
    console.error('Server error:', err);
    return { error: 'Internal server error' };
  }
});
