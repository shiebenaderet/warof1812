import React, { useState } from 'react';
import { getProfilesByFaction } from '../data/peopleProfiles';

export default function PeoplePanel({ playerFaction }) {
  const [expanded, setExpanded] = useState(false);
  const [openProfile, setOpenProfile] = useState(null);

  const factionProfiles = getProfilesByFaction(playerFaction);
  const leaders = factionProfiles.filter(p => p.isGameLeader);
  const others = factionProfiles.filter(p => !p.isGameLeader);

  return (
    <div className="bg-war-navy/50 rounded-lg border border-parchment-dark/8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-3 py-2.5 flex items-center justify-between cursor-pointer hover:bg-white/3 transition-colors rounded-lg"
      >
        <h3 className="text-war-gold/90 font-display text-sm tracking-wide">
          People of 1812
        </h3>
        <span className="text-parchment-dark/40 text-xs font-body">
          {expanded ? '\u25B2' : '\u25BC'}
        </span>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2 max-h-80 overflow-y-auto">
          {/* Faction Leaders */}
          {leaders.length > 0 && (
            <>
              <p className="text-war-copper/70 text-[10px] uppercase tracking-widest font-body font-bold mb-1 mt-1">
                Your Leaders
              </p>
              {leaders.map((profile) => (
                <ProfileEntry key={profile.id} profile={profile} isOpen={openProfile === profile.id} onToggle={() => setOpenProfile(openProfile === profile.id ? null : profile.id)} />
              ))}
            </>
          )}

          {/* Other Voices */}
          {others.length > 0 && (
            <>
              <p className="text-war-copper/70 text-[10px] uppercase tracking-widest font-body font-bold mb-1 mt-2">
                Other Voices
              </p>
              {others.map((profile) => (
                <ProfileEntry key={profile.id} profile={profile} isOpen={openProfile === profile.id} onToggle={() => setOpenProfile(openProfile === profile.id ? null : profile.id)} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ProfileEntry({ profile, isOpen, onToggle }) {
  return (
    <div className="border-l-2 border-parchment-dark/10 ml-0.5">
      <button
        onClick={onToggle}
        className="w-full text-left pl-2.5 py-1 cursor-pointer hover:bg-white/3 transition-colors flex items-center justify-between"
        aria-expanded={isOpen}
      >
        <div>
          <span className="text-parchment/80 text-xs font-body font-bold">{profile.name}</span>
          <span className="text-parchment-dark/40 text-[10px] font-body ml-1.5">{profile.title}</span>
        </div>
        <span className="text-parchment-dark/30 text-[10px]">{isOpen ? '\u2212' : '+'}</span>
      </button>
      {isOpen && (
        <div className="pl-2.5 pb-2 space-y-1.5">
          {profile.years && (
            <p className="text-parchment-dark/40 text-[10px] font-body">{profile.years}</p>
          )}
          <p className="text-parchment/60 text-xs font-body leading-relaxed">
            {profile.biography[0]}
          </p>
          {profile.primarySources && profile.primarySources.length > 0 && (
            <div className="bg-war-red/5 border-l-2 border-war-red/20 rounded-r pl-2 py-1">
              <p className="text-parchment/60 text-[11px] font-body italic leading-relaxed">
                &ldquo;{profile.primarySources[0].quote}&rdquo;
              </p>
              <p className="text-parchment-dark/40 text-[10px] font-body mt-0.5">
                &mdash; {profile.primarySources[0].attribution}
              </p>
            </div>
          )}
          {profile.didYouKnow && (
            <p className="text-war-copper/60 text-[10px] font-body italic">
              Did you know? {profile.didYouKnow}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
