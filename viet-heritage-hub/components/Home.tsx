import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Map, Clock, Users, Cpu } from 'lucide-react';
import { RoutePath } from '../types';

export const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-cinematic z-10"></div>
          {/* Background Video Placeholder */}
          <div className="w-full h-full bg-[url('https://picsum.photos/1920/1080?random=20&blur=2')] bg-cover bg-center opacity-60"></div>
        </div>

        <div className="relative z-20 text-center max-w-5xl px-6 animate-fade-in-up">
          <div className="w-24 h-1 bg-bronze-gold mx-auto mb-8"></div>
          <h1 className="font-display text-5xl md:text-8xl leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-2xl">
            VIETNAM <br />
            <span className="text-bronze-gold italic font-serif text-4xl md:text-6xl">Timeless & Infinite</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 font-light tracking-wide max-w-2xl mx-auto">
            A digital sanctuary preserving 4,000 years of history. Experience the intersection of ancient heritage and artificial intelligence.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link to={RoutePath.HISTORY} className="px-8 py-3 bg-bronze-gold text-ink-black font-bold uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)]">
              Begin Journey
            </Link>
            <Link to={RoutePath.AI} className="px-8 py-3 border border-white/30 hover:border-bronze-gold hover:text-bronze-gold transition-all uppercase tracking-widest backdrop-blur-sm">
              Enter AI Studio
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500">
           <span className="text-[10px] uppercase tracking-widest mb-2 block">Scroll</span>
           <div className="w-[1px] h-12 bg-gray-500 mx-auto"></div>
        </div>
      </section>

      {/* Bento Grid Navigation */}
      <section className="py-24 bg-ink-black relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
            
            {/* History - Large Tile */}
            <Link to={RoutePath.HISTORY} className="md:col-span-2 md:row-span-2 group relative rounded-xl overflow-hidden border border-white/5 hover:border-bronze-gold/30 transition-all">
               <div className="absolute inset-0 bg-[url('https://picsum.photos/800/800?random=1')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
               <div className="absolute bottom-0 left-0 p-8">
                 <Clock className="text-bronze-gold mb-4" size={32} />
                 <h3 className="font-display text-3xl mb-2 group-hover:text-bronze-gold transition-colors">Time Portal</h3>
                 <p className="text-gray-400 text-sm max-w-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                   Traverse the Dynasties. From the Bronze Drums of Dong Son to the Imperial City of Hue.
                 </p>
               </div>
            </Link>

            {/* Map - Wide Tile */}
            <Link to={RoutePath.MAP} className="md:col-span-2 group relative rounded-xl overflow-hidden border border-white/5 hover:border-bronze-gold/30 transition-all">
               <div className="absolute inset-0 bg-[url('https://picsum.photos/800/400?random=2')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"></div>
               <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors"></div>
               <div className="absolute bottom-0 left-0 p-6">
                 <div className="flex items-center gap-3">
                   <Map className="text-jade-green" size={24} />
                   <h3 className="font-display text-2xl group-hover:text-jade-green transition-colors">Cultural Atlas</h3>
                 </div>
               </div>
            </Link>

            {/* AI - Small Tile */}
            <Link to={RoutePath.AI} className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-bronze-gold/30 transition-all bg-deep-indigo">
               <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                  <Cpu size={100} />
               </div>
               <div className="absolute bottom-0 left-0 p-6">
                 <Cpu className="text-purple-400 mb-2" size={24} />
                 <h3 className="font-display text-xl mb-1">AI Studio</h3>
                 <span className="text-xs uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Create & Restore</span>
               </div>
            </Link>

            {/* Community - Small Tile */}
            <Link to={RoutePath.COMMUNITY} className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-bronze-gold/30 transition-all bg-lacquer-red/20">
               <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                  <Users size={100} />
               </div>
               <div className="absolute bottom-0 left-0 p-6">
                 <Users className="text-lacquer-red mb-2" size={24} />
                 <h3 className="font-display text-xl mb-1">Community</h3>
                 <span className="text-xs uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Events & Tribes</span>
               </div>
            </Link>

          </div>
        </div>
      </section>
      
      {/* Quote Section */}
      <section className="py-20 bg-texture-paper bg-rice-paper text-ink-black text-center">
         <div className="container mx-auto px-6">
            <h2 className="font-display text-3xl md:text-5xl mb-6">"Preserving the past is building the future."</h2>
            <Link to={RoutePath.MARKETPLACE} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest border-b border-ink-black pb-1 hover:text-lacquer-red hover:border-lacquer-red transition-all">
               Support Local Artisans <ArrowRight size={14} />
            </Link>
         </div>
      </section>
    </div>
  );
};
