import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import territories, { GRID_COLS, GRID_ROWS } from '../data/territories';
import TerritoryTile from './TerritoryTile';

const territoryList = Object.values(territories);

// Clip a line from (cx,cy) toward (tx,ty) to the edge of a rectangle centered at (cx,cy)
function clipToRect(cx, cy, tx, ty, halfW, halfH) {
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const scaleX = halfW / Math.abs(dx || 1);
  const scaleY = halfH / Math.abs(dy || 1);
  const scale = Math.min(scaleX, scaleY);
  return { x: cx + dx * scale, y: cy + dy * scale };
}

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
  const [hoveredTerritory, setHoveredTerritory] = useState(null);

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
      const fromCX = fromRect.left + fromRect.width / 2 - boardRect.left;
      const fromCY = fromRect.top + fromRect.height / 2 - boardRect.top;

      terr.adjacency.forEach((adjId) => {
        const pairKey = [id, adjId].sort().join('-');
        if (drawnPairs.has(pairKey)) return;
        drawnPairs.add(pairKey);

        const toEl = tileElements[adjId];
        if (!toEl) return;
        const toRect = toEl.getBoundingClientRect();
        const toCX = toRect.left + toRect.width / 2 - boardRect.left;
        const toCY = toRect.top + toRect.height / 2 - boardRect.top;

        // Clip line to start/end at tile borders instead of centers
        const fromHW = fromRect.width / 2;
        const fromHH = fromRect.height / 2;
        const toHW = toRect.width / 2;
        const toHH = toRect.height / 2;
        const from = clipToRect(fromCX, fromCY, toCX, toCY, fromHW, fromHH);
        const to = clipToRect(toCX, toCY, fromCX, fromCY, toHW, toHH);

        const isHighlighted =
          selectedTerritory &&
          (id === selectedTerritory || adjId === selectedTerritory);
        const isHovered =
          hoveredTerritory &&
          (id === hoveredTerritory || adjId === hoveredTerritory);

        newLines.push({
          x1: from.x,
          y1: from.y,
          x2: to.x,
          y2: to.y,
          highlighted: isHighlighted,
          hovered: isHovered,
          key: pairKey,
        });
      });
    });

    setLines(newLines);
  }, [selectedTerritory, hoveredTerritory]);

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
            <defs>
              <marker id="dot" viewBox="0 0 6 6" refX="3" refY="3"
                markerWidth="5" markerHeight="5">
                <circle cx="3" cy="3" r="2.5" fill="#8b7e6a" />
              </marker>
              <marker id="dot-hl" viewBox="0 0 6 6" refX="3" refY="3"
                markerWidth="5" markerHeight="5">
                <circle cx="3" cy="3" r="2.5" fill="#fbbf24" />
              </marker>
              <marker id="dot-hov" viewBox="0 0 6 6" refX="3" refY="3"
                markerWidth="6" markerHeight="6">
                <circle cx="3" cy="3" r="2.5" fill="#e2c87a" />
              </marker>
            </defs>
            {lines.map((line) => {
              const active = line.highlighted || line.hovered;
              const color = line.highlighted ? '#fbbf24' : line.hovered ? '#e2c87a' : '#8b7e6a';
              const dotId = line.highlighted ? 'dot-hl' : line.hovered ? 'dot-hov' : 'dot';
              return (
                <line
                  key={line.key}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={color}
                  strokeWidth={line.highlighted ? 2.5 : active ? 2 : 1.5}
                  opacity={line.highlighted ? 0.9 : active ? 0.75 : 0.4}
                  markerStart={`url(#${dotId})`}
                  markerEnd={`url(#${dotId})`}
                />
              );
            })}
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
                onMouseEnter={() => setHoveredTerritory(terr.id)}
                onMouseLeave={() => setHoveredTerritory((h) => h === terr.id ? null : h)}
                zoomLevel={zoom}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
