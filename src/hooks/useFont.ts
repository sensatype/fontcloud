import { useEffect, useState } from 'react';
import { useFontStore } from '../store/fontStore';
import { loadFontFace } from '../utils/fontLoader';

export function useFont() {
  const { currentFont, metadata } = useFontStore();
  const [fontUrl, setFontUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentFont || !metadata) return;

    setIsLoading(true);
    setError(null);

    loadFontFace(metadata.familyName, currentFont)
      .then((url) => {
        setFontUrl(url);
        setIsLoading(false);
      })
      .catch((err) => {
        setError('Failed to load font');
        setIsLoading(false);
      });

    return () => {
      if (fontUrl) {
        URL.revokeObjectURL(fontUrl);
      }
    };
  }, [currentFont, metadata]);

  return { fontUrl, isLoading, error };
}