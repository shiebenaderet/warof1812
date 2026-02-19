import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import territories, { GRID_COLS, GRID_ROWS } from '../data/territories';
import TerritoryTile from './TerritoryTile';

const territoryList = Object.values(territories);

export default function GameBoardMap({
  territoryOwners,
  selectedTerritory,
  onTerritoryClick,
  troops,
  currentPhase,
  playerFaction,
}) {
  const [zoom, setZoom] = useState(1.0);
  const boardRef = useRef(null);
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);

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

  // Calculate adjacency lines after render
  const calculateLines = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;

    const tileElements = {};
    board.querySelectorAll('[data-territory]').forEach((el) => {
      tileElements[el.dataset.territory] = el;
    });

    const boardRect = board.getBoundingClientRect();
    const newLines = [];
    const drawnPairs = new Set();

    Object.entries(territories).forEach(([id, terr]) => {
      const fromEl = tileElements[id];
      if (!fromEl) return;
      const fromRect = fromEl.getBoundingClientRect();
      const fromX = fromRect.left + fromRect.width / 2 - boardRect.left;
      const fromY = fromRect.top + fromRect.height / 2 - boardRect.top;

      terr.adjacency.forEach((adjId) => {
        const pairKey = [id, adjId].sort().join('-');
        if (drawnPairs.has(pairKey)) return;
        drawnPairs.add(pairKey);

        const toEl = tileElements[adjId];
        if (!toEl) return;
        const toRect = toEl.getBoundingClientRect();
        const toX = toRect.left + toRect.width / 2 - boardRect.left;
        const toY = toRect.top + toRect.height / 2 - boardRect.top;

        const isHighlighted =
          selectedTerritory &&
          (id === selectedTerritory || adjId === selectedTerritory);

        newLines.push({
          x1: fromX,
          y1: fromY,
          x2: toX,
          y2: toY,
          highlighted: isHighlighted,
          key: pairKey,
        });
      });
    });

    setLines(newLines);
  }, [selectedTerritory]);

  useEffect(() => {
    // Recalculate on mount and whenever zoom or selection changes
    const timer = setTimeout(calculateLines, 50);
    return () => clearTimeout(timer);
  }, [calculateLines, zoom]);

  // Recalculate on window resize
  useEffect(() => {
    window.addEventListener('resize', calculateLines);
    return () => window.removeEventListener('resize', calculateLines);
  }, [calculateLines]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setZoom((z) => {
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      return Math.max(0.7, Math.min(1.6, z + delta));
    });
  }, []);

  // Attach wheel listener with passive:false so we can preventDefault
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  return (
    <div
      ref={containerRef}
      className="board-container"
      data-tutorial="map"
    >
      {/* Zoom controls */}
      <div className="board-zoom-controls">
        <button
          onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
          className="board-zoom-btn"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
          className="board-zoom-btn"
          title="Zoom out"
        >
          -
        </button>
        <button
          onClick={() => setZoom(1.0)}
          className="board-zoom-btn board-zoom-btn-reset"
          title="Reset zoom"
        >
          &#8634;
        </button>
      </div>

      {/* Scrollable viewport */}
      <div className="board-viewport">
        <div
          ref={boardRef}
          className="board-content"
          style={{
            transform: `scale(${zoom})`,
            transition: 'transform 0.25s ease-out',
          }}
        >
          {/* SVG adjacency lines layer */}
          <svg className="board-lines-svg">
            {lines.map((line) => (
              <line
                key={line.key}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={line.highlighted ? '#fbbf24' : '#d4c5a0'}
                strokeWidth={line.highlighted ? 2 : 1}
                opacity={line.highlighted ? 0.7 : 0.2}
                strokeDasharray={line.highlighted ? 'none' : '4 4'}
              />
            ))}
          </svg>

          {/* Territory grid */}
          <div
            className="board-grid"
            style={{
              gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
            }}
          >
            {territoryList.map((terr) => (
              <TerritoryTile
                key={terr.id}
                territory={terr}
                owner={territoryOwners[terr.id] || terr.startingOwner}
                troopCount={troops[terr.id] || 0}
                isSelected={selectedTerritory === terr.id}
                isValidTarget={validTargets[terr.id] || null}
                onClick={() => onTerritoryClick(terr.id)}
                zoomLevel={zoom}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
