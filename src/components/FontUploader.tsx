import React, { useCallback, useState } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useFontStore } from '../store/fontStore';
import { parseFontFile } from '../utils/fontParser';
import { Font } from '../types/font';

interface FontUploaderProps {
  showTitle?: boolean;
}

export const FontUploader: React.FC<FontUploaderProps> = ({ showTitle = true }) => {
  const { addFont } = useFontStore();
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFonts, setUploadedFonts] = useState<string[]>([]);

  const processFile = useCallback(async (file: File) => {
    try {
      setError(null);
      const buffer = await file.arrayBuffer();
      const { metadata, glyphs, features } = await parseFontFile(buffer);

      const fontId = `${metadata.familyName}-${metadata.styleName}-${Date.now()}`;
      const newFont: Font = {
        id: fontId,
        buffer,
        metadata,
        glyphs,
        features,
      };

      addFont(newFont);
      setUploadedFonts((prev) => [...prev, metadata.familyName]);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadedFonts((prev) =>
          prev.filter((f) => f !== metadata.familyName)
        );
      }, 3000);
    } catch (error) {
      console.error('Error processing font:', error);
      setError(
        `Failed to process "${file.name}". Please ensure it's a valid font file (TTF, OTF, WOFF, or WOFF2).`
      );
    }
  }, [addFont]);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      // Process each file
      for (let i = 0; i < files.length; i++) {
        await processFile(files[i]);
      }

      // Reset input
      event.target.value = '';
    },
    [processFile]
  );

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

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (!files) return;

      // Process each file
      Array.from(files).forEach((file) => {
        processFile(file);
      });
    },
    [processFile]
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {showTitle && (
        <h2 className="text-xl font-bold mb-4 text-white">Add Fonts</h2>
      )}

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
            <Upload
              className={`w-8 h-8 mb-3 ${
                isDragging ? 'text-blue-400' : 'text-gray-500'
              }`}
            />
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold text-white">Click to upload</span>{' '}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              TTF, OTF, WOFF, or WOFF2 (multiple files supported)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".ttf,.otf,.woff,.woff2"
            onChange={handleFileUpload}
            multiple
          />
        </label>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {uploadedFonts.length > 0 && (
        <div className="mt-4 p-4 bg-green-900/20 border border-green-800 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-green-300 font-semibold">
              Successfully uploaded {uploadedFonts.length} font
              {uploadedFonts.length > 1 ? 's' : ''}:
            </p>
            <ul className="text-sm text-green-300 mt-1 list-disc list-inside">
              {uploadedFonts.map((fontName) => (
                <li key={fontName}>{fontName}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};