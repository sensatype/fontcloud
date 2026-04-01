import React, { useState, useCallback, useRef } from 'react';
import { Search, ZoomIn, ZoomOut, Check } from 'lucide-react';
import { useFontStore } from '../store/fontStore';
import { useFont } from '../hooks/useFont';
import { useClipboard } from '../hooks/useClipboard';
import { useSelection } from '../hooks/useSelection';
import { SelectionToolbar } from './SelectionToolbar';
import { Glyph } from '../types/font';

export const GlyphGrid: React.FC = () => {
  const { glyphs, metadata } = useFontStore();
  const { isLoading } = useFont();
  const { copied, copyToClipboard } = useClipboard();
  const { selectedGlyphs, toggleSelection, selectAll, clearSelection } = useSelection();
  const [search, setSearch] = useState('');
  const [zoom, setZoom] = useState(1);
  const [category, setCategory] = useState<string>('all');
  const toolbarRef = useRef<HTMLDivElement>(null);

  const categories = ['all', ...new Set(glyphs.map(g => g.category))];
  
  const filteredGlyphs = glyphs.filter(glyph => {
    const matchesSearch = glyph.name.toLowerCase().includes(search.toLowerCase()) ||
      glyph.unicode.toString(16).includes(search.toLowerCase());
    const matchesCategory = category === 'all' || glyph.category === category;
    return matchesSearch && matchesCategory;
  });

  const fontStyle = metadata ? {
    fontFamily: metadata.familyName,
    fontSize: `${2 * zoom}rem`
  } : undefined;

  const gridStyle = {
    gap: `${1 * zoom}rem`,
    gridTemplateColumns: `repeat(auto-fill, minmax(${Math.max(80, 100 * zoom)}px, 1fr))`
  };

  const handleGlyphClick = useCallback((glyph: Glyph, event: React.MouseEvent) => {
    if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
      const char = String.fromCodePoint(glyph.unicode);
      copyToClipboard(char, glyph.index);
    } else {
      toggleSelection(glyph.index, true);
    }
  }, [toggleSelection, copyToClipboard]);

  const handleCopy = useCallback(() => {
    const selectedChars = filteredGlyphs
      .filter(glyph => selectedGlyphs.has(glyph.index))
      .map(glyph => String.fromCodePoint(glyph.unicode))
      .join('');
    
    copyToClipboard(selectedChars, -1);
    clearSelection();
  }, [filteredGlyphs, selectedGlyphs, copyToClipboard, clearSelection]);

  // Handle keyboard shortcut
  React.useEffect(() => {
    const handleSelectAll = () => selectAll(filteredGlyphs);
    document.addEventListener('selectAllGlyphs', handleSelectAll);
    return () => document.removeEventListener('selectAllGlyphs', handleSelectAll);
  }, [filteredGlyphs, selectAll]);

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <div className="sticky top-0 z-10 bg-gray-900 p-4 -mx-4 -mt-4 mb-4 border-b border-gray-700 shadow-sm">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search glyphs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-600 rounded-lg px-4 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
            className="p-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700"
            title="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <div className="flex items-center px-2 text-gray-300 font-medium min-w-[50px] justify-center">
            {(zoom * 100).toFixed(0)}%
          </div>
          <button
            onClick={() => setZoom(z => Math.min(3, z + 0.1))}
            className="p-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700"
            title="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <div className="ml-auto" ref={toolbarRef}>
            <SelectionToolbar
              selectedCount={selectedGlyphs.size}
              onCopy={handleCopy}
              onClear={clearSelection}
              onSelectAll={() => selectAll(filteredGlyphs)}
            />
          </div>
        </div>
      </div>

      <div
        className="grid"
        style={gridStyle}
      >
        {filteredGlyphs.map((glyph) => (
          <button
            key={glyph.index}
            onClick={(e) => handleGlyphClick(glyph, e)}
            className={`relative aspect-square border rounded-lg p-2 transition-all flex flex-col items-center justify-center ${
              selectedGlyphs.has(glyph.index)
                ? 'bg-blue-900/20 border-blue-400 shadow-md'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500 hover:shadow-sm'
            }`}
            title={`Click to copy, ${navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Click to select`}
          >
            <div className="mb-2 leading-none text-white" style={fontStyle}>
              {String.fromCodePoint(glyph.unicode)}
            </div>
            <div className="text-xs text-gray-400 mt-auto">
              U+{glyph.unicode.toString(16).toUpperCase()}
            </div>
            {copied === glyph.index && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-500/10 rounded-lg">
                <Check className="w-6 h-6 text-green-500" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};