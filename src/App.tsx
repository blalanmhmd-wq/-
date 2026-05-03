import { useState } from 'react';
import { generateBannerCopy, generateBannerImage } from './services/geminiService';
import { BannerData, STANDARD_BANNERS } from './types';
import { Banner } from './components/Banner';
import { Layout, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [resultData, setResultData] = useState<(BannerData & { imageUrl: string }) | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description && !url) return;

    setIsGenerating(true);
    setResultData(null);
    try {
      setLoadingStep('Analyzing product and writing copy');
      const bannerData = await generateBannerCopy(description, url);

      setLoadingStep('Generating background artwork');
      const imageUrl = await generateBannerImage(bannerData.imagePrompt);

      setResultData({
        ...bannerData,
        imageUrl,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to generate banners. Please try again.');
    } finally {
      setIsGenerating(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-slate-900 font-sans font-medium selection:bg-indigo-500 selection:text-white">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              <Layout size={18} />
            </div>
            <span className="font-bold tracking-tight text-lg">BannerGen AI</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 flex flex-col xl:flex-row gap-12 items-start">
        {/* Left Side: Form */}
        <div className="w-full xl:w-[400px] shrink-0 xl:sticky top-24">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">Create Banners</h1>
              <p className="text-sm text-slate-500 font-normal">
                Enter your product details and well generate copy, artwork, and full HTML/CSS layouts for 5 standard banner sizes.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Product Description *
                </label>
                <textarea
                  required
                  placeholder="e.g. A revolutionary smart mug that keeps your coffee at the perfect temperature all day."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Product URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/product"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating || (!description && !url)}
                className="mt-2 flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3.5 rounded-xl font-bold shadow-md transition-colors disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate Banners</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Generated Previews */}
        <div className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-[400px] flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                  <Loader2 size={48} className="text-indigo-600 animate-spin relative" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Crafting your banners</h3>
                  <p className="text-slate-500 mt-1 animate-pulse">{loadingStep}...</p>
                </div>
              </motion.div>
            ) : resultData ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
                className="space-y-12"
              >
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
                   <h3 className="font-bold text-lg mb-4">Generated Assets</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Headline</div>
                        <div className="text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">{resultData.headline}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Subheadline</div>
                        <div className="text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">{resultData.subheadline}</div>
                      </div>
                      <div className="space-y-2">
                         <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Primary ImagePrompt</div>
                         <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-slate-600 truncate" title={resultData.imagePrompt}>{resultData.imagePrompt}</div>
                      </div>
                      <div className="space-y-2">
                         <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Color Palette</div>
                         <div className="flex items-center gap-2">
                            <ColorSwatch color={resultData.theme.background} name="Bg" />
                            <ColorSwatch color={resultData.theme.text} name="Text" />
                            <ColorSwatch color={resultData.theme.ctaBackground} name="CTA Bg" />
                            <ColorSwatch color={resultData.theme.ctaText} name="CTA Text" />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-10">
                  {STANDARD_BANNERS.map((banner, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={banner.name}
                      className="flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold">{banner.name}</h4>
                        <span className="text-xs font-mono bg-slate-200 text-slate-700 px-2 py-1 rounded">
                          {banner.width} × {banner.height}
                        </span>
                      </div>
                      
                      <div className="w-full overflow-x-auto bg-[#e5e5e5] rounded-xl p-8 border border-slate-200">
                        <div className="mx-auto" style={{ width: banner.width }}>
                          <Banner width={banner.width} height={banner.height} data={resultData} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center text-center text-slate-400">
                <Layout size={48} className="mb-4 opacity-20" />
                <p>Enter your product details to generate previews.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function ColorSwatch({ color, name }: { color: string, name: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div 
        className="w-8 h-8 rounded-full border border-slate-200 shadow-sm"
        style={{ backgroundColor: color }}
        title={color}
      />
      <span className="text-[10px] uppercase text-slate-500">{name}</span>
    </div>
  )
}

