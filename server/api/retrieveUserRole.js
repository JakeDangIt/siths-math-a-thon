// server/api/retrieveUserRole.js
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { getHeader, setHeader } from 'h3';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: { persistSession: false },
  }
);

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store');

  const authHeader = getHeader(event, 'authorization');

  if (!authHeader) {
    return { user: null };
  }

  const token = authHeader.replace(/^Bearer\s+/i, '');

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    const userId = decoded.sub;

    if (!userId) {
      return { user: null };
    }

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
        id: userId,
        role: profile.role,
      },
    };
  } catch (err) {
    console.error('JWT verification error:', err);
    return { user: null };
  }
});
