import { useState, useCallback, useEffect } from 'react';
import { Glyph } from '../types/font';

export function useSelection() {
  const [selectedGlyphs, setSelectedGlyphs] = useState<Set<number>>(new Set());

  const toggleSelection = useCallback((glyphIndex: number, multiSelect: boolean) => {
    setSelectedGlyphs(prev => {
      const next = new Set(multiSelect ? prev : []);
      if (prev.has(glyphIndex)) {
        next.delete(glyphIndex);
      } else {
        next.add(glyphIndex);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback((glyphs: Glyph[]) => {
    setSelectedGlyphs(new Set(glyphs.map(g => g.index)));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedGlyphs(new Set());
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        // Trigger select all - needs to be handled by parent component
        document.dispatchEvent(new CustomEvent('selectAllGlyphs'));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    selectedGlyphs,
    toggleSelection,
    selectAll,
    clearSelection
  };
}