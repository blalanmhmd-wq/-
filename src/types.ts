export type BannerData = {
  headline: string;
  subheadline: string;
  cta: string;
  imagePrompt: string;
  theme: {
    background: string;
    text: string;
    ctaBackground: string;
    ctaText: string;
  };
};

export const STANDARD_BANNERS = [
  { name: 'Medium Rectangle', width: 300, height: 250 },
  { name: 'Leaderboard', width: 728, height: 90 },
  { name: 'Wide Skyscraper', width: 160, height: 600 },
  { name: 'Half Page', width: 300, height: 600 },
  { name: 'Large Rectangle', width: 336, height: 280 },
];
