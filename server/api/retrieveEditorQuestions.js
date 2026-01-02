import { createClient } from '@supabase/supabase-js';
import { setHeader } from 'h3';
import jwt from 'jsonwebtoken';

import { retrieveUser } from '../utils/retrieveUser';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
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

    const { user, userError } = await retrieveUser(userId);

    if (userError) {
      return { error: userError.message };
    }

    if (user.role !== 'admin') {
      return { user: null };
    }

    const { data, dbError } = await supabase.from('questions').select('*');

    if (dbError) {
      return { error: dbError.message };
    }

    return {
      questions: data,
    };
  } catch (err) {
    console.error('JWT verification error:', err);
    return { user: null };
  }
});
