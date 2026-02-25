import React, { useState } from 'react';
import { teacherGuide } from '../data/teacherGuide';

function CollapsibleSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-parchment-dark/8 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-white/3 transition-colors"
        style={{ background: 'linear-gradient(135deg, rgba(184,115,51,0.08) 0%, rgba(20,30,48,0.4) 100%)' }}
      >
        <h2 className="text-war-gold/90 font-display text-base tracking-wide">{title}</h2>
        <span className="text-parchment-dark/40 text-sm">{open ? '\u25B2' : '\u25BC'}</span>
      </button>
      {open && <div className="px-5 py-4 bg-black/5">{children}</div>}
    </div>
  );
}

export default function TeacherGuide() {
  const guide = teacherGuide;

  return (
    <div className="min-h-screen text-parchment" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
      {/* Header */}
      <header className="bg-war-navy/80 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 border-b border-war-gold/15 flex items-center justify-between gap-3 sticky top-0 z-10">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
            <p className="text-war-copper text-xs tracking-[0.2em] uppercase font-body font-bold">Educator Resource</p>
            <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
          </div>
          <h1 className="text-war-gold font-display text-lg md:text-xl tracking-wide">Teacher Guide</h1>
          <p className="text-parchment-dark/40 text-xs font-body">War of 1812: Rise of the Nation</p>
        </div>
        <a
          href={window.location.pathname}
          className="px-3 md:px-4 py-2 border border-parchment-dark/15 text-parchment-dark/50 rounded
                     hover:border-war-gold/40 hover:text-war-gold transition-colors text-xs font-body flex-shrink-0 cursor-pointer"
        >
          Back to Game
        </a>
      </header>

      <div className="p-3 md:p-6 max-w-4xl mx-auto space-y-4">
        {/* Overview */}
        <CollapsibleSection title={guide.overview.title} defaultOpen={true}>
          <p className="text-parchment/70 text-sm font-body leading-relaxed mb-4">{guide.overview.content}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-war-navy/50 rounded-lg p-3 border border-parchment-dark/8 text-center">
              <p className="text-war-gold font-display text-sm font-bold">{guide.overview.targetAudience}</p>
              <p className="text-parchment-dark/40 text-xs font-body">Audience</p>
            </div>
            <div className="bg-war-navy/50 rounded-lg p-3 border border-parchment-dark/8 text-center">
              <p className="text-war-gold font-display text-sm font-bold">{guide.overview.duration}</p>
              <p className="text-parchment-dark/40 text-xs font-body">Duration</p>
            </div>
            <div className="bg-war-navy/50 rounded-lg p-3 border border-parchment-dark/8 text-center">
              <p className="text-war-gold font-display text-sm font-bold">{guide.overview.players}</p>
              <p className="text-parchment-dark/40 text-xs font-body">Mode</p>
            </div>
          </div>
        </CollapsibleSection>

        {/* Learning Objectives */}
        <CollapsibleSection title={guide.learningObjectives.title}>
          <div className="space-y-3">
            {guide.learningObjectives.objectives.map((obj) => (
              <div key={obj.id} className="border-l-2 border-war-gold/20 pl-3">
                <p className="text-parchment/80 text-sm font-body">{obj.text}</p>
                <p className="text-parchment-dark/40 text-xs font-body italic mt-0.5">Assessed by: {obj.assessedBy}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Standards Alignment */}
        <CollapsibleSection title={guide.standards.title}>
          <p className="text-war-copper/70 text-xs uppercase tracking-widest font-body font-bold mb-3">
            {guide.standards.framework}
          </p>
          <div className="space-y-3">
            {guide.standards.alignments.map((std) => (
              <div key={std.code} className="bg-war-navy/40 rounded-lg p-3 border border-parchment-dark/8">
                <p className="text-war-gold/80 text-xs font-bold font-body mb-1">{std.code}</p>
                <p className="text-parchment/70 text-sm font-body">{std.description}</p>
                <p className="text-parchment-dark/50 text-xs font-body italic mt-1">In-game: {std.gameConnection}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Classroom Setup */}
        <CollapsibleSection title={guide.classroomSetup.title}>
          <div className="space-y-4">
            {guide.classroomSetup.sections.map((section) => (
              <div key={section.heading}>
                <h3 className="text-war-copper/80 text-xs uppercase tracking-widest font-body font-bold mb-2">{section.heading}</h3>
                <ul className="space-y-1.5">
                  {section.items.map((item, i) => (
                    <li key={i} className="text-parchment/70 text-sm font-body pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-war-gold/40">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* How to Play */}
        <CollapsibleSection title={guide.howToPlay.title}>
          <div className="space-y-3 mb-4">
            {guide.howToPlay.phases.map((phase, i) => (
              <div key={phase.name} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-war-gold/15 border border-war-gold/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-war-gold text-xs font-display font-bold">{i + 1}</span>
                </div>
                <div>
                  <p className="text-parchment/90 text-sm font-body font-bold">{phase.name}</p>
                  <p className="text-parchment/60 text-sm font-body">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
          <h3 className="text-war-copper/80 text-xs uppercase tracking-widest font-body font-bold mb-2">Victory Conditions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {guide.howToPlay.victoryConditions.map((vc) => (
              <div key={vc.type} className="bg-war-navy/40 rounded-lg p-3 border border-parchment-dark/8">
                <p className="text-war-gold/80 text-sm font-body font-bold">{vc.type}</p>
                <p className="text-parchment/60 text-xs font-body">{vc.description}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Facilitation Tips */}
        <CollapsibleSection title={guide.facilitation.title}>
          <div className="space-y-4">
            {guide.facilitation.tips.map((tip) => (
              <div key={tip.heading} className="border-l-2 border-war-copper/20 pl-3">
                <p className="text-parchment/90 text-sm font-body font-bold">{tip.heading}</p>
                <p className="text-parchment/60 text-sm font-body mt-0.5">{tip.content}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Assessment Ideas */}
        <CollapsibleSection title={guide.assessment.title}>
          <h3 className="text-war-copper/80 text-xs uppercase tracking-widest font-body font-bold mb-2">Formative Assessment</h3>
          <ul className="space-y-1.5 mb-4">
            {guide.assessment.formative.map((item, i) => (
              <li key={i} className="text-parchment/70 text-sm font-body pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-war-gold/40">
                {item}
              </li>
            ))}
          </ul>
          <h3 className="text-war-copper/80 text-xs uppercase tracking-widest font-body font-bold mb-2">Summative Assessment</h3>
          <ul className="space-y-1.5">
            {guide.assessment.summative.map((item, i) => (
              <li key={i} className="text-parchment/70 text-sm font-body pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-war-gold/40">
                {item}
              </li>
            ))}
          </ul>
        </CollapsibleSection>

        {/* Discussion Questions */}
        <CollapsibleSection title={guide.discussionQuestions.title}>
          <div className="space-y-3">
            {guide.discussionQuestions.questions.map((q, i) => (
              <div key={i} className="bg-war-navy/40 rounded-lg p-3 border border-parchment-dark/8">
                <div className="flex items-start gap-2">
                  <span className="text-war-gold/60 text-xs font-body font-bold flex-shrink-0 mt-0.5">{i + 1}.</span>
                  <div>
                    <p className="text-parchment/80 text-sm font-body">{q.question}</p>
                    <span className="inline-block mt-1 text-war-copper/60 text-[10px] uppercase tracking-widest font-body font-bold">{q.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* FAQ */}
        <CollapsibleSection title={guide.faq.title}>
          <div className="space-y-3">
            {guide.faq.items.map((item, i) => (
              <div key={i} className="border-l-2 border-parchment-dark/10 pl-3">
                <p className="text-parchment/90 text-sm font-body font-bold">{item.question}</p>
                <p className="text-parchment/60 text-sm font-body mt-0.5">{item.answer}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
