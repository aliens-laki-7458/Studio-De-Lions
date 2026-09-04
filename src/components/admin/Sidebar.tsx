'use client';

import Link from 'next/link';

interface SidebarProps {
  activeTab: 'dashboard' | 'photos' | 'categories' | 'offers';
  setActiveTab: (tab: 'dashboard' | 'photos' | 'categories' | 'offers') => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  handleLogout: () => void;
  getGreeting: () => string;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleLogout,
  getGreeting,
}: SidebarProps) {
  return (
    <aside className={`
      fixed md:static inset-y-0 left-0 z-50
      w-72 bg-[#141419] border-r border-[#262630] p-6 
      flex flex-col justify-between 
      transform transition-transform duration-300 ease-in-out
      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div>
        <div className="mb-8 flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] bg-[#D97706]/10 text-[#D97706] px-2 py-0.5 rounded border border-[#D97706]/20 font-semibold">AI Assistant</span>
            </div>
            <h2 className="text-lg font-serif font-bold text-white uppercase tracking-widest">
              Aliens <span className="text-[#D97706]">Studio</span>
            </h2>
            <p className="text-[10px] text-[#9CA3AF] mt-1">{getGreeting()} ✨</p>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-[#9CA3AF] hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all flex items-center space-x-3 ${activeTab === 'dashboard' ? 'bg-[#D97706] text-black shadow-lg shadow-[#D97706]/20' : 'text-[#9CA3AF] hover:bg-[#262630]/50 hover:text-white'}`}
          >
            <span>📊</span>
            <span>Dashboard & Stats</span>
          </button>
          <button
            onClick={() => { setActiveTab('photos'); setIsMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all flex items-center space-x-3 ${activeTab === 'photos' ? 'bg-[#D97706] text-black shadow-lg shadow-[#D97706]/20' : 'text-[#9CA3AF] hover:bg-[#262630]/50 hover:text-white'}`}
          >
            <span>📷</span>
            <span>Manage Photos</span>
          </button>
          <button
            onClick={() => { setActiveTab('categories'); setIsMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all flex items-center space-x-3 ${activeTab === 'categories' ? 'bg-[#D97706] text-black shadow-lg shadow-[#D97706]/20' : 'text-[#9CA3AF] hover:bg-[#262630]/50 hover:text-white'}`}
          >
            <span>📁</span>
            <span>Categories</span>
          </button>
          <button
            onClick={() => { setActiveTab('offers'); setIsMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all flex items-center space-x-3 ${activeTab === 'offers' ? 'bg-[#D97706] text-black shadow-lg shadow-[#D97706]/20' : 'text-[#9CA3AF] hover:bg-[#262630]/50 hover:text-white'}`}
          >
            <span>🏷️</span>
            <span>Special Offers</span>
          </button>
        </nav>
      </div>

      <div className="pt-6 border-t border-[#262630] mt-6 flex flex-col space-y-3">
        <Link href="/" className="text-xs text-[#9CA3AF] hover:text-white transition-colors text-center py-2.5 bg-[#0B0B0E] border border-[#262630] rounded-xl font-medium">
          View Live Website
        </Link>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs uppercase tracking-wider py-2.5 rounded-xl transition-colors font-medium"
        >
          Logout System
        </button>
      </div>
    </aside>
  );
}