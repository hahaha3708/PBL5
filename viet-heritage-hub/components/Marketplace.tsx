import React from 'react';
import { ShoppingCart, Star, Filter } from 'lucide-react';
import { Product } from '../types';

const products: Product[] = [
  { id: '1', name: 'Lacquer Vase "Lotus"', artisan: 'Nguyen Minh', price: 120, category: 'Lacquer', image: 'https://picsum.photos/300/400?random=10' },
  { id: '2', name: 'Silk Ao Dai - White', artisan: 'Silk Village', price: 85, category: 'Clothing', image: 'https://picsum.photos/300/400?random=11' },
  { id: '3', name: 'Bronze Drum Replica', artisan: 'Dong Son Arts', price: 350, category: 'Decor', image: 'https://picsum.photos/300/400?random=12' },
  { id: '4', name: 'Bamboo Tea Set', artisan: 'EcoCraft', price: 45, category: 'Home', image: 'https://picsum.photos/300/400?random=13' },
  { id: '5', name: 'Embroidered Painting', artisan: 'XQ Da Lat', price: 200, category: 'Art', image: 'https://picsum.photos/300/400?random=14' },
  { id: '6', name: 'Ceramic Tea Pot', artisan: 'Bat Trang', price: 60, category: 'Ceramics', image: 'https://picsum.photos/300/400?random=15' },
];

export const Marketplace: React.FC = () => {
  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-display text-4xl mb-2">Artisan Marketplace</h1>
            <p className="text-gray-400 font-serif italic">Curated collections from Vietnam's master craft villages.</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
             <button className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded hover:border-bronze-gold transition text-sm uppercase tracking-widest">
                <Filter size={16} /> Filter
             </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <div key={p.id} className="group relative bg-white/5 rounded-sm overflow-hidden border border-white/5 hover:border-bronze-gold/50 transition-all duration-300">
              <div className="relative h-[400px] overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur px-3 py-1 text-bronze-gold text-sm font-bold">
                  ${p.price}
                </div>
                {/* Overlay Action */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button className="bg-white text-black p-3 rounded-full hover:bg-bronze-gold transition"><ShoppingCart size={20}/></button>
                  <button className="bg-white text-black p-3 rounded-full hover:bg-bronze-gold transition"><Star size={20}/></button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-xs text-bronze-gold uppercase tracking-widest mb-1">{p.category}</div>
                <h3 className="font-display text-xl mb-1">{p.name}</h3>
                <p className="text-gray-500 text-sm">By {p.artisan}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
