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
  water:    'rgba(30, 100, 220, 0.55)',
  mountain: 'rgba(140, 120, 100, 0.65)',
  forest:   'rgba(22, 101, 52, 0.55)',
};

export default function GameBoardMap({
  territoryOwners,
  selectedTerritory,
  onTerritoryClick,
  troops,
  currentPhase,
  playerFaction,
}) {
  const [zoom, setZoom] = useState(null); // null until auto-fit calculates
  const containerRef = useRef(null);
  const fitZoomRef = useRef(1.0);
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

  // Neighbor highlight: show outlines around all logical neighbors of selected/hovered tile
  const neighborHighlightIds = useMemo(() => {
    const active = selectedTerritory || hoveredTerritory;
    if (!active) return new Set();
    return new Set(territories[active]?.adjacency ?? []);
  }, [selectedTerritory, hoveredTerritory]);

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
          className="board-content"
          style={{
            transform: `scale(${zoom || 1.0})`,
            transition: 'transform 0.25s ease-out',
          }}
        >
          {/* Hex board container */}
          <div
            className="board-hex-container"
            style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}
          >
            {/* Neighbor highlight hexes — rendered first so they appear behind tiles */}
            {Array.from(neighborHighlightIds).flatMap((adjId) => {
              const adjTerr = territories[adjId];
              if (!adjTerr) return [];
              return adjTerr.hexCells.map((cell, i) => {
                const pos = hexToPixel(cell.col, cell.row);
                return (
                  <div
                    key={`hl-${adjId}-${i}`}
                    style={{
                      position: 'absolute',
                      left: pos.x - 5,
                      top: pos.y - 5,
                      width: HEX_WIDTH + 10,
                      height: HEX_HEIGHT + 10,
                      clipPath: HEX_CLIP,
                      WebkitClipPath: HEX_CLIP,
                      backgroundColor: 'rgba(251, 191, 36, 0.75)',
                      zIndex: 1,
                      pointerEvents: 'none',
                    }}
                  />
                );
              });
            })}

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
