import { useState, useCallback } from 'react';

export function useClipboard(duration = 2000) {
  const [copied, setCopied] = useState<number | null>(null);

  const copyToClipboard = useCallback((text: string, id: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), duration);
    });
  }, [duration]);

  return { copied, copyToClipboard };
}