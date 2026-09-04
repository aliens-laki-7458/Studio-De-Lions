'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function VisitorCounter() {
  const [todayCount, setTodayCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function handleVisitor() {
      try {
        const today = new Date().toISOString().split('T')[0];
        const visitedToday = sessionStorage.getItem('visited_today');

        if (!visitedToday) {
          // 1. අලුත් විසිවර් කෙනෙක් නම් function එක හරහා count එක 1කින් වැඩි කරන්න
          await supabase.rpc('increment_daily_visitor', { target_date: today });
          sessionStorage.setItem('visited_today', 'true');
        }

        // 2. අද දිනට අදාළ මුළු ගණන ඩේටාබේස් එකෙන් ලබා ගැනීම
        const { data, error } = await supabase
          .from('daily_visitors')
          .select('count')
          .eq('date', today)
          .single();

        if (data) {
          setTodayCount(data.count);
        }
      } catch (err) {
        console.error('Error tracking visitor:', err);
      } finally {
        setLoading(false);
      }
    }

    handleVisitor();
  }, []);

  return (
    <div className="inline-flex items-center gap-2 bg-[#141419] border border-[#262630] px-4 py-2 rounded-full text-xs text-[#9CA3AF]">
      <span>📅 Today Visitors:</span>
      <span className="font-bold text-[#D97706]">
        {loading ? '...' : todayCount}
      </span>
    </div>
  );
}