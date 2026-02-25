import React from 'react';

/**
 * Converts **text** markdown bold syntax to <strong> React elements.
 * Returns an array of strings and React elements.
 */
export default function renderBoldText(text) {
  if (!text) return text;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-parchment/90 font-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
