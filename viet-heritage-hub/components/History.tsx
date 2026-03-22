import React, { useState } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Scroll, Info, ChevronRight } from 'lucide-react';

const dynasticData = [
  { name: 'Ngo', start: 938, power: 40 },
  { name: 'Dinh', start: 968, power: 50 },
  { name: 'Early Le', start: 980, power: 60 },
  { name: 'Ly', start: 1009, power: 85 },
  { name: 'Tran', start: 1225, power: 95 },
  { name: 'Ho', start: 1400, power: 50 },
  { name: 'Later Le', start: 1428, power: 90 },
  { name: 'Nguyen', start: 1802, power: 70 },
];

const dynasties = [
  { id: 'ly', name: 'Ly Dynasty', period: '1009–1225', desc: 'The Golden Era of Buddhism and Art.', color: 'border-yellow-500' },
  { id: 'tran', name: 'Tran Dynasty', period: '1225–1400', desc: 'Defenders against the Mongol Empire.', color: 'border-red-600' },
  { id: 'le', name: 'Le Dynasty', period: '1428–1789', desc: 'Renaissance of Literature and Law.', color: 'border-blue-500' },
  { id: 'nguyen', name: 'Nguyen Dynasty', period: '1802–1945', desc: 'Unification and Imperial Grandeur.', color: 'border-purple-500' },
];

export const HistoryModule: React.FC = () => {
  const [activeDynasty, setActiveDynasty] = useState(dynasties[0]);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?grayscale&blur=2')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink-black via-transparent to-transparent"></div>
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="font-display text-5xl md:text-7xl text-bronze-gold mb-4 tracking-tight drop-shadow-lg">The River of Time</h1>
          <p className="text-xl md:text-2xl font-serif italic text-gray-300">"Thousands of years of civilization, etched in stone and spirit."</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Navigation */}
          <div className="lg:col-span-3 glass-panel p-6 rounded-lg sticky top-24 h-fit">
            <h3 className="text-bronze-gold font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Scroll size={18} /> Eras
            </h3>
            <ul className="space-y-4">
              {dynasties.map((d) => (
                <li key={d.id}>
                  <button 
                    onClick={() => setActiveDynasty(d)}
                    className={`w-full text-left p-4 border-l-2 transition-all duration-300 group hover:bg-white/5 ${activeDynasty.id === d.id ? `${d.color} bg-white/5` : 'border-white/10 text-gray-500'}`}
                  >
                    <div className="font-display text-lg group-hover:text-white transition-colors">{d.name}</div>
                    <div className="text-xs text-gray-400 font-mono mt-1">{d.period}</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Detailed Content */}
          <div className="lg:col-span-9 space-y-8">
            {/* Viz Chart */}
            <div className="glass-panel p-6 rounded-lg border border-bronze-gold/20">
              <div className="flex justify-between items-end mb-4">
                <h2 className="font-display text-3xl">{activeDynasty.name}</h2>
                <span className="text-bronze-gold font-mono text-xl">{activeDynasty.period}</span>
              </div>
              <p className="text-gray-300 text-lg mb-8 font-serif leading-relaxed border-b border-white/10 pb-6">
                {activeDynasty.desc}
              </p>
              
              <div className="h-64 w-full">
                 <h4 className="text-xs uppercase text-gray-500 mb-2">Dynastic Influence Visualization</h4>
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dynasticData}>
                      <defs>
                        <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C5A059" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="start" stroke="#555" tick={{fill: '#555'}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0F172A', borderColor: '#C5A059', color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="power" stroke="#C5A059" fillOpacity={1} fill="url(#colorPower)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
            </div>

            {/* Artifact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="glass-panel p-6 rounded-lg group cursor-pointer overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                  <img src="https://picsum.photos/400/300?random=1" className="w-full h-48 object-cover rounded opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 mb-4" alt="Artifact" />
                  <div className="relative z-20">
                    <h4 className="font-display text-xl mb-1">Imperial Ceramics</h4>
                    <p className="text-sm text-gray-400">Blue and white porcelain patterns distinctive to this era.</p>
                  </div>
               </div>
               <div className="glass-panel p-6 rounded-lg group cursor-pointer overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                  <img src="https://picsum.photos/400/300?random=2" className="w-full h-48 object-cover rounded opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 mb-4" alt="Architecture" />
                  <div className="relative z-20">
                    <h4 className="font-display text-xl mb-1">Pagoda Architecture</h4>
                    <p className="text-sm text-gray-400">Curved roofs and intricate wood carving techniques.</p>
                  </div>
               </div>
            </div>
            
            {/* Deep Dive Action */}
            <button className="w-full py-6 border border-white/20 hover:border-bronze-gold hover:bg-white/5 transition-all flex items-center justify-center gap-2 group text-gray-300 hover:text-white uppercase tracking-widest">
               Explore Full Archives <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
