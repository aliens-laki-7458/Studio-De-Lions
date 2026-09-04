'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B0E]/90 backdrop-blur-md border-b border-[#262630] px-6 sm:px-12 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group py-1">
          <div className="flex items-center px-3 py-1.5 rounded-lg shadow-md border border-[#D97706]/40">
            <Image 
              src="/White & Gold.png" 
              alt="Studio De-Lions Logo" 
              width={140} 
              height={45}
              className="w-28 sm:w-36 h-auto object-contain"
              priority
            />
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-xs font-medium tracking-widest uppercase">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className={`transition-colors ${isActive(link.href) ? 'text-[#D97706] border-b border-[#D97706] pb-1' : 'text-[#9CA3AF] hover:text-white'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#F3F4F6] focus:outline-none p-2 rounded-lg bg-[#141419] border border-[#262630]"
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6 text-[#D97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown / Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-[#141419] border-t border-[#262630] mt-4 rounded-2xl shadow-2xl"
          >
            <nav className="flex flex-col space-y-4 px-6 py-6 text-sm font-medium tracking-widest uppercase">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className={`transition-colors py-2 border-b border-[#262630]/50 ${isActive(link.href) ? 'text-[#D97706] font-bold' : 'text-[#9CA3AF] hover:text-white'}`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2">
                <Link 
                  href="/contact" 
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-[#D97706] hover:bg-[#b45309] text-black text-xs font-bold uppercase tracking-widest py-3 rounded-full transition-all"
                >
                  Book Session
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}