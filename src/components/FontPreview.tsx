import React, { useState } from 'react';
import { useFontStore } from '../store/fontStore';
import { useFont } from '../hooks/useFont';

export const FontPreview: React.FC = () => {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog');
  const { getCurrentFont } = useFontStore();
  const currentFont = getCurrentFont();
  const { isLoading, error } = useFont();

  const metadata = currentFont?.metadata;
  const fontStyle = metadata ? {
    fontFamily: metadata.familyName,
    fontSize: '1.5rem',
    lineHeight: '2rem'
  } : undefined;

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <div className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 border border-gray-600 rounded-lg resize-none bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={fontStyle}
          rows={3}
          placeholder="Type to preview font..."
        />
      </div>

      {metadata && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="border border-gray-600 rounded-lg p-4 bg-gray-700">
            <h3 className="font-semibold mb-3 text-white">Font Information</h3>
            <dl className="space-y-2">
              <dt className="text-gray-400 text-xs font-medium uppercase tracking-wide">Family Name</dt>
              <dd className="text-white mb-2" style={fontStyle}>{metadata.familyName}</dd>
              <dt className="text-gray-400 text-xs font-medium uppercase tracking-wide">Style</dt>
              <dd className="text-white mb-2">{metadata.styleName}</dd>
              {metadata.designer && (
                <>
                  <dt className="text-gray-400 text-xs font-medium uppercase tracking-wide">Designer</dt>
                  <dd className="text-white mb-2">{metadata.designer}</dd>
                </>
              )}
              {metadata.version && (
                <>
                  <dt className="text-gray-400 text-xs font-medium uppercase tracking-wide">Version</dt>
                  <dd className="text-white">{metadata.version}</dd>
                </>
              )}
            </dl>
          </div>

          {metadata.license && (
            <div className="border border-gray-600 rounded-lg p-4 bg-gray-700">
              <h3 className="font-semibold mb-3 text-white">License Information</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{metadata.license}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};