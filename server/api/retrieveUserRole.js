// server/api/retrieveUserRole.js
import jwt from 'jsonwebtoken';
import { getHeader, setHeader } from 'h3';

import { retrieveUser } from '../utils/retrieveUser';

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

    const { user, error } = await retrieveUser(userId);

    if (error) {
      console.error('User retrieval error:', error);
      return { user: null };
    }

    return {
      id: userId,
      role: user.role,
    };
  } catch (err) {
    console.error('JWT verification error:', err);
    return { user: null };
  }
});
