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
      <div className="bg-black bg-opacity-40 rounded-lg p-4">
        <p className="text-parchment-dark text-sm italic font-serif">
          Click a territory on the map to view details.
        </p>
      </div>
    );
  }

  const terr = territories[territoryId];
  const owner = territoryOwners[territoryId] || terr.startingOwner;
  const troopCount = troops[territoryId] || 0;

  return (
    <div className="bg-black bg-opacity-40 rounded-lg p-4 space-y-2">
      <h3 className="text-war-gold font-serif text-lg">{terr.name}</h3>
      <div className="text-sm space-y-1 text-parchment">
        <p><span className="text-parchment-dark">Theater:</span> {terr.theater}</p>
        <p><span className="text-parchment-dark">Controlled by:</span> {ownerLabels[owner]}</p>
        <p><span className="text-parchment-dark">Troops:</span> {troopCount}</p>
        <p><span className="text-parchment-dark">Point value:</span> {terr.points} per round</p>
        {terr.hasFort && (
          <p className="text-war-gold text-xs">&#9971; Fortified — defenders get +1 die bonus</p>
        )}
        {terr.isNaval && (
          <p className="text-blue-300 text-xs">~ Naval zone — requires naval superiority</p>
        )}
      </div>
      {terr.adjacency && (
        <div className="pt-2 border-t border-parchment-dark border-opacity-20">
          <p className="text-xs text-parchment-dark">
            Adjacent: {terr.adjacency.map((id) => territories[id]?.name).filter(Boolean).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}
