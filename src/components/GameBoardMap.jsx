import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import territories, {
  HEX_WIDTH,
  HEX_HEIGHT,
  HEX_COL_SPACING,
  HEX_ROW_SPACING,
  HEX_GRID_COLS,
  HEX_GRID_ROWS,
  hexToPixel,
  decorationHexes,
} from '../data/territories';
import TerritoryTile from './TerritoryTile';

const territoryList = Object.values(territories);

const HEX_CLIP = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';

// Board pixel dimensions
const BOARD_WIDTH = (HEX_GRID_COLS - 1) * HEX_COL_SPACING + HEX_WIDTH;
const BOARD_HEIGHT = (HEX_GRID_ROWS - 1) * HEX_ROW_SPACING + HEX_HEIGHT + HEX_HEIGHT / 2;

const decoColors = {
  water: 'rgba(37, 99, 235, 0.18)',
  mountain: 'rgba(100, 100, 100, 0.25)',
  forest: 'rgba(22, 101, 52, 0.22)',
};

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
  const [zoom, setZoom] = useState(null); // null until auto-fit calculates
  const boardRef = useRef(null);
  const containerRef = useRef(null);
  const fitZoomRef = useRef(1.0);
  const [lines, setLines] = useState([]);
  const [hoveredTerritory, setHoveredTerritory] = useState(null);

  // Auto-fit zoom: calculate best zoom so board fits container
  useEffect(() => {
    function calcFitZoom() {
      const container = containerRef.current;
      if (!container) return;
      const containerW = container.clientWidth - 32;
      const containerH = container.clientHeight - 32;
      const fit = Math.min(containerW / BOARD_WIDTH, containerH / BOARD_HEIGHT, 1.0);
      const clamped = Math.max(0.4, Math.min(1.6, fit));
      fitZoomRef.current = clamped;
      setZoom((prev) => prev === null ? clamped : prev);
    }
    calcFitZoom();
    window.addEventListener('resize', calcFitZoom);
    return () => window.removeEventListener('resize', calcFitZoom);
  }, []);

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

        // Clip to hex-ish bounds (45% width, 48% height)
        const fromHW = fromRect.width * 0.45;
        const fromHH = fromRect.height * 0.48;
        const toHW = toRect.width * 0.45;
        const toHH = toRect.height * 0.48;
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
    const timer = setTimeout(calculateLines, 50);
    return () => clearTimeout(timer);
  }, [calculateLines, zoom]);

  useEffect(() => {
    window.addEventListener('resize', calculateLines);
    return () => window.removeEventListener('resize', calculateLines);
  }, [calculateLines]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setZoom((z) => {
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      return Math.max(0.4, Math.min(1.6, (z || 1.0) + delta));
    });
  }, []);

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
          onClick={() => setZoom((z) => Math.min(1.6, (z || 1.0) + 0.15))}
          className="board-zoom-btn"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.4, (z || 1.0) - 0.15))}
          className="board-zoom-btn"
          title="Zoom out"
        >
          -
        </button>
        <button
          onClick={() => setZoom(fitZoomRef.current)}
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
            transform: `scale(${zoom || 1.0})`,
            transition: 'transform 0.25s ease-out',
          }}
        >
          {/* SVG adjacency lines layer */}
          <svg className="board-lines-svg" style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}>
            <defs>
              <marker id="dot" viewBox="0 0 6 6" refX="3" refY="3"
                markerWidth="5" markerHeight="5">
                <circle cx="3" cy="3" r="2.5" fill="#b8a97a" />
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
              const color = line.highlighted ? '#fbbf24' : line.hovered ? '#e2c87a' : '#b8a97a';
              const dotId = line.highlighted ? 'dot-hl' : line.hovered ? 'dot-hov' : 'dot';
              return (
                <line
                  key={line.key}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={color}
                  strokeWidth={line.highlighted ? 3 : active ? 2 : 2}
                  opacity={line.highlighted ? 0.9 : active ? 0.8 : 0.55}
                  markerStart={`url(#${dotId})`}
                  markerEnd={`url(#${dotId})`}
                />
              );
            })}
          </svg>

          {/* Hex board container */}
          <div
            className="board-hex-container"
            style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}
          >
            {/* Decoration hexes (non-interactive terrain) */}
            {decorationHexes.map((deco, i) => {
              const pos = hexToPixel(deco.col, deco.row);
              return (
                <div
                  key={`deco-${i}`}
                  className="hex-decoration"
                  style={{
                    left: pos.x,
                    top: pos.y,
                    width: HEX_WIDTH,
                    height: HEX_HEIGHT,
                    clipPath: HEX_CLIP,
                    WebkitClipPath: HEX_CLIP,
                    backgroundColor: decoColors[deco.type] || decoColors.water,
                  }}
                >
                  {deco.label && (
                    <span className="hex-deco-label">{deco.label}</span>
                  )}
                </div>
              );
            })}

            {/* Territory tiles */}
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
                currentPhase={currentPhase}
                playerFaction={playerFaction}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
