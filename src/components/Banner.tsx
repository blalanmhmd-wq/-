import { BannerData } from '../types';

interface BannerProps {
  width: number;
  height: number;
  data: BannerData & { imageUrl: string };
}

export function Banner({ width, height, data }: BannerProps) {
  const aspect = width / height;
  const isLeaderboard = aspect > 3; // e.g. 728x90 (8.08)
  const isSkyscraper = aspect < 0.5; // e.g. 160x600 (0.26)
  const isTall = aspect >= 0.5 && aspect < 1; // e.g. 300x600 (0.5)

  // Leaderboard layout
  if (isLeaderboard) {
    return (
      <div
        className="flex overflow-hidden relative box-border"
        style={{ width, height, backgroundColor: data.theme.background, color: data.theme.text }}
      >
        <div className="w-1/4 h-full relative shrink-0">
          <img src={data.imageUrl} className="w-full h-full object-cover absolute inset-0" alt="" referrerPolicy="no-referrer" />
        </div>
        <div className="flex-1 flex flex-row items-center justify-between px-6">
          <div className="flex flex-col pr-4">
            <h2 className="text-xl font-bold leading-tight line-clamp-1">{data.headline}</h2>
            <p className="text-sm opacity-90 line-clamp-1 mt-0.5">{data.subheadline}</p>
          </div>
          <button
            className="px-6 py-2 text-sm font-bold uppercase tracking-wide rounded-md whitespace-nowrap shrink-0 shadow-sm"
            style={{ backgroundColor: data.theme.ctaBackground, color: data.theme.ctaText }}
          >
            {data.cta}
          </button>
        </div>
      </div>
    );
  }

  // Skyscraper (Very narrow) layout
  if (isSkyscraper) {
    return (
      <div
        className="flex flex-col overflow-hidden relative box-border"
        style={{ width, height, backgroundColor: data.theme.background, color: data.theme.text }}
      >
        <div className="w-full h-[30%] relative shrink-0">
          <img src={data.imageUrl} className="w-full h-full object-cover absolute inset-0" alt="" referrerPolicy="no-referrer" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <h2 className="text-lg font-bold leading-tight mb-2 line-clamp-3">{data.headline}</h2>
          <p className="text-xs opacity-90 line-clamp-4 mb-6">{data.subheadline}</p>
          <button
            className="w-full py-2.5 px-2 text-xs font-bold uppercase tracking-wide rounded shadow-sm mt-auto"
            style={{ backgroundColor: data.theme.ctaBackground, color: data.theme.ctaText }}
          >
            {data.cta}
          </button>
        </div>
      </div>
    );
  }

  // Box / Rectangle / Half Page Layout
  return (
    <div
      className="flex flex-col overflow-hidden relative box-border"
      style={{ width, height, backgroundColor: data.theme.background, color: data.theme.text }}
    >
      <div className={`w-full relative shrink-0 ${isTall ? 'h-[40%]' : 'h-[50%]'}`}>
        <img src={data.imageUrl} className="w-full h-full object-cover absolute inset-0" alt="" referrerPolicy="no-referrer" />
      </div>
      <div className="flex-1 flex flex-col p-5">
        <h2 className={`${isTall ? 'text-2xl' : 'text-xl'} font-bold leading-tight mb-2 line-clamp-2`}>{data.headline}</h2>
        <p className={`${isTall ? 'text-base' : 'text-sm'} opacity-90 line-clamp-2`}>{data.subheadline}</p>
        <div className="mt-auto">
          <button
            className="w-full py-3 px-4 text-sm font-bold uppercase tracking-wide rounded-md shadow-sm transition-transform"
            style={{ backgroundColor: data.theme.ctaBackground, color: data.theme.ctaText }}
          >
            {data.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
