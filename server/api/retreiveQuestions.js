import { createClient } from '@supabase/supabase-js';
import { setHeader } from 'h3';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

import { weeks } from '@/utils/dates.js';

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, max-age=60');

  const { data, error } = await supabase.from('questions').select('*');

  if (error) {
    return { error: error.message };
  }

  const currentWeek = () => {
    const now = Date.now();
    return weeks.find((w) => now >= w.startsAt && now < w.endsAt)?.week ?? null;
  };

  const week = currentWeek();

  const weekData = data.filter((q) => q.week.replace(' Bonus', '') === week);

  return { questions: weekData };
});
