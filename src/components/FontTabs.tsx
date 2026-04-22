import React from 'react';
import { X, Plus } from 'lucide-react';
import { useFontStore } from '../store/fontStore';

interface FontTabsProps {
  onAddFont: () => void;
}

export const FontTabs: React.FC<FontTabsProps> = ({ onAddFont }) => {
  const { fonts, currentFontIndex, setCurrentFont, removeFont } = useFontStore();

  if (fonts.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-gray-700 bg-gray-800">
      <div className="container mx-auto px-4 flex items-center gap-2 overflow-x-auto py-0">
        {fonts.map((font, index) => (
          <div
            key={font.id}
            onClick={() => setCurrentFont(index)}
            className={`flex items-center gap-2 px-4 py-3 cursor-pointer border-b-2 transition-colors whitespace-nowrap ${
              index === currentFontIndex
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">
                {font.metadata.familyName}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {font.metadata.styleName}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFont(font.id);
              }}
              className="p-1 hover:bg-gray-700 rounded ml-1 flex-shrink-0"
              title="Remove font"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button
          onClick={onAddFont}
          className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg ml-auto flex-shrink-0"
          title="Add more fonts"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Add</span>
        </button>
      </div>
    </div>
  );
};
