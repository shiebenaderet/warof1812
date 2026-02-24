import React from 'react';
import territories from '../data/territories';

const ownerLabels = {
  us: 'United States',
  british: 'British/Canada',
  native: 'Native Coalition',
  neutral: 'Neutral',
};

export default function TerritoryInfo({ territoryId, territoryOwners, troops }) {
  if (!territoryId || !territories[territoryId]) {
    return (
      <div className="bg-war-navy/50 rounded-lg p-4 border border-parchment-dark/8">
        <p className="text-parchment-dark/40 text-sm italic font-body">
          Click a territory on the map to view details.
        </p>
      </div>
    );
  }

  const terr = territories[territoryId];
  const owner = territoryOwners[territoryId] || terr.startingOwner;
  const troopCount = troops[territoryId] || 0;

  return (
    <div className="bg-war-navy/50 rounded-lg p-4 space-y-2 border border-parchment-dark/8">
      <h3 className="text-war-gold/90 font-display text-base tracking-wide">{terr.name}</h3>
      <div className="text-sm space-y-1.5 text-parchment/70 font-body">
        <p><span className="text-parchment-dark/50">Theater:</span> {terr.theater}</p>
        <p><span className="text-parchment-dark/50">Controlled by:</span> {ownerLabels[owner]}</p>
        <p><span className="text-parchment-dark/50">Troops:</span> {troopCount}</p>
        <p><span className="text-parchment-dark/50">Point value:</span> {terr.points} per round</p>
        {terr.hasFort && (
          <p className="text-war-gold/70 text-xs">&#9971; Fortified &mdash; defenders get +1 die bonus</p>
        )}
        {terr.isNaval && (
          <p className="text-[#4a7ec7] text-xs">~ Naval zone &mdash; requires naval superiority</p>
        )}
      </div>
      {terr.adjacency && (
        <div className="pt-2 border-t border-parchment-dark/10">
          <p className="text-xs text-parchment-dark/40 font-body">
            Adjacent: {terr.adjacency.map((id) => territories[id]?.name).filter(Boolean).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}
