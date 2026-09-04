'use client';
export const dynamic = 'force-dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0E] text-[#F3F4F6] font-sans selection:bg-[#D97706] selection:text-black">
      
      {/* Professional Responsive Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.p 
          className="text-[#D97706] text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          OUR STORY
        </motion.p>
        <motion.h1 
          className="text-4xl sm:text-6xl font-serif font-semibold text-[#F3F4F6] leading-tight mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Behind the Lens at <br />
          <span className="italic font-light text-[#9CA3AF]">Studio De-Lions.</span>
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center my-16">
          <div className="relative aspect-[4/5] rounded overflow-hidden border border-[#262630]">
            <Image
              src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5"
              alt="Studio Photography"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6 text-[#9CA3AF] text-sm leading-relaxed">
            <h3 className="text-xl font-serif text-white">Capturing Moments Beyond Ordinary</h3>
            <p>
              At Studio De-Lions, we believe photography is not just about pressing a button—it is about freezing real emotions, artistic geometry, and unique human stories into timeless frames.
            </p>
            <p>
              Based in Eheliyagoda, Sri Lanka, we specialize in portraiture, urban lifestyle, cinematic creative photography, and commercial concepts. Every photograph we produce is crafted with attention to mood, lighting, and detail.
            </p>
            <div className="pt-4 grid grid-cols-2 gap-4 border-t border-[#262630]">
              <div>
                <span className="block text-2xl font-serif text-[#D97706] font-bold">5+</span>
                <span className="text-xs uppercase tracking-wider">Years Experience</span>
              </div>
              <div>
                <span className="block text-2xl font-serif text-[#D97706] font-bold">500+</span>
                <span className="text-xs uppercase tracking-wider">Projects Completed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL STYLIZED FOOTER */}
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
                  <Link href="/" className="hover:text-white transition-colors">Home</Link>
                </li>
                <li>
                  <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
                </li>
                <li>
                  <Link href="/about" className="text-[#D97706] border-b border-[#D97706] pb-1 inline-block">About</Link>
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
                  <span>info@aliensstudio.com</span>
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
                  <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded bg-[#141419] border border-[#262630] flex items-center justify-center text-[#9CA3AF] hover:text-[#D97706] hover:border-[#D97706] transition-colors" title="Facebook">
                    FB
                  </a>
                  <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded bg-[#141419] border border-[#262630] flex items-center justify-center text-[#9CA3AF] hover:text-[#D97706] hover:border-[#D97706] transition-colors" title="Instagram">
                    IG
                  </a>
                  <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded bg-[#141419] border border-[#262630] flex items-center justify-center text-[#9CA3AF] hover:text-[#D97706] hover:border-[#D97706] transition-colors" title="YouTube">
                    YT
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-8 flex justify-between items-center text-[11px]">
            <p>© {new Date().getFullYear()} Aliens Studio. All rights reserved.</p>
            
            <Link 
              href="/admin" 
              title="Admin Panel Login"
              className="text-[#9CA3AF]/40 hover:text-[#D97706] transition-colors p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </Link>
          </div>
        </div>
      </footer>

    </main>
  );
}