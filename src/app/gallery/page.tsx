'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
// @ts-ignore
import HTMLFlipBook from 'react-pageflip';

interface Category {
  id: number;
  name: string;
  image_url?: string;
  price_range?: string;
  description?: string;
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

export default function GalleryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  
  // Navigation states
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<AlbumPhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Selected photo for fullscreen lightbox view
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const bookRef = useRef<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: catData } = await supabase.from('categories').select('*');
        if (catData) setCategories(catData);

        const { data: albumData } = await supabase.from('albums').select('*').order('created_at', { ascending: false });
        if (albumData) setAlbums(albumData);
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

  // Filter albums by selected main category
  const filteredAlbums = selectedCategory 
    ? albums.filter(album => album.category?.toLowerCase() === selectedCategory.name.toLowerCase())
    : [];

  return (
    <main className="min-h-screen bg-[#0B0B0E] text-[#F3F4F6] font-sans selection:bg-[#D97706] selection:text-black">
      
      {/* DYNAMIC HEADER / HERO SECTION BASED ON SELECTED CATEGORY */}
      <section className="relative h-[55vh] sm:h-[65vh] w-full flex flex-col justify-between p-6 sm:p-12 overflow-hidden border-b border-[#262630]">
        
        {/* Dynamic Background Image */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory ? selectedCategory.id : 'default-hero'}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <Image
                src={selectedCategory?.image_url || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"}
                alt={selectedCategory?.name || "Gallery Background"}
                fill
                priority
                className="object-cover opacity-30 transition-transform duration-1000"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0E]/70 via-[#0B0B0E]/85 to-[#0B0B0E]" />
        </div>

      {/* Header */}
        <motion.header 
          className="relative z-10 flex justify-between items-center max-w-7xl mx-auto w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/" className="flex items-center space-x-3 group py-2">
            <div className="flex items-center  px-3 py-1.5 rounded-lg shadow-md border border-[#D97706]/40">
              <Image 
                src="/White & Gold.png" 
                alt="Studio De-Lions Logo" 
                width={150} 
                height={50}
                className="w-32 sm:w-40 h-auto object-contain"
                priority
              />
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-8 text-xs font-medium tracking-widest uppercase text-[#9CA3AF]">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <a href="/gallery" className="text-[#D97706] border-b border-[#D97706] pb-1">Gallery</a>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </nav>
        </motion.header>

        {/* Hero Title Section */}
        <div className="relative z-10 max-w-7xl mx-auto w-full my-auto text-center">
          <motion.p 
            className="text-[#D97706] text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold mb-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {selectedCategory ? 'SELECTED COLLECTION' : 'TIMELESS VISUAL ART'}
          </motion.p>

          <motion.h1 
            className="text-4xl sm:text-6xl font-serif font-normal text-[#F3F4F6] tracking-tight uppercase"
            key={selectedCategory ? selectedCategory.name : 'all'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {selectedCategory ? selectedCategory.name : 'Studio Gallery'}
          </motion.h1>

          {/* Show Price Range badge if category is selected */}
          {selectedCategory && (
            <motion.div 
              className="mt-4 inline-flex items-center gap-3 bg-[#141419]/90 border border-[#D97706]/50 px-5 py-2 rounded-full backdrop-blur-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="text-xs text-[#9CA3AF] uppercase tracking-wider">Starting From:</span>
              <span className="text-sm font-bold text-[#D97706]">{selectedCategory.price_range || "Contact for Pricing"}</span>
            </motion.div>
          )}

          {selectedCategory && (
            <div className="mt-5 flex justify-center gap-4">
              <Link 
                href="/contact" 
                className="bg-[#D97706] hover:bg-[#b45309] text-black text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full transition-all shadow-lg shadow-[#D97706]/20"
              >
                Book This Session
              </Link>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="text-xs text-[#D97706] hover:text-white uppercase tracking-widest font-semibold cursor-pointer inline-flex items-center gap-2 bg-[#141419]/80 border border-[#262630] px-4 py-2 rounded-full backdrop-blur-md transition-all"
              >
                ✕ All Categories
              </button>
            </div>
          )}
        </div>
        
        <div />
      </section>

      {/* PORTFOLIO CONTENT SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !selectedCategory ? (
          /* STEP 1: Categories Grid with Price Tag Preview */
          <div>
            <div className="mb-12 text-center">
              <h3 className="text-2xl font-serif text-white tracking-wider">Explore By Categories & Pricing</h3>
              <p className="text-xs text-[#9CA3AF] mt-2 uppercase tracking-widest">Click a category to view albums and package details</p>
            </div>

            {categories.length === 0 ? (
              <p className="text-center text-[#9CA3AF]">No categories found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat, index) => {
                  const count = albums.filter(a => a.category?.toLowerCase() === cat.name.toLowerCase()).length;
                  return (
                    <motion.div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat)}
                      className="group bg-[#141419] rounded-2xl overflow-hidden border border-[#262630] hover:border-[#D97706] transition-all duration-500 cursor-pointer flex flex-col shadow-2xl"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                        {cat.image_url ? (
                          <Image
                            src={cat.image_url}
                            alt={cat.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs text-gray-600 uppercase tracking-widest">No Image</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-[#D97706] text-[10px] tracking-widest px-3 py-1 rounded-full uppercase font-semibold">
                          {count} Albums
                        </span>
                        {cat.price_range && (
                          <span className="absolute top-4 right-4 bg-[#D97706] text-black text-[10px] tracking-wider px-3 py-1 rounded-full uppercase font-bold shadow-md">
                            {cat.price_range}
                          </span>
                        )}
                      </div>

                      <div className="p-6 bg-[#141419] flex justify-between items-center border-t border-[#262630]">
                        <div>
                          <h4 className="font-serif text-lg text-white group-hover:text-[#D97706] transition-colors duration-300 uppercase tracking-wider">
                            {cat.name}
                          </h4>
                          <p className="text-[11px] text-[#9CA3AF] mt-0.5">View Albums & Packages</p>
                        </div>
                        <span className="text-[#D97706] text-sm group-hover:translate-x-1 transition-transform">➔</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* STEP 2: Albums Grid under Selected Category */
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-[#262630] pb-6 gap-4">
              <div>
                <h3 className="text-2xl font-serif text-white uppercase tracking-wider">{selectedCategory.name} Albums</h3>
                <p className="text-xs text-[#9CA3AF] mt-1">Package Range: <span className="text-[#D97706] font-semibold">{selectedCategory.price_range || "Custom Quote"}</span></p>
              </div>
              <div className="flex items-center gap-3">
                <Link 
                  href="/contact" 
                  className="bg-[#D97706] hover:bg-[#b45309] text-black text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full transition-all"
                >
                  Inquire Now
                </Link>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs text-[#9CA3AF] hover:text-white uppercase tracking-widest font-semibold cursor-pointer bg-[#141419] border border-[#262630] px-4 py-2 rounded-full"
                >
                  ← Back
                </button>
              </div>
            </div>

            {filteredAlbums.length === 0 ? (
              <div className="text-center py-20 text-[#9CA3AF] text-sm bg-[#141419] border border-[#262630] rounded-2xl">
                No albums available under this category yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAlbums.map((album, index) => (
                  <motion.div
                    key={album.id}
                    onClick={() => handleOpenAlbum(album)}
                    className="group bg-[#141419] rounded-2xl overflow-hidden border border-[#262630] hover:border-[#D97706] transition-all duration-500 cursor-pointer flex flex-col shadow-2xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                      {album.cover_image_url ? (
                        <Image
                          src={album.cover_image_url}
                          alt={album.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-gray-600">No Image</div>
                      )}
                      <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-[#D97706] text-[10px] tracking-widest px-3 py-1 rounded-full uppercase font-semibold">
                        {album.date}
                      </span>
                    </div>

                    <div className="p-6 bg-[#141419] border-t border-[#262630] flex justify-between items-center">
                      <div>
                        <h4 className="font-serif text-lg text-white group-hover:text-[#D97706] transition-colors duration-300">
                          {album.title}
                        </h4>
                        <p className="text-[11px] text-[#D97706] mt-1 uppercase tracking-widest font-medium">📖 Open Interactive Photobook</p>
                      </div>
                      <span className="text-[#D97706] text-sm group-hover:translate-x-1 transition-transform">➔</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="bg-gradient-to-r from-[#141419] via-[#0B0B0E] to-[#141419] border-t border-b border-[#262630] py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-serif text-white uppercase tracking-wider mb-4">Want a Custom Photoshoot Package?</h3>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mb-8 leading-relaxed">
            Contact us today to discuss your vision, check date availability, or get a personalized quote tailored to your special event.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/contact" 
              className="bg-[#D97706] hover:bg-[#b45309] text-black text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-full transition-all shadow-lg"
            >
              Contact Us Now
            </Link>
            <a 
  href="https://wa.me/94778913281" 
  target="_blank" 
  rel="noopener noreferrer"
  className="bg-[#1F1F28] hover:bg-[#262630] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-full transition-all border border-[#262630] flex items-center gap-2"
>
  💬 WhatsApp Chat
</a>
          </div>
        </div>
      </section>

      {/* PHOTOBOOK FLIPVIEW MODAL (INTERACTIVE FLIPBOOK) */}
      {activeAlbum && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden">
          {/* Top Bar */}
          <div className="w-full max-w-5xl flex justify-between items-center bg-[#141419] px-6 py-4 rounded-2xl border border-[#262630] mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white">{activeAlbum.title}</h2>
              <p className="text-[11px] text-[#D97706] uppercase tracking-widest">Interactive Photobook • {activeAlbum.date}</p>
            </div>
            <button 
              onClick={() => setActiveAlbum(null)}
              className="bg-[#262630] hover:bg-red-600 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Book Area */}
          <div className="flex-1 flex items-center justify-center w-full max-w-6xl overflow-hidden">
            {loadingPhotos ? (
              <div className="text-center text-[#9CA3AF] text-sm animate-pulse">Assembling photobook pages...</div>
            ) : albumPhotos.length === 0 ? (
              <div className="text-center text-[#9CA3AF] text-sm">No photos found in this album.</div>
            ) : (
              <div className="shadow-2xl flex justify-center items-center w-full">
                {/* @ts-ignore */}
                <HTMLFlipBook 
                  width={380} 
                  height={520} 
                  size="stretch"
                  minWidth={300}
                  maxWidth={500}
                  minHeight={400}
                  maxHeight={700}
                  maxShadowOpacity={0.8}
                  showCover={true}
                  mobileScrollSupport={true}
                  className="mx-auto shadow-2xl rounded-lg"
                  ref={bookRef}
                >
                  {/* Front Cover Page */}
                  <div className="demo-page bg-[#1a1a24] text-white flex flex-col justify-between p-8 border-r border-[#262630] shadow-inner select-none cursor-grab">
                    <div className="text-center pt-8">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-[#D97706] font-semibold">Aliens Studio</span>
                      <h1 className="text-2xl sm:text-3xl font-serif mt-4 text-white uppercase">{activeAlbum.title}</h1>
                    </div>
                    <div className="relative w-full h-64 rounded-xl overflow-hidden border border-[#262630]">
                      <Image src={activeAlbum.cover_image_url} alt="Cover" fill className="object-cover" />
                    </div>
                    <div className="text-center pb-4">
                      <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest">{activeAlbum.category} Collection</p>
                      <p className="text-[10px] text-[#D97706] mt-2">Swipe or click corner to open ➔</p>
                    </div>
                  </div>

                  {/* Inside Pages (Photos) */}
                  {albumPhotos.map((photo, index) => (
                    <div 
                      key={photo.id} 
                      className="demo-page bg-[#141419] p-4 flex flex-col justify-center items-center border border-[#262630] relative select-none cursor-pointer group"
                      onClick={() => setSelectedPhoto(photo.image_url)}
                    >
                      <div className="relative w-full h-[85%] rounded-lg overflow-hidden bg-black shadow-md">
                        <Image src={photo.image_url} alt={`Page ${index + 1}`} fill className="object-contain group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="mt-3 flex justify-between w-full px-4 text-[10px] text-[#9CA3AF]">
                        <span>Page {index + 2}</span>
                        <span className="text-[#D97706]">🔍 Click to zoom</span>
                      </div>
                    </div>
                  ))}

                  {/* Back Cover Page */}
                  <div className="demo-page bg-[#1a1a24] text-white flex flex-col justify-center items-center p-8 border-l border-[#262630] select-none text-center">
                    <div className="w-12 h-12 rounded-full bg-[#D97706]/20 border border-[#D97706] flex items-center justify-center text-[#D97706] font-bold mb-4">
                      A
                    </div>
                    {/* Back Cover Page */}
<                  div className="demo-page bg-[#1a1a24] text-white flex flex-col justify-center items-center p-8 border-l border-[#262630] select-none text-center">
                 <div className="w-12 h-12 rounded-full bg-[#D97706]/20 border border-[#D97706] flex items-center justify-center text-[#D97706] font-bold mb-5">
    A
                  </div>
                 <h3 className="font-serif text-xl uppercase tracking-wider text-white mb-3">Aliens Studio</h3>
                 <p className="text-xs text-[#9CA3AF] max-w-xs leading-relaxed mb-6">Thank you for exploring our portfolio. Contact us to book your dream photoshoot.</p>
                <Link href="/contact" className="bg-[#D97706] text-black font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-[#b45309] transition-all">
                Book Now
  </Link>
</div>
                  </div>
                </HTMLFlipBook>
              </div>
            )}
          </div>
          
          <div className="mt-2 text-[11px] text-[#9CA3AF] tracking-widest uppercase text-center">
            💡 Tip: Click or drag the corners of the pages to turn them like a real book.
          </div>
        </div>
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-lg z-60 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-[92vh] flex items-center justify-center w-full h-full">
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 md:-top-12 md:right-0 bg-[#262630] hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-colors cursor-pointer z-70"
            >
              ✕
            </button>
            <div className="relative w-full h-full flex items-center justify-center">
              <Image 
                src={selectedPhoto} 
                alt="Fullscreen view" 
                fill
                className="object-contain rounded-xl" 
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#262630] bg-[#08080A] py-8 text-center text-xs text-[#9CA3AF]">
        <p>© {new Date().getFullYear()} Aliens Studio. All rights reserved.</p>
      </footer>

    </main>
  );
}
