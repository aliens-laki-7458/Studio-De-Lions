'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Category {
  id: number;
  name: string;
  image_url?: string;
  imageUrl?: string; // Compatibility alternative
}

interface Album {
  id: number;
  title: string;
  category: string;
  date: string;
  cover_image_url: string;
}

interface AlbumPhoto {
  id: number;
  image_url: string;
}

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<AlbumPhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Categories
        const { data: catData } = await supabase.from('categories').select('*');
        if (catData) setCategories(catData);

        // Fetch Albums
        const { data: albumData } = await supabase.from('albums').select('*').order('created_at', { ascending: false });
        if (albumData) setAlbums(albumData);

        // Fetch and Update Visitor / Page View Count
        const { data: statData } = await supabase
          .from('site_stats')
          .select('total_views')
          .eq('id', 1)
          .single();

        if (statData) {
          const newViews = (statData.total_views || 0) + 1;
          setVisitorCount(newViews);

          await supabase
            .from('site_stats')
            .update({ total_views: newViews })
            .eq('id', 1);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleOpenAlbum = async (album: Album) => {
    setActiveAlbum(album);
    setLoadingPhotos(true);
    const { data, error } = await supabase
      .from('album_photos')
      .select('*')
      .eq('album_id', album.id);

    if (error) {
      console.error('Error fetching photos:', error);
    }
    if (data) setAlbumPhotos(data);
    setLoadingPhotos(false);
  };

  const filteredAlbums = selectedCategory 
    ? albums.filter(album => album.category?.toLowerCase() === selectedCategory.toLowerCase())
    : [];

  return (
    <main className="min-h-screen bg-[#0B0B0E] text-[#F3F4F6] font-sans selection:bg-[#D97706] selection:text-black">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full flex flex-col justify-between p-6 sm:p-12 overflow-hidden border-b border-[#262630]">
        
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
            alt="Hero Background"
            fill
            priority
            unoptimized
            className="object-cover opacity-20 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0E]/60 via-[#0B0B0E]/80 to-[#0B0B0E]" />
        </div>

        {/* Header & Navbar */}
        <motion.header 
          className="relative z-10 flex justify-between items-center max-w-7xl mx-auto w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/" className="flex items-center space-x-3 group py-2">
            <div className="flex items-center px-3 py-1.5 rounded-lg shadow-md border border-[#D97706]/40">
              <Image 
                src="/White & Gold.png" 
                alt="Studio De-Lions Logo" 
                width={150} 
                height={50}
                unoptimized
                className="w-32 sm:w-40 h-auto object-contain"
                priority
              />
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-8 text-xs font-medium tracking-widest uppercase text-[#9CA3AF]">
            {navLinks.map((link) => {
              const isActive = link.name === 'Home';
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition-colors ${
                    isActive ? 'text-[#D97706] border-b border-[#D97706] pb-1' : 'hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 focus:outline-none z-20"
            aria-label="Toggle Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#D97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </motion.header>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-0 left-0 w-full bg-[#141419] border-b border-[#262630] z-15 pt-24 pb-6 px-6 shadow-2xl md:hidden"
            >
              <nav className="flex flex-col space-y-4 text-xs font-medium tracking-widest uppercase text-[#9CA3AF]">
                {navLinks.map((link) => {
                  const isActive = link.name === 'Home';
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`transition-colors py-2 border-b border-[#262630]/40 ${
                        isActive ? 'text-[#D97706]' : 'hover:text-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-12">
          <motion.p 
            className="text-[#D97706] text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            CAPTURING BEYOND ORDINARY
          </motion.p>

          <motion.h2 
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-[#F3F4F6] leading-tight max-w-3xl mb-8 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            Welcome to <br />
            <span className="italic font-light text-[#9CA3AF]">Studio DE-LIONS.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a href="#gallery" className="group relative inline-flex items-center justify-center overflow-hidden border border-[#D97706] px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium text-white transition-all duration-300 hover:bg-[#D97706] hover:text-black shadow-[0_0_20px_rgba(217,119,6,0.2)]">
              Explore Our Portfolio
            </a>
          </motion.div>
        </div>

        <motion.div 
          className="relative z-10 flex justify-between items-center text-[#9CA3AF] text-[10px] tracking-widest uppercase max-w-7xl mx-auto w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          
          <span className="animate-bounce">↓ Scroll Down</span>
          <div className="hidden sm:block"></div>
        </motion.div>
      </section>

      {/* 2. PORTFOLIO GALLERY SECTION */}
      <section id="gallery" className="max-w-7xl mx-auto px-6 py-24 sm:py-32">
        <div className="text-center mb-16 sm:mb-20">
          <motion.p
            className="text-[#D97706] text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            STUDIO PORTFOLIO
          </motion.p>

          <motion.h3
            className="text-3xl sm:text-5xl font-serif font-semibold text-[#F3F4F6] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {!selectedCategory ? 'Explore Categories' : `Category: ${selectedCategory}`}
          </motion.h3>

          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)}
              className="mt-4 text-xs text-[#D97706] hover:underline uppercase tracking-widest font-semibold cursor-pointer inline-flex items-center gap-1"
            >
              ⬅ Back to All Categories
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !selectedCategory ? (
          categories.length === 0 ? (
            <p className="text-center text-[#9CA3AF]">No categories found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat, index) => {
                const count = albums.filter(a => a.category?.toLowerCase() === cat.name.toLowerCase()).length;
                const catImg = cat.image_url || cat.imageUrl;

                return (
                  <motion.div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className="group bg-[#141419] rounded-2xl overflow-hidden border border-[#262630] hover:border-[#D97706] transition-all duration-500 cursor-pointer flex flex-col shadow-2xl"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                      {catImg ? (
                        <Image
                          src={catImg}
                          alt={cat.name}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-gray-600 uppercase tracking-widest">No Image</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-[#D97706] text-[10px] tracking-widest px-3 py-1 rounded-full uppercase font-semibold">
                        {count} Albums
                      </span>
                    </div>

                    <div className="p-6 text-center bg-[#141419] flex justify-between items-center border-t border-[#262630]">
                      <h4 className="font-serif text-lg text-white group-hover:text-[#D97706] transition-colors duration-300 uppercase tracking-wider">
                        {cat.name}
                      </h4>
                      <span className="text-[#D97706] text-sm group-hover:translate-x-1 transition-transform">➔</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )
        ) : (
          filteredAlbums.length === 0 ? (
            <div className="text-center py-16 text-[#9CA3AF] text-sm bg-[#141419] border border-[#262630] rounded-2xl">
              No albums available under this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAlbums.map((album, index) => (
                <motion.div
                  key={album.id}
                  onClick={() => handleOpenAlbum(album)}
                  className="group bg-[#141419] rounded-2xl overflow-hidden border border-[#262630] hover:border-[#D97706] transition-all duration-500 cursor-pointer flex flex-col shadow-2xl"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                    {album.cover_image_url ? (
                      <Image
                        src={album.cover_image_url}
                        alt={album.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-gray-600">No Image</div>
                    )}
                  </div>

                  <div className="p-6 bg-[#141419] border-t border-[#262630] flex justify-between items-center">
                    <div>
                      <h4 className="font-serif text-lg text-white group-hover:text-[#D97706] transition-colors duration-300">
                        {album.title}
                      </h4>
                      <p className="text-[11px] text-[#9CA3AF] mt-1 uppercase tracking-widest">📂 Click to view photoshoot</p>
                    </div>
                    <span className="text-[#D97706] text-sm group-hover:translate-x-1 transition-transform">➔</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}
      </section>

      {/* Modal to View Photos Inside Album */}
      {activeAlbum && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-[#141419] border border-[#262630] w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-[#262630] flex justify-between items-center bg-[#0B0B0E]">
              <div>
                <h2 className="text-xl font-serif font-bold text-white">{activeAlbum.title}</h2>
                <p className="text-xs text-[#D97706] mt-0.5 uppercase tracking-wider">{activeAlbum.category}</p>
              </div>
              <button 
                onClick={() => setActiveAlbum(null)}
                className="bg-[#262630] hover:bg-red-600 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {loadingPhotos ? (
                <div className="text-center py-16 text-[#9CA3AF] text-sm animate-pulse">Loading album photographs...</div>
              ) : albumPhotos.length === 0 ? (
                <div className="text-center py-16 text-[#9CA3AF] text-sm">No photos found in this album.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {albumPhotos.map((photo) => (
                    <div 
                      key={photo.id} 
                      onClick={() => setSelectedPhoto(photo.image_url)}
                      className="aspect-square bg-[#0B0B0E] rounded-xl overflow-hidden border border-[#262630] relative cursor-pointer group"
                    >
                      <Image 
                        src={photo.image_url} 
                        alt="album photo" 
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs bg-black/70 px-3 py-1.5 rounded-lg tracking-wider uppercase font-medium">🔍 Zoom</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-lg z-55 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-[92vh] flex items-center justify-center w-full h-full">
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 md:-top-12 md:right-0 bg-[#262630] hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-colors cursor-pointer z-60"
            >
              ✕
            </button>
            <div className="relative w-full h-full flex items-center justify-center">
              <Image 
                src={selectedPhoto} 
                alt="Fullscreen view" 
                fill
                unoptimized
                className="object-contain rounded-xl" 
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. PROFESSIONAL STYLIZED FOOTER */}
      <footer className="border-t border-[#262630] bg-[#08080A] pt-16 pb-12 text-[#9CA3AF] text-xs">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#262630]/60">
            
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="inline-block px-3 py-1.5 rounded-lg shadow-md border border-[#D97706]/40">
                  <Image 
                    src="/White & Gold.png" 
                    alt="Studio De-Lions Logo" 
                    width={140} 
                    height={45}
                    unoptimized
                    className="w-32 h-auto object-contain"
                  />
                </div>
              </Link>
              <p className="text-xs text-[#9CA3AF] leading-relaxed pr-2">
                Capturing emotions, timeless aesthetics, and moments beyond ordinary. Specialized in creative portraiture, commercial shoots, and cinematic visual art.
              </p>
            </div>

            <div>
              <h5 className="text-white uppercase tracking-widest font-semibold mb-4 text-xs">Quick Links</h5>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/" className="text-[#D97706] border-b border-[#D97706] pb-1 inline-block">Home</Link>
                </li>
                <li>
                  <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">About</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-white uppercase tracking-widest font-semibold mb-4 text-xs">Get In Touch</h5>
              <ul className="space-y-3 text-xs">
                <li className="flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Eheliyagoda, Sri Lanka</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#D97706] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+94 71 666 2270</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#D97706] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span>+94 77 891 3281</span>
                      <a 
                        href="https://wa.me/94778913281?text=Hello%20Studio%20De-Lions,%20I%20saw%20your%20website%20and%20want%20to%20inquire."
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#25D366] hover:underline text-[10px] font-semibold uppercase tracking-wider inline-flex items-center gap-1 bg-[#25D366]/10 px-1.5 py-0.5 rounded border border-[#25D366]/30"
                        title="Chat on WhatsApp"
                      >
                        <span>💬 WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </li>
                <li className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#D97706] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>lakshithadeshan93@gmail.com</span>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-white uppercase tracking-widest font-semibold mb-4 text-xs">Studio Hours</h5>
              <p className="text-xs text-[#9CA3AF] mb-1"><span className="text-white">Mon - Sat:</span> 8:30 AM - 6:30 PM</p>
              <p className="text-xs text-[#9CA3AF] mb-4"><span className="text-white">Sunday:</span> By Appointment Only</p>
              
              <div className="pt-2">
                <span className="text-white font-semibold uppercase tracking-wider block text-[10px] mb-2">Follow Us</span>
                <div className="flex space-x-3">
                  <a href="https://www.linkedin.com/in/lakshithdesh008?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noreferrer" className="w-8 h-8 rounded bg-[#141419] border border-[#262630] flex items-center justify-center text-[#9CA3AF] hover:text-[#D97706] hover:border-[#D97706] transition-colors" title="LinkedIn">
                    IN
                  </a>
                  <a href="https://www.facebook.com/share/1BQD5TTF9d/" target="_blank" rel="noreferrer" className="w-8 h-8 rounded bg-[#141419] border border-[#262630] flex items-center justify-center text-[#9CA3AF] hover:text-[#D97706] hover:border-[#D97706] transition-colors" title="Facebook">
                    FB
                  </a>
                  <a href="https://www.instagram.com/lakshith_studio_de_lions?igsi=MXY1dzdieW85ZGFxeg==" target="_blank" rel="noreferrer" className="w-8 h-8 rounded bg-[#141419] border border-[#262630] flex items-center justify-center text-[#9CA3AF] hover:text-[#D97706] hover:border-[#D97706] transition-colors" title="Instagram">
                    IG
                  </a>
                  <a href="https://www.tiktok.com/@lakshith.de_lions?_r=1&_t=ZS-99Rkbj5QUhI" target="_blank" rel="noreferrer" className="w-8 h-8 rounded bg-[#141419] border border-[#262630] flex items-center justify-center text-[#9CA3AF] hover:text-[#D97706] hover:border-[#D97706] transition-colors" title="TikTok">
                    TT
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-8 flex justify-between items-center text-[11px]">
            <p>© {new Date().getFullYear()} Studio DE-LIONS. All rights reserved.</p>
            
            <Link 
              href="/admin" 
              title="Admin Panel Login"
              className="text-[#9CA3AF]/40 hover:text-[#D97706] transition-colors p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a22 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </Link>
          </div>
        </div>
      </footer>

    </main>
  );
}