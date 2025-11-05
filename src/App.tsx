import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useFontStore } from './store/fontStore';
import { FontUploader } from './components/FontUploader';
import { GlyphGrid } from './components/GlyphGrid';
import { OpenTypeFeatures } from './components/OpenTypeFeatures';
import { FontPreview } from './components/FontPreview';

function App() {
  const { isDarkMode, toggleDarkMode, metadata } = useFontStore();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className="border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Font Manager</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isDarkMode ? <Sun /> : <Moon />}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!metadata ? (
          <FontUploader />
        ) : (
          <div className="space-y-8">
            <FontPreview />
            <GlyphGrid />
            <OpenTypeFeatures />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;