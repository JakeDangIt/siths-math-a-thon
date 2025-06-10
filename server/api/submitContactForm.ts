import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { setHeader } from 'h3';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Schema for validation
const ContactSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email').endsWith('@nycstudents.net', {
    message: 'Must be a nycstudents.net email',
  }),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Message body is required'),
});

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, max-age=60');
  const body = await readBody(event);

  // Validate using Zod
  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message || 'Invalid input';
    return { error: firstIssue };
  }

  const { name, email, subject, body: messageBody } = parsed.data;

  // Check if this email has submitted within the last hour
  const { data: recentSubmissions, error: fetchError } = await supabase
    .from('contact')
    .select('created_at')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(1);

  if (fetchError) {
    console.error('Fetch error:', fetchError.message);
    return { error: 'Server error. Please try again later.' };
  }

  if (recentSubmissions.length > 0) {
    const lastSubmissionTime = new Date(recentSubmissions[0].created_at);
    const now = new Date();
    const timeSince = now.getTime() - lastSubmissionTime.getTime();

    const oneHour = 1000 * 60 * 60;
    if (timeSince < oneHour) {
      return {
        error:
          'You already submitted a form recently. Please wait 1 hour before submitting again.',
      };
    }
  }

  // Insert form into the database
  const { error: insertError } = await supabase.from('contact').insert([
    {
      name,
      email,
      subject,
      body: messageBody,
    },
  ]);

  if (insertError) {
    console.error('Insert error:', insertError.message);
    return { error: 'Failed to submit form. Please try again.' };
  }

  return { success: true, message: 'Form submitted successfully' };
});
