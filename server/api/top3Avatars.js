// server/api/top3avatars.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default defineEventHandler(async () => {
  try {
    // Fetch the top 3 users from the leaderboard
    const { data: top3Users, error: leaderboardError } = await supabase
      .from('leaderboard')
      .select('uid')
      .order('total_points', { ascending: false })
      .limit(3);

    if (leaderboardError) {
      console.error('Error fetching leaderboard:', leaderboardError.message);
      return { error: 'Failed to fetch leaderboard' };
    }

    if (!top3Users.length) {
      return { error: 'No leaderboard data available' };
    }

    const top3UIDs = top3Users.map((user) => user.uid);

    // Fetch the avatars and names for the top 3 users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('avatar, name, uid')
      .in('uid', top3UIDs);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError.message);
      return { error: 'Failed to fetch profile data' };
    }

    // Sort profiles to match leaderboard order
    profiles.sort((a, b) => top3UIDs.indexOf(a.uid) - top3UIDs.indexOf(b.uid));

    // Convert avatar URLs to public URLs
    const avatarsWithUrls = await Promise.all(
      profiles.map(async (profile) => {
        let imageUrl = null;
        if (profile.avatar) {
          const { data: avatarURL, error: avatarError } = await supabase.storage
            .from('avatars')
            .getPublicUrl(profile.avatar);

          if (avatarError) {
            console.error('Error getting avatar URL:', avatarError.message);
          } else {
            imageUrl = avatarURL.publicUrl;
          }
        }
        return { name: profile.name, image: imageUrl };
      })
    );

    return avatarsWithUrls;
  } catch (err) {
    console.error('Server error:', err);
    return { error: 'Internal server error' };
  }
});
