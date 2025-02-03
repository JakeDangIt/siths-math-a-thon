import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default defineEventHandler(async (event) => {
  const { email, password, name, osis, teacher, grade } = await readBody(event);

  if (
    !email?.endsWith('@nycstudents.net') ||
    password.length < 8 ||
    isNaN(Number(osis)) || 
    String(osis).length !== 9 ||
    !name ||
    !teacher ||
    !grade
  ) {
    return { error: 'Invalid input data' };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          osis,
          teacher,
          grade,
          profile_complete: false,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true, message: 'Signup successful. Please verify your email.' };
  } catch (err) {
    console.error('Error signing up:', err);
    return { error: 'Internal server error' };
  }
});
