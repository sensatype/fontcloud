import React, { useState } from 'react';
import { useFontStore } from './store/fontStore';
import { FontUploader } from './components/FontUploader';
import { FontTabs } from './components/FontTabs';
import { GlyphGrid } from './components/GlyphGrid';
import { OpenTypeFeatures } from './components/OpenTypeFeatures';
import { FontPreview } from './components/FontPreview';

function App() {
  const { fonts, getCurrentFont } = useFontStore();
  const currentFont = getCurrentFont();
  const [showUploader, setShowUploader] = useState(fonts.length === 0);

  return (
    <div className="min-h-screen dark bg-gray-900 text-white">
      <header className="border-b border-gray-700 bg-gray-900">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Font Manager</h1>
        </div>
      </header>

      {fonts.length > 0 && <FontTabs onAddFont={() => setShowUploader(true)} />}

      <main className="container mx-auto px-4 py-8">
        {fonts.length === 0 ? (
          <FontUploader />
        ) : (
          <div className="space-y-8">
            {showUploader && (
              <div className="mb-8">
                <FontUploader showTitle />
                <button
                  onClick={() => setShowUploader(false)}
                  className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-200 transition-colors"
                >
                  Done Adding Fonts
                </button>
              </div>
            )}

            {currentFont && (
              <>
                <FontPreview />
                <GlyphGrid />
                <OpenTypeFeatures />
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;