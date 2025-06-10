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

  const { data: recentSubmissions, error: checkError } = await supabase
    .from('contact')
    .select('created_at')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(1);

  if (checkError) {
    return { error: 'Error checking recent submissions.' };
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  if (
    recentSubmissions.length > 0 &&
    new Date(recentSubmissions[0].created_at) > oneHourAgo
  ) {
    return {
      error:
        'You have already submitted a form in the last hour. Please wait before trying again.',
    };
  }

  const { error } = await supabase
    .from('contact')
    .insert([{ name, email, subject, body }]);

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: 'Form submitted successfully' };
});
