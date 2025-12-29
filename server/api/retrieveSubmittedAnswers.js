import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '');

  if (!token) {
    return { error: 'Missing authorization token' };
  }

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    const userId = decoded.sub;

    if (!userId) {
      return { error: 'Unauthorized' };
    }

    const { data, error } = await supabase
      .from('submitted_answers')
      .select('correct_answers, uid, created_at')
      .eq('uid', userId);

    if (error) {
      console.error('Error fetching submitted answers:', error);
      return { error: error.message };
    }

    return { data };
  } catch (err) {
    console.error('Authorization error:', err);
    return { error: 'Unauthorized or invalid token' };
  }
});
