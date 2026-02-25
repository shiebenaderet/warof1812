import React, { useState } from 'react';
import profiles from '../data/peopleProfiles';

const FACTION_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'us', label: 'United States' },
  { id: 'british', label: 'British / Canada' },
  { id: 'native', label: 'Native Coalition' },
];

const CATEGORY_LABELS = {
  military: 'Military',
  political: 'Political',
  civilian: 'Civilian',
  native_leader: 'Native Leader',
};

export default function PeopleGallery({ onClose }) {
  const [filter, setFilter] = useState('all');
  const [selectedProfile, setSelectedProfile] = useState(null);

  const filtered = filter === 'all' ? profiles : profiles.filter(p => p.faction === filter);

  if (selectedProfile) {
    return (
      <ProfileDetail
        profile={selectedProfile}
        onBack={() => setSelectedProfile(null)}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
      {/* Header */}
      <header className="bg-war-navy/80 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 border-b border-war-gold/15 flex items-center justify-between gap-3 sticky top-0 z-10">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
            <p className="text-war-copper text-xs tracking-[0.2em] uppercase font-body font-bold">Historical Figures</p>
            <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
          </div>
          <h1 className="text-war-gold font-display text-lg md:text-xl tracking-wide">People of 1812</h1>
        </div>
        <button
          onClick={onClose}
          className="px-3 md:px-4 py-2 border border-parchment-dark/15 text-parchment-dark/50 rounded
                     hover:border-war-gold/40 hover:text-war-gold transition-colors text-xs font-body flex-shrink-0 cursor-pointer"
        >
          Back to Menu
        </button>
      </header>

      <div className="p-3 md:p-6 max-w-6xl mx-auto">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FACTION_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-body transition-all cursor-pointer ${
                filter === f.id
                  ? 'bg-war-gold/20 border border-war-gold/40 text-war-gold font-bold'
                  : 'border border-parchment-dark/15 text-parchment-dark/50 hover:border-war-gold/30 hover:text-parchment/70'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Profile grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setSelectedProfile(profile)}
              className="text-left bg-war-navy/50 rounded-lg p-4 border border-parchment-dark/8
                         hover:border-war-gold/25 hover:bg-war-navy/70 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-parchment/90 font-display text-base tracking-wide group-hover:text-war-gold transition-colors">
                    {profile.name}
                  </h3>
                  <p className="text-parchment-dark/50 text-xs font-body">{profile.title}</p>
                </div>
                {profile.isGameLeader && (
                  <span className="text-war-gold/50 text-[10px] uppercase tracking-widest font-body font-bold border border-war-gold/20 rounded px-1.5 py-0.5 flex-shrink-0">
                    Leader
                  </span>
                )}
              </div>
              {profile.years && (
                <p className="text-parchment-dark/40 text-xs font-body mb-2">{profile.years}</p>
              )}
              <p className="text-parchment/60 text-xs font-body leading-relaxed line-clamp-3">
                {profile.biography[0]}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-war-copper/50 text-[10px] uppercase tracking-widest font-body">
                  {CATEGORY_LABELS[profile.category] || profile.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileDetail({ profile, onBack, onClose }) {
  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
      {/* Header */}
      <header className="bg-war-navy/80 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 border-b border-war-gold/15 flex items-center justify-between gap-3 sticky top-0 z-10">
        <div>
          <p className="text-war-copper text-xs tracking-[0.2em] uppercase font-body font-bold mb-0.5">
            {CATEGORY_LABELS[profile.category] || profile.category}
          </p>
          <h1 className="text-war-gold font-display text-lg md:text-xl tracking-wide">{profile.name}</h1>
          <p className="text-parchment-dark/40 text-xs font-body">{profile.title}{profile.years ? ` \u2022 ${profile.years}` : ''}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={onBack}
            className="px-3 py-2 border border-parchment-dark/15 text-parchment-dark/50 rounded
                       hover:border-war-gold/40 hover:text-war-gold transition-colors text-xs font-body cursor-pointer"
          >
            All People
          </button>
          <button
            onClick={onClose}
            className="px-3 py-2 border border-parchment-dark/15 text-parchment-dark/50 rounded
                       hover:border-war-gold/40 hover:text-war-gold transition-colors text-xs font-body cursor-pointer"
          >
            Back to Menu
          </button>
        </div>
      </header>

      <div className="p-3 md:p-6 max-w-3xl mx-auto space-y-5">
        {profile.isGameLeader && (
          <div className="inline-block bg-war-gold/10 border border-war-gold/20 rounded-full px-3 py-1">
            <span className="text-war-gold text-xs font-body font-bold">In-Game Leader</span>
          </div>
        )}

        {/* Biography */}
        <div className="bg-war-navy/50 rounded-lg p-5 border border-parchment-dark/8 space-y-3">
          <h2 className="text-war-gold/80 font-display text-base tracking-wide border-b border-war-gold/15 pb-2">Biography</h2>
          {profile.biography.map((paragraph, i) => (
            <p key={i} className="text-parchment/70 text-sm font-body leading-relaxed">{paragraph}</p>
          ))}
        </div>

        {/* Primary Sources */}
        {profile.primarySources && profile.primarySources.length > 0 && (
          <div className="bg-war-navy/50 rounded-lg p-5 border border-parchment-dark/8 space-y-3">
            <h2 className="text-war-gold/80 font-display text-base tracking-wide border-b border-war-gold/15 pb-2">Primary Sources</h2>
            {profile.primarySources.map((source, i) => (
              <div key={i} className="bg-war-red/5 border-l-2 border-war-red/20 rounded-r-lg pl-4 py-3 pr-3">
                <p className="text-parchment/80 text-sm font-body italic leading-relaxed">
                  &ldquo;{source.quote}&rdquo;
                </p>
                <p className="text-parchment-dark/50 text-xs font-body mt-1.5">
                  &mdash; {source.attribution}
                </p>
                {source.context && (
                  <p className="text-parchment/50 text-xs font-body mt-1.5 pt-1.5 border-t border-parchment-dark/10">
                    {source.context}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Did You Know */}
        {profile.didYouKnow && (
          <div className="bg-war-red/10 border-l-2 border-war-red/30 rounded-r-lg p-4">
            <p className="text-war-copper/80 text-xs uppercase tracking-wider mb-1 font-body font-bold">Did You Know?</p>
            <p className="text-parchment/70 text-sm italic font-body leading-relaxed">{profile.didYouKnow}</p>
          </div>
        )}
      </div>
    </div>
  );
}
