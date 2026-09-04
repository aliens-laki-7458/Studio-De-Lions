'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function VisitorCounter() {
  const [todayCount, setTodayCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function trackVisitor() {
      try {
        // අද දින (YYYY-MM-DD) ලබා ගැනීම
        const today = new Date().toISOString().split('T')[0];

        // 1. අද දිනට අදාළ Record එකක් Supabase එකේ තියෙනවද බලන්න
        const { data: existingData, error: fetchError } = await supabase
          .from('daily_visitors')
          .select('*')
          .eq('date', today)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching visitor count:', fetchError);
          return;
        }

        if (existingData) {
          // 2. Record එක තියෙනවා නම්, Count එක 1 කින් වැඩි කරන්න (Update)
          const newCount = existingData.count + 1;
          await supabase
            .from('daily_visitors')
            .update({ count: newCount })
            .eq('date', today);

          setTodayCount(newCount);
        } else {
          // 3. අද දිනට Record එකක් නැත්නම්, අලුතින් 1ක් දාලා Count එක 1 කියල දාන්න (Insert)
          await supabase
            .from('daily_visitors')
            .insert([{ date: today, count: 1 }]);

          setTodayCount(1);
        }
      } catch (err) {
        console.error('Error in visitor tracking:', err);
      } finally {
        setLoading(false);
      }
    }

    // එක Session එකකට එක පාරක් පමණක් Count වෙන්න අවශ්‍ය නම් SessionStorage පාවිච්චි කරන්න පුළුවන්
    const visitedToday = sessionStorage.getItem('visited_today');
    if (!visitedToday) {
      trackVisitor();
      sessionStorage.setItem('visited_today', 'true');
    } else {
      // දැනටමත් මේ Session එකේ Count කරලා නම්, Database එකෙන් අද දින අගය විතරක් අරන් පෙන්නන්න
      fetchTodayOnly();
    }
  }, []);

  async function fetchTodayOnly() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('daily_visitors')
        .select('count')
        .eq('date', today)
        .single();
      
      if (data) setTodayCount(data.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-2 bg-[#141419] border border-[#262630] px-4 py-2 rounded-full text-xs text-[#9CA3AF]">
      <span>📅 Today Visitors:</span>
      <span className="font-bold text-[#D97706]">
        {loading ? '...' : todayCount}
      </span>
    </div>
  );
}