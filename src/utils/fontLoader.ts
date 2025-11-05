import { useEffect } from 'react';

export function loadFontFace(name: string, buffer: ArrayBuffer) {
  const blob = new Blob([buffer], { type: 'font/truetype' });
  const url = URL.createObjectURL(blob);
  
  const fontFace = new FontFace(name, `url(${url})`);
  
  return fontFace.load().then((loadedFace) => {
    document.fonts.add(loadedFace);
    return url;
  });
}