import { GoogleGenAI, Type } from '@google/genai';
import { BannerData } from '../types';

// Use standard API Key fetching as instructed pattern
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateBannerCopy(description: string, url: string): Promise<BannerData> {
  const prompt = `Based on the following product description and URL, generate highly engaging, concise copy for a banner ad. Also create an image prompt that we will use to generate the background/product artwork. The image prompt must be visually striking, suitable as a banner background or product showcase, and MUST NOT include instructions to render text. Pick a high-contrast, professional color theme suitable for the brand or product.

Description: ${description}
URL: ${url ? url : 'N/A'}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING, description: 'Max 50 characters' },
          subheadline: { type: Type.STRING, description: 'Max 80 characters' },
          cta: { type: Type.STRING, description: 'Short CTA, max 15 chars, e.g. Buy Now' },
          imagePrompt: { type: Type.STRING, description: 'Prompt for an AI image generator to create the ad artwork. No text.' },
          theme: {
            type: Type.OBJECT,
            properties: {
              background: { type: Type.STRING, description: 'Hex color for banner background' },
              text: { type: Type.STRING, description: 'Hex color for text' },
              ctaBackground: { type: Type.STRING, description: 'Hex color for CTA button background' },
              ctaText: { type: Type.STRING, description: 'Hex color for CTA button text' },
            },
            required: ['background', 'text', 'ctaBackground', 'ctaText'],
          },
        },
        required: ['headline', 'subheadline', 'cta', 'imagePrompt', 'theme'],
      },
      tools: [{ googleSearch: {} }],
    },
  });

  if (!response.text) {
    throw new Error('Failed to generate banner copy');
  }

  return JSON.parse(response.text) as BannerData;
}

export async function generateBannerImage(imagePrompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: imagePrompt },
      ],
    },
  });

  if (response.candidates && response.candidates[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error('Failed to generate image');
}
