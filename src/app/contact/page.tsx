'use client';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#0B0B0E] text-[#F3F4F6] font-sans selection:bg-[#D97706] selection:text-black">
      
      {/* Header */}
      <header className="p-6 sm:p-12 border-b border-[#262630]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 group py-2">
            <div className="flex items-center px-3 py-1.5 rounded-lg shadow-md border border-[#D97706]/40">
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
            <Link href="/#gallery" className="hover:text-white transition-colors">Gallery</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-[#D97706] border-b border-[#D97706] pb-1">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Main Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Info Side */}
          <div>
            <motion.p 
              className="text-[#D97706] text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              LET'S CREATE TOGETHER
            </motion.p>
            <motion.h1 
              className="text-4xl sm:text-6xl font-serif font-semibold text-[#F3F4F6] leading-tight mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Get in Touch <br />
              <span className="italic font-light text-[#9CA3AF]">with Us.</span>
            </motion.h1>

            <div className="space-y-6 text-[#9CA3AF] text-sm mt-12">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded bg-[#141419] border border-[#262630] flex items-center justify-center text-[#D97706]">
                  📍
                </div>
                <div>
                  <p className="text-white font-medium text-xs uppercase tracking-wider">Location</p>
                  <p className="text-xs">Eheliyagoda, Sri Lanka</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded bg-[#141419] border border-[#262630] flex items-center justify-center text-[#D97706] shrink-0">
                  📞
                </div>
                <div>
                  <p className="text-white font-medium text-xs uppercase tracking-wider">Phone</p>
                  <p className="text-xs">+94 71 666 2270</p>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <span className="text-xs">+94 77 891 3281</span>
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
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded bg-[#141419] border border-[#262630] flex items-center justify-center text-[#D97706]">
                  ✉️
                </div>
                <div>
                  <p className="text-white font-medium text-xs uppercase tracking-wider">Email</p>
                  <p className="text-xs">lakshithadeshan93@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-[#141419] p-8 rounded border border-[#262630]">
            <h3 className="text-xl font-serif text-white mb-6 uppercase tracking-wider">Send a Message</h3>
            
            {submitted ? (
              <div className="bg-[#D97706]/10 border border-[#D97706]/30 text-[#D97706] p-6 rounded text-center my-12">
                <h4 className="text-lg font-serif font-semibold mb-2">Message Sent!</h4>
                <p className="text-xs text-[#9CA3AF]">Thank you for reaching out. We will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase text-[#9CA3AF] mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full bg-[#0B0B0E] border border-[#262630] focus:border-[#D97706] text-white p-3 rounded text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-[#9CA3AF] mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="w-full bg-[#0B0B0E] border border-[#262630] focus:border-[#D97706] text-white p-3 rounded text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-[#9CA3AF] mb-2">Message</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tell us about your project or photoshoot..."
                    className="w-full bg-[#0B0B0E] border border-[#262630] focus:border-[#D97706] text-white p-3 rounded text-sm outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#D97706] hover:bg-[#b45309] text-black font-semibold uppercase tracking-widest text-xs rounded transition-colors duration-300 cursor-pointer shadow-lg"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* Footer */}
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
                <li><Link href="/" className="hover:text-[#D97706] transition-colors">Home</Link></li>
                <li><Link href="/#gallery" className="hover:text-[#D97706] transition-colors">Featured Gallery</Link></li>
                <li><Link href="/contact" className="hover:text-[#D97706] transition-colors">Services & Pricing</Link></li>
                <li><Link href="/about" className="hover:text-[#D97706] transition-colors">About Us</Link></li>
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
            <p>© {new Date().getFullYear()} Studio De-Lions. All rights reserved.</p>
            
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