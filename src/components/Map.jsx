import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import territories from '../data/territories';
import territoryGeo, { theaterLabels } from '../data/territoryGeo';

const ownerColors = {
  us:      { fill: '#2563eb', stroke: '#1e40af' },
  british: { fill: '#dc2626', stroke: '#991b1b' },
  native:  { fill: '#a16207', stroke: '#78350f' },
  neutral: { fill: '#6b7280', stroke: '#4b5563' },
};

/** Build a GeoJSON FeatureCollection from territory data. */
function buildGeoJSON(territoryOwners, troops) {
  const features = Object.entries(territoryGeo).map(([id, geo]) => {
    const terr = territories[id];
    const owner = territoryOwners?.[id] || terr?.startingOwner || 'neutral';
    const troopCount = troops?.[id] || 0;
    return {
      type: 'Feature',
      properties: {
        id,
        name: terr?.name || id,
        owner,
        troopCount,
        points: terr?.points || 0,
        hasFort: terr?.hasFort || false,
        isNaval: terr?.isNaval || false,
        labelPos: geo.labelPos,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [geo.coords.map(([lat, lng]) => [lng, lat])],
      },
    };
  });
  return { type: 'FeatureCollection', features };
}

/** Style each territory: thick bright borders, solid fills. */
function getStyle(feature) {
  const { owner, isNaval } = feature.properties;
  const colors = ownerColors[owner] || ownerColors.neutral;
  return {
    fillColor: colors.fill,
    color: '#d4c5a0',       // Light parchment border — visible on any fill
    weight: 3,
    opacity: 0.9,
    fillOpacity: isNaval ? 0.4 : 0.75,
    dashArray: isNaval ? '8 5' : undefined,
  };
}

/** Simple text labels on each territory — name + troop count circle. */
function TerritoryLabels({ territoryOwners, troops }) {
  const map = useMap();

  useEffect(() => {
    const markers = [];
    Object.entries(territoryGeo).forEach(([id, geo]) => {
      const terr = territories[id];
      if (!terr) return;
      const troopCount = troops?.[id] || 0;
      const owner = territoryOwners?.[id] || terr.startingOwner || 'neutral';
      const colors = ownerColors[owner] || ownerColors.neutral;
      const fort = terr.hasFort ? ' \u2767' : '';

      // Troop badge: small colored circle with number
      const troopBadge = troopCount > 0
        ? `<span class="terr-troops" style="background:${colors.fill};border-color:${colors.stroke}">${troopCount}</span>`
        : '';

      const html = `<div class="terr-label">`
        + `<span class="terr-name">${terr.name}${fort}</span>`
        + troopBadge
        + `</div>`;

      const icon = L.divIcon({
        className: 'terr-label-wrapper',
        html,
        iconSize: [0, 0],   // No fixed size — content determines size
        iconAnchor: [0, 0],
      });

      markers.push(
        L.marker(geo.labelPos, { icon, interactive: false, zIndexOffset: 1000 }).addTo(map)
      );
    });
    return () => markers.forEach((m) => m.remove());
  }, [map, territoryOwners, troops]);

  return null;
}

/** Theater labels — subtle italic text. */
function TheaterLabels() {
  const map = useMap();

  useEffect(() => {
    const markers = theaterLabels.map(({ name, pos }) => {
      const icon = L.divIcon({
        className: 'theater-label',
        html: `<span>${name}</span>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });
      return L.marker(pos, { icon, interactive: false, zIndexOffset: -1000 }).addTo(map);
    });
    return () => markers.forEach((m) => m.remove());
  }, [map]);

  return null;
}

/** Gold highlight for the selected territory. */
function SelectionOverlay({ selectedTerritory }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedTerritory || !territoryGeo[selectedTerritory]) return;
    const geo = territoryGeo[selectedTerritory];
    const latlngs = geo.coords.map(([lat, lng]) => [lat, lng]);
    const polygon = L.polygon(latlngs, {
      color: '#ffd700',
      weight: 5,
      fillColor: '#ffd700',
      fillOpacity: 0.15,
      interactive: false,
    }).addTo(map);
    return () => polygon.remove();
  }, [map, selectedTerritory]);

  return null;
}

/** Highlight valid attack/maneuver targets for selected territory. */
function TargetOverlay({ selectedTerritory, currentPhase, playerFaction, territoryOwners }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedTerritory || !territoryGeo[selectedTerritory]) return;
    if (currentPhase !== 'battle' && currentPhase !== 'maneuver') return;

    const terr = territories[selectedTerritory];
    if (!terr) return;

    const polygons = [];
    for (const adjId of terr.adjacency) {
      const adjGeo = territoryGeo[adjId];
      if (!adjGeo) continue;
      const adjOwner = territoryOwners?.[adjId];

      let isValid = false;
      let color = '#ffffff';

      if (currentPhase === 'battle') {
        // Valid attack target: not owned by player
        isValid = adjOwner !== playerFaction;
        color = '#ff4444';
      } else if (currentPhase === 'maneuver') {
        // Valid maneuver target: owned by player
        isValid = adjOwner === playerFaction;
        color = '#44ff44';
      }

      if (!isValid) continue;

      const latlngs = adjGeo.coords.map(([lat, lng]) => [lat, lng]);
      const polygon = L.polygon(latlngs, {
        color,
        weight: 3,
        fillColor: color,
        fillOpacity: 0.12,
        dashArray: '6 4',
        interactive: false,
      }).addTo(map);
      polygons.push(polygon);
    }
    return () => polygons.forEach((p) => p.remove());
  }, [map, selectedTerritory, currentPhase, playerFaction, territoryOwners]);

  return null;
}

export default function Map({ territoryOwners, selectedTerritory, onTerritoryClick, troops, currentPhase, playerFaction }) {
  const geoData = useMemo(() => buildGeoJSON(territoryOwners, troops), [territoryOwners, troops]);
  const geoKey = useMemo(
    () => JSON.stringify(territoryOwners) + JSON.stringify(troops),
    [territoryOwners, troops]
  );

  const onEachFeature = (feature, layer) => {
    const { id } = feature.properties;
    layer.on({
      click: () => onTerritoryClick?.(id),
      mouseover: (e) => {
        e.target.setStyle({ weight: 5, fillOpacity: 0.9, color: '#fff' });
        e.target.bringToFront();
      },
      mouseout: (e) => {
        e.target.setStyle(getStyle(feature));
      },
    });
  };

  const center = [38.5, -79.0];
  const bounds = [[25.0, -95.0], [51.0, -55.0]];

  return (
    <MapContainer
      center={center}
      zoom={5}
      minZoom={4}
      maxZoom={7}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
      style={{ width: '100%', height: '100%', minHeight: '500px', background: '#1a2744' }}
      zoomControl={true}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        opacity={0.6}
      />

      <GeoJSON
        key={geoKey}
        data={geoData}
        style={getStyle}
        onEachFeature={onEachFeature}
      />

      <SelectionOverlay selectedTerritory={selectedTerritory} />
      <TargetOverlay
        selectedTerritory={selectedTerritory}
        currentPhase={currentPhase}
        playerFaction={playerFaction}
        territoryOwners={territoryOwners}
      />
      <TheaterLabels />
      <TerritoryLabels territoryOwners={territoryOwners} troops={troops} />
    </MapContainer>
  );
}
