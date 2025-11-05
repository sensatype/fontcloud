import React, { useCallback, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { useFontStore } from '../store/fontStore';
import { parseFontFile } from '../utils/fontParser';

export const FontUploader: React.FC = () => {
  const { setFont, setMetadata, setGlyphs, setFeatures } = useFontStore();
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      const buffer = await file.arrayBuffer();
      const { metadata, glyphs, features } = await parseFontFile(buffer);
      
      setFont(buffer);
      setMetadata(metadata);
      setGlyphs(glyphs);
      setFeatures(features);
    } catch (error) {
      console.error('Error processing font:', error);
      setError('Failed to process font file. Please ensure it\'s a valid font file (TTF, OTF, WOFF, or WOFF2).');
    }
  }, [setFont, setMetadata, setGlyphs, setFeatures]);

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            TTF, OTF, WOFF, or WOFF2
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".ttf,.otf,.woff,.woff2"
          onChange={handleFileUpload}
        />
      </label>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};