import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization');

  if (!authHeader) {
    return { error: 'Unauthorized' };
  }

  const token = authHeader.replace('Bearer ', '');
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return { error: 'Invalid or expired session' };
  }

  const { subject, body } = await readBody(event);
  const { name, email } = user.user_metadata;

  if (!name || !email || !subject || !body) {
    return { error: 'All fields are required' };
  }

  const { error } = await supabase
    .from('contact')
    .insert([{ name, email, subject, body }]);

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: 'Form submitted successfully' };
});
