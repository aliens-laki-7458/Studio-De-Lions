'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Category, Offer } from '@/types/admin';
import Sidebar from '@/components/admin/Sidebar';
import DashboardStats from '@/components/admin/DashboardStats';
import ManageAlbums from '@/components/admin/ManageAlbums';
import ManageCategories from '@/components/admin/ManageCategories';
import ManageOffers from '@/components/admin/ManageOffers';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'photos' | 'categories' | 'offers'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [albumsCount, setAlbumsCount] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [visitorCount, setVisitorCount] = useState<number>(0); // Visitor count එක සඳහා state එක

  const [submittingCat, setSubmittingCat] = useState(false);
  const [submittingOffer, setSubmittingOffer] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('aliens_admin_auth');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const fetchData = async () => {
    const { data: albumData } = await supabase.from('albums').select('*');
    if (albumData) setAlbumsCount(albumData);

    const { data: catData } = await supabase.from('categories').select('*').order('name', { ascending: true });
    if (catData) setCategories(catData);

    const { data: offerData } = await supabase.from('special_offers').select('*').order('created_at', { ascending: false });
    if (offerData) setOffers(offerData);

    // Database එකෙන් visitor count එක ලබා ගැනීම (table නම 'site_stats' ලෙස උපකල්පනය කර ඇත)
    const { data: statData } = await supabase
      .from('site_stats')
      .select('total_views')
      .eq('id', 1)
      .single();

    if (statData) {
      setVisitorCount(statData.total_views || 0);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const { data, error } = await supabase.rpc('verify_admin_login', {
        input_username: usernameInput.trim(),
        input_password: passwordInput,
      });

      if (error || data !== true) {
        setErrorMsg('Invalid Username or Password!');
        return;
      }

      setIsAuthenticated(true);
      localStorage.setItem('aliens_admin_auth', 'true');
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Something went wrong.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('aliens_admin_auth');
  };

  const handleAddCategory = async (categoryName: string, imageUrl: string) => {
    const formattedCatName = categoryName.trim().toUpperCase();
    setSubmittingCat(true);

    const { error } = await supabase.from('categories').insert([
      { name: formattedCatName, image_url: imageUrl }
    ]);

    if (!error) {
      fetchData();
      alert('✨ Category added successfully!');
    } else {
      console.error('Category insert error:', error);
      if (error.code === '23505' || error.message.includes('unique constraint')) {
        alert(`⚠️ මෙම නමින් ("${formattedCatName}") දැනටමත් Category එකක් පවතී!`);
      } else {
        alert(`❌ Error: ${error.message}`);
      }
    }
    setSubmittingCat(false);
  };

  const handleDeleteCategory = async (categoryId: number) => {
    const { error } = await supabase.from('categories').delete().eq('id', categoryId);
    if (!error) {
      fetchData();
      alert('🗑️ Category deleted successfully!');
    } else {
      alert(`❌ Error deleting category: ${error.message}`);
    }
  };

  const handleAddOffer = async (data: { title: string; discountText: string; description: string; validUntil: string }) => {
    if (!window.confirm('Publish this special offer?')) return;
    setSubmittingOffer(true);

    const { error } = await supabase.from('special_offers').insert([
      { title: data.title, discount_text: data.discountText, description: data.description, valid_until: data.validUntil, active: true }
    ]);

    if (!error) {
      fetchData();
      alert('✨ Offer published!');
    } else {
      alert('❌ Error adding offer!');
    }
    setSubmittingOffer(false);
  };

  const handleDeleteOffer = async (id: number) => {
    if (!window.confirm('Remove this offer?')) return;
    const { error } = await supabase.from('special_offers').delete().eq('id', id);
    if (!error) {
      fetchData();
      alert('🗑️ Offer removed!');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'සුබ උදෑසනක්';
    if (hour < 17) return 'සුබ දවාලක්';
    return 'සුබ සන්ධ්‍යාවක්';
  };

  if (isCheckingAuth) {
    return (
      <main className="min-h-screen bg-[#0B0B0E] text-[#F3F4F6] flex items-center justify-center font-sans">
        <p className="text-sm text-[#9CA3AF] animate-pulse">Loading AI Control Center...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0B0B0E] text-[#F3F4F6] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-[#141419] p-8 rounded-2xl border border-[#D97706]/30 shadow-[0_0_30px_rgba(217,119,6,0.15)]">
          <div className="text-center mb-8">
            <span className="text-[10px] tracking-widest uppercase bg-[#D97706]/10 text-[#D97706] px-3 py-1 rounded-full border border-[#D97706]/20 font-semibold">
              ✨ Smart Portal v2.0
            </span>
            <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-widest mt-4">
              Admin <span className="text-[#D97706]">Portal</span>
            </h1>
            <p className="text-xs text-[#9CA3AF] mt-2">Aliens Studio Security Check</p>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center mb-4">
              {errorMsg}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase mb-2 text-[#9CA3AF]">Username</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-[#0B0B0E] border border-[#262630] focus:border-[#D97706] text-white p-3 rounded-lg text-sm outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase mb-2 text-[#9CA3AF]">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#0B0B0E] border border-[#262630] focus:border-[#D97706] text-white p-3 rounded-lg text-sm outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#D97706] hover:bg-[#b56203] text-black font-semibold text-xs uppercase tracking-widest py-3 rounded-lg transition-all mt-6"
            >
              Sign In Securely
            </button>
          </form>

          <div className="text-center mt-6">
            <Link href="/" className="text-xs text-[#9CA3AF] hover:text-white transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0E] text-[#F3F4F6] flex flex-col md:flex-row font-sans relative overflow-x-hidden">
      
      <div className="md:hidden bg-[#141419] border-b border-[#262630] p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2 bg-[#0B0B0E] border border-[#262630] rounded-lg"
          >
            ☰
          </button>
          <h2 className="text-sm font-serif font-bold text-white uppercase tracking-wider">
            Aliens <span className="text-[#D97706]">Studio</span>
          </h2>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-semibold animate-pulse">
          ● Live
        </span>
      </div>

      {isMobileMenuOpen && (
        <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm" />
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleLogout={handleLogout}
        getGreeting={getGreeting}
      />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <DashboardStats 
            photos={albumsCount} 
            categories={categories} 
            offers={offers} 
            visitorCount={visitorCount} /* visitorCount prop එක මෙහි එකතු කර ඇත */
          />
        )}
        {activeTab === 'photos' && (
          <ManageAlbums categories={categories} />
        )}
        {activeTab === 'categories' && (
          <ManageCategories
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            submittingCat={submittingCat}
          />
        )}
        {activeTab === 'offers' && (
          <ManageOffers
            offers={offers}
            onAddOffer={handleAddOffer}
            onDeleteOffer={handleDeleteOffer}
            submittingOffer={submittingOffer}
          />
        )}
      </main>
    </div>
  );
}