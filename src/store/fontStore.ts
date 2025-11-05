import { create } from 'zustand';
import { FontMetadata, Glyph, OpenTypeFeature } from '../types/font';

interface FontState {
  currentFont: ArrayBuffer | null;
  metadata: FontMetadata | null;
  glyphs: Glyph[];
  features: OpenTypeFeature[];
  isDarkMode: boolean;
  setFont: (font: ArrayBuffer) => void;
  setMetadata: (metadata: FontMetadata) => void;
  setGlyphs: (glyphs: Glyph[]) => void;
  setFeatures: (features: OpenTypeFeature[]) => void;
  toggleDarkMode: () => void;
}

export const useFontStore = create<FontState>((set) => ({
  currentFont: null,
  metadata: null,
  glyphs: [],
  features: [],
  isDarkMode: false,
  setFont: (font) => set({ currentFont: font }),
  setMetadata: (metadata) => set({ metadata }),
  setGlyphs: (glyphs) => set({ glyphs }),
  setFeatures: (features) => set({ features }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));