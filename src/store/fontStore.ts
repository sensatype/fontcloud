import { create } from 'zustand';
import { FontMetadata, Glyph, OpenTypeFeature, Font } from '../types/font';

interface FontState {
  fonts: Font[];
  currentFontIndex: number;
  isDarkMode: boolean;

  // Multi-font methods
  addFont: (font: Font) => void;
  removeFont: (id: string) => void;
  setCurrentFont: (index: number) => void;

  // Backward compatibility methods (operate on current font)
  setFont: (font: ArrayBuffer) => void;
  setMetadata: (metadata: FontMetadata) => void;
  setGlyphs: (glyphs: Glyph[]) => void;
  setFeatures: (features: OpenTypeFeature[]) => void;

  // Computed getters
  getCurrentFont: () => Font | null;

  toggleDarkMode: () => void;
}

export const useFontStore = create<FontState>((set, get) => ({
  fonts: [],
  currentFontIndex: -1,
  isDarkMode: false,

  addFont: (font) => set((state) => ({
    fonts: [...state.fonts, font],
    currentFontIndex: state.currentFontIndex === -1 ? 0 : state.currentFontIndex,
  })),

  removeFont: (id) => set((state) => {
    const newFonts = state.fonts.filter((f) => f.id !== id);
    const newIndex = Math.max(0, state.currentFontIndex - 1);
    return {
      fonts: newFonts,
      currentFontIndex: newFonts.length === 0 ? -1 : Math.min(newIndex, newFonts.length - 1),
    };
  }),

  setCurrentFont: (index) => set((state) => ({
    currentFontIndex: Math.max(-1, Math.min(index, state.fonts.length - 1)),
  })),

  setFont: (font) => set((state) => {
    if (state.currentFontIndex === -1) return state;
    const newFonts = [...state.fonts];
    newFonts[state.currentFontIndex] = {
      ...newFonts[state.currentFontIndex],
      buffer: font,
    };
    return { fonts: newFonts };
  }),

  setMetadata: (metadata) => set((state) => {
    if (state.currentFontIndex === -1) return state;
    const newFonts = [...state.fonts];
    newFonts[state.currentFontIndex] = {
      ...newFonts[state.currentFontIndex],
      metadata,
    };
    return { fonts: newFonts };
  }),

  setGlyphs: (glyphs) => set((state) => {
    if (state.currentFontIndex === -1) return state;
    const newFonts = [...state.fonts];
    newFonts[state.currentFontIndex] = {
      ...newFonts[state.currentFontIndex],
      glyphs,
    };
    return { fonts: newFonts };
  }),

  setFeatures: (features) => set((state) => {
    if (state.currentFontIndex === -1) return state;
    const newFonts = [...state.fonts];
    newFonts[state.currentFontIndex] = {
      ...newFonts[state.currentFontIndex],
      features,
    };
    return { fonts: newFonts };
  }),

  getCurrentFont: () => {
    const state = get();
    if (state.currentFontIndex === -1 || !state.fonts[state.currentFontIndex]) {
      return null;
    }
    return state.fonts[state.currentFontIndex];
  },

  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));