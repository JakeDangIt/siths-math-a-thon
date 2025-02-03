// server/api/submitForm.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default defineEventHandler(async (event) => {
  const { name, email, subject, body } = await readBody(event);

  if (!name || !email || !subject || !body) {
    return { error: 'All fields are required' };
  }

  const { error } = await supabase.from('contact').insert([{ name, email, subject, body }]);

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: 'Form submitted successfully' };
});
