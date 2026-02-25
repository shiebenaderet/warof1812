import React from 'react';
import VocabTerm from '../components/VocabTerm';
import renderBoldText from './renderBoldText';

/**
 * Takes paragraph text + keyTerms array and returns React elements
 * with the first occurrence of each term wrapped in a VocabTerm tooltip.
 * Terms are sorted by length descending so "Fort McHenry" matches before "Fort".
 * Non-term segments get renderBoldText applied.
 */
export default function injectVocabTerms(text, keyTerms, isExplorer) {
  if (!keyTerms || keyTerms.length === 0) return renderBoldText(text);

  // Sort terms by length descending to match longer terms first
  const sorted = [...keyTerms].sort((a, b) => b.term.length - a.term.length);

  // Build a regex that matches any term (case-insensitive, word boundaries)
  const pattern = sorted.map(t => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${pattern})`, 'i');

  // Track which terms have already been wrapped
  const matched = new Set();
  const parts = text.split(regex);

  return parts.map((part, i) => {
    // Check if this part matches a term we haven't wrapped yet
    const termObj = sorted.find(t => t.term.toLowerCase() === part.toLowerCase());
    if (termObj && !matched.has(termObj.term.toLowerCase())) {
      matched.add(termObj.term.toLowerCase());
      const definition = isExplorer && termObj.simpleDefinition ? termObj.simpleDefinition : termObj.definition;
      return (
        <VocabTerm key={`vocab-${i}`} term={termObj.term} definition={definition}>
          {part}
        </VocabTerm>
      );
    }
    // Non-term segment — apply bold rendering
    return <React.Fragment key={i}>{renderBoldText(part)}</React.Fragment>;
  });
}
