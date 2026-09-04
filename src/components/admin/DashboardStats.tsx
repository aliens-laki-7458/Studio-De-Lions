'use client';

import { Photo, Category, Offer } from '@/types/admin';

interface DashboardStatsProps {
  photos: Photo[];
  categories: Category[];
  offers: Offer[];
}

export default function DashboardStats({ photos, categories, offers }: DashboardStatsProps) {
  const categoryCounts = categories.map((cat) => {
    const count = photos.filter((p) => p.category === cat.name).length;
    return { name: cat.name, count };
  });
  
  const maxCount = Math.max(...categoryCounts.map(c => c.count), 1);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#141419] p-6 rounded-2xl border border-[#262630]">
        <div>
          <span className="text-[10px] text-[#D97706] font-semibold uppercase tracking-widest">AI Studio Insight</span>
          <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wider mt-1">Dashboard Overview</h1>
          <p className="text-xs text-[#9CA3AF] mt-1">Real-time performance metrics and studio analytics.</p>
        </div>
        <div className="bg-[#0B0B0E] border border-[#262630] px-4 py-2 rounded-xl text-xs text-[#9CA3AF]">
          System Status: <span className="text-emerald-400 font-bold">Optimal ⚡</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#141419] border border-[#262630] p-6 rounded-2xl">
          <p className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold">Total Photos</p>
          <h3 className="text-3xl font-bold text-white mt-2">{photos.length}</h3>
        </div>
        <div className="bg-[#141419] border border-[#262630] p-6 rounded-2xl">
          <p className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold">Categories</p>
          <h3 className="text-3xl font-bold text-[#D97706] mt-2">{categories.length}</h3>
        </div>
        <div className="bg-[#141419] border border-[#262630] p-6 rounded-2xl">
          <p className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold">Active Offers</p>
          <h3 className="text-3xl font-bold text-emerald-400 mt-2">{offers.length}</h3>
        </div>
      </div>

      <div className="bg-[#141419] border border-[#262630] p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-serif font-semibold text-white uppercase tracking-wider">Category Distribution Analysis</h3>
          <span className="text-[10px] bg-[#D97706]/10 text-[#D97706] px-2.5 py-1 rounded border border-[#D97706]/20 font-semibold">AI Calculated</span>
        </div>
        <div className="space-y-4">
          {categoryCounts.map((item) => {
            const percentage = Math.round((item.count / maxCount) * 100);
            return (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9CA3AF] font-semibold">{item.name}</span>
                  <span className="text-white font-medium">{item.count} photos ({percentage}%)</span>
                </div>
                <div className="w-full bg-[#0B0B0E] h-3 rounded-full overflow-hidden border border-[#262630]">
                  <div
                    className="bg-gradient-to-r from-[#D97706] to-amber-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}