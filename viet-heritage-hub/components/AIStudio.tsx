import React, { useState } from 'react';
import { generateCalligraphyMeaning } from '../services/geminiService';
import { Sparkles, PenTool, Loader2, Share2, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const AIStudio: React.FC = () => {
  const [inputWord, setInputWord] = useState('');
  const [style, setStyle] = useState('Thư pháp (Traditional Calligraphy)');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!inputWord.trim()) return;
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateCalligraphyMeaning(inputWord, style);
      setResult(response);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-12 pb-20 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]">
      <div className="container mx-auto px-6 max-w-6xl">
        <header className="mb-12 text-center">
          <span className="text-bronze-gold uppercase tracking-[0.4em] text-xs font-bold mb-2 block">Powered by Gemini AI</span>
          <h1 className="font-display text-4xl md:text-6xl mb-4">The Digital Scribe</h1>
          <p className="text-gray-400 max-w-2xl mx-auto font-serif italic">
            "Enter a word, and let the AI spirit reveal its soul through the lens of Vietnamese philosophy."
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Input Panel */}
          <div className="glass-panel p-8 rounded-xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lacquer-red to-bronze-gold"></div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Your Intention (Word/Phrase)</label>
                <input 
                  type="text" 
                  value={inputWord}
                  onChange={(e) => setInputWord(e.target.value)}
                  placeholder="e.g., Peace, Family, Resilience"
                  className="w-full bg-black/50 border border-white/10 p-4 rounded text-white focus:outline-none focus:border-bronze-gold transition-colors font-display text-lg"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Artistic Style</label>
                <div className="grid grid-cols-2 gap-3">
                   {['Thư pháp (Traditional)', 'Modern Minimalist', 'Imperial Seal', 'Bamboo Script'].map((s) => (
                     <button 
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`p-3 text-sm border rounded transition-all ${style === s ? 'border-bronze-gold bg-bronze-gold/10 text-white' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
                     >
                       {s}
                     </button>
                   ))}
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isLoading || !inputWord}
                className={`w-full py-4 rounded font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isLoading || !inputWord ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-bronze-gold text-black hover:bg-white hover:shadow-[0_0_20px_rgba(197,160,89,0.5)]'}`}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <><PenTool size={18} /> Ink The Meaning</>}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="min-h-[500px] glass-panel p-8 rounded-xl border border-white/10 relative flex flex-col items-center justify-center text-center">
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bronze-gold via-transparent to-transparent"></div>
            
            {result ? (
              <div className="w-full h-full flex flex-col text-left animate-fade-in">
                <div className="prose prose-invert prose-headings:font-display prose-headings:text-bronze-gold prose-p:font-serif prose-p:text-gray-300 max-w-none">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/10 flex gap-4 justify-end">
                  <button className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-white transition"><Share2 size={14}/> Share</button>
                  <button className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-white transition"><Download size={14}/> Save</button>
                </div>
              </div>
            ) : (
              <div className="text-gray-600 flex flex-col items-center">
                <Sparkles size={48} className="mb-4 opacity-20" />
                <p className="font-serif italic text-lg">The scroll is waiting for your ink.</p>
                <p className="text-xs uppercase tracking-widest mt-2 opacity-50">Generate deep cultural insights</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
