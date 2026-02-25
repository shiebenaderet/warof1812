import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function VocabTerm({ term, definition, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const tooltipRef = useRef(null);

  const toggle = useCallback(() => setOpen(prev => !prev), []);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open]);

  // Reposition tooltip if it goes off-screen
  useEffect(() => {
    if (!open || !tooltipRef.current) return;
    const el = tooltipRef.current;
    const rect = el.getBoundingClientRect();
    if (rect.left < 8) {
      el.style.left = '0';
      el.style.transform = 'none';
    } else if (rect.right > window.innerWidth - 8) {
      el.style.left = 'auto';
      el.style.right = '0';
      el.style.transform = 'none';
    }
  }, [open]);

  return (
    <span ref={ref} className="relative inline">
      <button
        type="button"
        onClick={toggle}
        className="inline underline decoration-dotted decoration-war-gold/60 underline-offset-2 font-bold text-parchment/90
                   hover:decoration-war-gold cursor-pointer min-h-[44px] min-w-0 p-0 m-0 bg-transparent border-none
                   font-inherit text-inherit leading-inherit"
        aria-expanded={open}
        aria-label={`Definition of ${term}`}
      >
        {children}
      </button>
      {open && (
        <span
          ref={tooltipRef}
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 max-w-[90vw]
                     bg-war-navy border border-war-gold/30 shadow-modal rounded-lg p-3
                     animate-fadein z-50"
        >
          <span className="block text-war-gold font-display text-sm font-bold mb-1">{term}</span>
          <span className="block text-parchment/70 text-sm font-body leading-relaxed">{definition}</span>
        </span>
      )}
    </span>
  );
}
