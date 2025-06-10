import { z } from 'zod';
import { defineEventHandler, readBody } from 'h3';
import { serverSupabaseClient } from '#supabase/server';

import { teachers } from '@/utils/teachers.js'; // adjust path as needed

const validTeacherNames = teachers.map((t) => t.name);

const signupSchema = z.object({
  email: z.string().email().endsWith('@nycstudents.net'),
  password: z.string().min(8),
  name: z.string().min(1),
  osis: z.string().regex(/^\d{9}$/, 'OSIS must be a 9-digit number'),
  teacher: z
    .string()
    .refine((val) => validTeacherNames.includes(val), {
      message: 'Invalid teacher name',
    })
    .optional(),
  grade: z.enum(['9th', '10th', '11th', '12th']),
  agreement: z.literal(true), // must be explicitly true
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return {
      statusCode: 400,
      statusMessage: 'Invalid signup data',
      data: parsed.error.flatten(),
    };
  }

  const { email, password, name, osis, teacher, grade } = parsed.data;

  const supabase = serverSupabaseClient(event);

  const { data, error } = await (
    await supabase
  ).auth.signUp({
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
    return {
      statusCode: 500,
      statusMessage: 'Supabase error',
      data: error.message,
    };
  }

  return {
    success: true,
    message: 'Signed up successfully',
    data,
  };
});
