import React, { useState, useMemo, useRef } from 'react';
import territories from '../data/territories';
import TerritoryPolygon from './TerritoryPolygon';

const territoryList = Object.values(territories);

// SVG viewBox dimensions - expanded for better territory spacing
const MAP_WIDTH = 1400;
const MAP_HEIGHT = 920;

export default function GameBoardMapSVG({
  territoryOwners,
  selectedTerritory,
  onTerritoryClick,
  troops,
  currentPhase,
  playerFaction,
  highlightedTerritories = [],
}) {
  const [zoom, setZoom] = useState(0.85); // Start zoomed out to show full board
  const [hoveredTerritory, setHoveredTerritory] = useState(null);
  const svgRef = useRef(null);

  // Compute valid targets based on phase and selection
  const validTargets = useMemo(() => {
    if (!selectedTerritory) return {};
    const terr = territories[selectedTerritory];
    if (!terr) return {};
    const owner = territoryOwners[selectedTerritory] || terr.startingOwner;
    if (owner !== playerFaction) return {};
    const targets = {};
    for (const adjId of terr.adjacency) {
      const adjOwner = territoryOwners[adjId] || territories[adjId]?.startingOwner;
      if (currentPhase === 'battle' && adjOwner && adjOwner !== playerFaction) {
        targets[adjId] = 'attack';
      } else if (currentPhase === 'maneuver' && adjOwner === playerFaction) {
        targets[adjId] = 'maneuver';
      }
    }
    return targets;
  }, [selectedTerritory, currentPhase, playerFaction, territoryOwners]);

  // Neighbor highlight: show adjacent territories
  const neighborHighlightIds = useMemo(() => {
    const active = selectedTerritory || hoveredTerritory;
    if (!active) return new Set();
    return new Set(territories[active]?.adjacency ?? []);
  }, [selectedTerritory, hoveredTerritory]);

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(2.0, z + 0.2));
  const handleZoomOut = () => setZoom((z) => Math.max(0.5, z - 0.2));
  const handleZoomReset = () => setZoom(1.0);

  return (
    <div className="board-container" data-tutorial="map">
      {/* Zoom controls */}
      <div className="board-zoom-controls">
        <button onClick={handleZoomIn} className="board-zoom-btn" title="Zoom in">
          +
        </button>
        <button onClick={handleZoomOut} className="board-zoom-btn" title="Zoom out">
          -
        </button>
        <button onClick={handleZoomReset} className="board-zoom-btn board-zoom-btn-reset" title="Reset zoom">
          &#8634;
        </button>
      </div>

      {/* Scrollable viewport */}
      <div className="board-viewport">
        <div
          className="board-content-svg"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.25s ease-out',
          }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="game-map-svg"
            style={{
              width: MAP_WIDTH,
              height: MAP_HEIGHT,
              background: '#1a2744',
              border: '3px solid #c9a227',
              borderRadius: '6px',
              boxShadow: '0 0 0 6px #1a2744, 0 0 0 9px #7a6018, 0 8px 32px rgba(0, 0, 0, 0.7)',
            }}
          >
            {/* Background decoration layer (water, mountains, forests) */}
            <g id="decoration-layer">
              {/* Ocean background */}
              <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="#0a1628" opacity="0.3" />
            </g>

            {/* Adjacency borders layer removed - territories should touch instead */}

            {/* Neighbor highlight layer */}
            <g id="neighbor-highlights">
              {Array.from(neighborHighlightIds).map((adjId) => {
                const adjTerr = territories[adjId];
                if (!adjTerr || !adjTerr.polygon) return null;
                return (
                  <path
                    key={`highlight-${adjId}`}
                    d={adjTerr.polygon.d}
                    fill="none"
                    stroke="rgba(251, 191, 36, 0.8)"
                    strokeWidth="4"
                    pointerEvents="none"
                  />
                );
              })}
            </g>

            {/* AI Replay highlight layer - cyan glow for territories in current action */}
            <g id="replay-highlights">
              {highlightedTerritories.map((terrId) => {
                const terr = territories[terrId];
                if (!terr || !terr.polygon) return null;
                return (
                  <path
                    key={`replay-highlight-${terrId}`}
                    d={terr.polygon.d}
                    fill="rgba(34, 211, 238, 0.3)"
                    stroke="rgba(34, 211, 238, 1)"
                    strokeWidth="6"
                    pointerEvents="none"
                    className="animate-pulse"
                  />
                );
              })}
            </g>

            {/* Territory layer */}
            <g id="territories">
              {territoryList.map((terr) => (
                <TerritoryPolygon
                  key={terr.id}
                  territory={terr}
                  owner={territoryOwners[terr.id] || terr.startingOwner}
                  troopCount={troops[terr.id] || 0}
                  isSelected={selectedTerritory === terr.id}
                  isValidTarget={validTargets[terr.id] || null}
                  onClick={() => onTerritoryClick(terr.id)}
                  onMouseEnter={() => setHoveredTerritory(terr.id)}
                  onMouseLeave={() => setHoveredTerritory((h) => (h === terr.id ? null : h))}
                  currentPhase={currentPhase}
                  playerFaction={playerFaction}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
