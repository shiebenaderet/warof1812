import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'war1812_font_preference';

export default function useFontPreference() {
  const [fontMode, setFontMode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'default';
    } catch {
      return 'default';
    }
  });

  useEffect(() => {
    if (fontMode === 'dyslexic') {
      document.documentElement.setAttribute('data-font', 'dyslexic');
    } else {
      document.documentElement.removeAttribute('data-font');
    }
    try {
      localStorage.setItem(STORAGE_KEY, fontMode);
    } catch {
      // localStorage unavailable
    }
  }, [fontMode]);

  const toggleFont = useCallback(() => {
    setFontMode(prev => prev === 'dyslexic' ? 'default' : 'dyslexic');
  }, []);

  return { fontMode, toggleFont };
}
