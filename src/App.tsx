import React from 'react';
import { useFontStore } from './store/fontStore';
import { FontUploader } from './components/FontUploader';
import { GlyphGrid } from './components/GlyphGrid';
import { OpenTypeFeatures } from './components/OpenTypeFeatures';
import { FontPreview } from './components/FontPreview';

function App() {
  const { metadata } = useFontStore();

  return (
    <div className="min-h-screen dark bg-gray-900 text-white">
      <header className="border-b border-gray-700 bg-gray-900">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Font Manager</h1>
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