import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: { persistSession: false },
  }
);

export async function retrieveUser(userId) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('uid', userId)
    .single();

  if (profileError) {
    console.error('Profile fetch error:', profileError);
    return { error: profileError.message };
  }

  return {
    user: {
      uid: userId,
      name: profile.name,
      email: profile.email,
      osis: profile.osis,
      grade: profile.grade,
      role: profile.role,
    },
  };
}
