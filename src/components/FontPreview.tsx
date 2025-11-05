import React, { useState } from 'react';
import { useFontStore } from '../store/fontStore';
import { useFont } from '../hooks/useFont';

export const FontPreview: React.FC = () => {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog');
  const { metadata } = useFontStore();
  const { isLoading, error } = useFont();

  const fontStyle = metadata ? {
    fontFamily: metadata.familyName,
    fontSize: '1.5rem',
    lineHeight: '2rem'
  } : undefined;

  return (
    <div className="p-4">
      <div className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 border rounded-lg resize-none"
          style={fontStyle}
          rows={3}
          placeholder="Type to preview font..."
        />
      </div>
      
      {metadata && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Font Information</h3>
            <dl className="space-y-1">
              <dt className="text-gray-500">Family Name</dt>
              <dd style={fontStyle}>{metadata.familyName}</dd>
              <dt className="text-gray-500">Style</dt>
              <dd>{metadata.styleName}</dd>
              {metadata.designer && (
                <>
                  <dt className="text-gray-500">Designer</dt>
                  <dd>{metadata.designer}</dd>
                </>
              )}
              {metadata.version && (
                <>
                  <dt className="text-gray-500">Version</dt>
                  <dd>{metadata.version}</dd>
                </>
              )}
            </dl>
          </div>
          
          {metadata.license && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">License Information</h3>
              <p className="text-sm text-gray-600">{metadata.license}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};