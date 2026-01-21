
import React from 'react';

const Footer: React.FC = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <footer className="bg-slate-950 text-white py-6 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Horizontal Row Layout - Centered horizontally */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-x-16 gap-y-6">
          
          {/* Left Side: Logo & Slogan */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-2xl font-black text-blue-500 block italic tracking-tighter uppercase leading-none">
              CAIRUILIN<span className="text-slate-500 ml-0.5">STUDIO</span>
            </span>
            <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.25em] mt-1.5">
              Global business insights & research
            </p>
          </div>
          
          {/* Middle/Right Side: Quick Links (Larger Font) */}
          <nav>
            <ul className="flex items-center gap-x-10 text-slate-300 text-lg sm:text-xl font-black uppercase italic tracking-tighter">
              <li>
                <a href="#home" onClick={(e) => handleScroll(e, '#home')} className="hover:text-blue-500 transition-all hover:scale-105">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleScroll(e, '#about')} className="hover:text-blue-500 transition-all hover:scale-105">
                  News
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => handleScroll(e, '#contact')} className="hover:text-blue-500 transition-all hover:scale-105">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Copyright Section (Joined in the same row) */}
          <div className="md:border-l md:border-white/10 md:pl-10">
            <p className="text-slate-700 text-[9px] font-black uppercase tracking-widest italic whitespace-nowrap">
              &copy; {new Date().getFullYear()} CAIRUILIN STUDIO
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
