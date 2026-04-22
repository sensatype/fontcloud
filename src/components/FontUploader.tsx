import React, { useCallback, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { useFontStore } from '../store/fontStore';
import { parseFontFile } from '../utils/fontParser';

export const FontUploader: React.FC = () => {
  const { setFont, setMetadata, setGlyphs, setFeatures } = useFontStore();
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(async (file: File) => {
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

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    processFile(file);
  }, [processFile]);

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragging
            ? 'bg-gray-700 border-blue-500 bg-blue-500/10'
            : 'bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-gray-500'
        }`}
      >
        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className={`w-8 h-8 mb-3 ${isDragging ? 'text-blue-400' : 'text-gray-500'}`} />
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold text-white">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
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
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
};