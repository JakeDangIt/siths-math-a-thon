// server/api/sendResetPassword.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);

  if (!email) {
    return { error: 'Email is required' };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://siths-mathathon.com/auth/updatepassword',
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: 'Reset password email sent' };
});
