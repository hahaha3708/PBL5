import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X, Globe, User, ShoppingBag } from 'lucide-react';
import { RoutePath } from '../types';

const NavLinks = [
  { label: 'Home', path: RoutePath.HOME },
  { label: 'History', path: RoutePath.HISTORY },
  { label: 'Map', path: RoutePath.MAP },
  { label: 'AI Studio', path: RoutePath.AI },
  { label: 'Community', path: RoutePath.COMMUNITY },
  { label: 'Marketplace', path: RoutePath.MARKETPLACE },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-rice-paper bg-ink-black bg-texture-paper">
      {/* Header */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          isScrolled 
            ? 'bg-ink-black/90 backdrop-blur-md border-white/10 py-3 shadow-lg' 
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border-2 border-bronze-gold flex items-center justify-center bg-black/50 group-hover:bg-bronze-gold transition-colors">
              <div className="w-6 h-6 bg-bronze-gold group-hover:bg-black mask-star" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-widest text-bronze-gold">VIET HERITAGE</span>
              <span className="text-[10px] tracking-[0.3em] uppercase opacity-70">Legacy Digitalis</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NavLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className={`text-sm uppercase tracking-widest hover:text-bronze-gold transition-colors relative group ${location.pathname === link.path ? 'text-bronze-gold' : 'text-gray-300'}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-[1px] bg-bronze-gold transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="hover:text-bronze-gold transition"><Globe size={20} /></button>
            <button className="hover:text-bronze-gold transition"><ShoppingBag size={20} /></button>
            <button className="border border-white/20 px-4 py-1.5 rounded-full text-xs uppercase tracking-wider hover:bg-bronze-gold hover:text-black hover:border-bronze-gold transition-all flex items-center gap-2">
              <User size={14} /> Connect
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-ink-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 animate-fade-in">
            {NavLinks.map((link) => (
              <Link key={link.path} to={link.path} className="text-lg font-display uppercase tracking-widest text-center py-2 border-b border-white/5">
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black/80 border-t border-white/10 pt-16 pb-8 text-center md:text-left relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-bronze-gold to-transparent opacity-50"></div>
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          <div>
            <h4 className="font-display text-bronze-gold text-2xl mb-4">VIET HERITAGE</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Bridging the gap between ancient traditions and future technology. 
              Preserving the soul of Vietnam in the digital era.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-white uppercase tracking-widest text-sm mb-4">Explore</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/history" className="hover:text-bronze-gold transition">Timeline</Link></li>
              <li><Link to="/map" className="hover:text-bronze-gold transition">Interactive Map</Link></li>
              <li><Link to="/ai" className="hover:text-bronze-gold transition">AI Studio</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white uppercase tracking-widest text-sm mb-4">Community</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-bronze-gold transition">Events</a></li>
              <li><a href="#" className="hover:text-bronze-gold transition">Marketplace</a></li>
              <li><a href="#" className="hover:text-bronze-gold transition">Artisans</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white uppercase tracking-widest text-sm mb-4">Daily Wisdom</h5>
            <blockquote className="italic text-gray-400 font-serif border-l-2 border-bronze-gold pl-4">
              "Uống nước nhớ nguồn" 
              <br />
              <span className="text-xs not-italic text-gray-500 mt-1 block">(When drinking water, remember the source)</span>
            </blockquote>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 text-center text-xs text-gray-600 uppercase tracking-widest">
          © {new Date().getFullYear()} Viet Heritage Hub. Neo-Heritage Design System.
        </div>
      </footer>
    </div>
  );
};
