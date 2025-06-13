import { z } from 'zod';
import { defineEventHandler, readBody } from 'h3';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';

// server/api/profile/update.ts (or your signup API too)

import { teachers } from '@/utils/teachers.js'; // adjust path as needed

const validTeacherNames = teachers.map((t) => t.name);

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  osis: z
    .string()
    .regex(/^\d{9}$/)
    .optional(),
  teacher: z
    .string()
    .refine((val) => validTeacherNames.includes(val), {
      message: 'Invalid teacher name',
    })
    .optional(),
  grade: z.enum(['9th', '10th', '11th', '12th']).optional(),
});

export default defineEventHandler(async (event) => {
  // Authenticate user
  const user = await serverSupabaseUser(event);
  if (!user) {
    return { statusCode: 401, statusMessage: 'Unauthorized' };
  }

  const body = await readBody(event);
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return {
      statusCode: 400,
      statusMessage: 'Invalid profile data',
      data: parsed.error.flatten(),
    };
  }

  const updates = parsed.data;

  if (Object.keys(updates).length === 0) {
    return {
      statusCode: 400,
      statusMessage: 'No fields to update',
    };
  }

  const supabase = await serverSupabaseClient(event);

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('uid', user.id);

  if (error) {
    return {
      statusCode: 500,
      statusMessage: 'Failed to update profile',
      data: error.message,
    };
  }

  return {
    success: true,
    message: 'Profile updated successfully',
  };
});
