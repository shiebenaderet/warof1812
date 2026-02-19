import React, { useRef, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import territories from '../data/territories';
import territoryGeo, { theaterLabels } from '../data/territoryGeo';

const ownerColors = {
  us: { fill: '#1a4fa0', stroke: '#0d3070' },
  british: { fill: '#b82030', stroke: '#8b1528' },
  native: { fill: '#7a5230', stroke: '#5c3d28' },
  neutral: { fill: '#607080', stroke: '#455565' },
};

/** Convert our territory coords [lat,lng] to GeoJSON [lng,lat] polygon. */
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
        theater: terr?.theater || '',
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

/** Style each territory polygon based on owner and naval status. */
function getStyle(feature) {
  const { owner, isNaval } = feature.properties;
  const colors = ownerColors[owner] || ownerColors.neutral;
  return {
    fillColor: colors.fill,
    color: colors.stroke,
    weight: 2,
    opacity: 1,
    fillOpacity: isNaval ? 0.45 : 0.7,
    dashArray: isNaval ? '6 4' : undefined,
  };
}

/** Theater labels rendered as Leaflet divIcon markers. */
function TheaterLabels() {
  const map = useMap();

  useEffect(() => {
    const markers = theaterLabels.map(({ name, pos }) => {
      const icon = L.divIcon({
        className: 'theater-label',
        html: `<span>${name}</span>`,
        iconSize: [200, 24],
        iconAnchor: [100, 12],
      });
      return L.marker(pos, { icon, interactive: false, zIndexOffset: -1000 }).addTo(map);
    });
    return () => markers.forEach((m) => m.remove());
  }, [map]);

  return null;
}

/** Highlight the selected territory with a bright overlay. */
function SelectionOverlay({ selectedTerritory }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedTerritory || !territoryGeo[selectedTerritory]) return;
    const geo = territoryGeo[selectedTerritory];
    const latlngs = geo.coords.map(([lat, lng]) => [lat, lng]);
    const polygon = L.polygon(latlngs, {
      color: '#ffd700',
      weight: 4,
      fillColor: '#ffd700',
      fillOpacity: 0.2,
      dashArray: undefined,
      interactive: false,
    }).addTo(map);
    return () => polygon.remove();
  }, [map, selectedTerritory]);

  return null;
}

/** Troop count markers on each territory. */
function TroopMarkers({ territoryOwners, troops }) {
  const map = useMap();

  useEffect(() => {
    const markers = [];
    Object.entries(territoryGeo).forEach(([id, geo]) => {
      const terr = territories[id];
      const troopCount = troops?.[id] || 0;
      const owner = territoryOwners?.[id] || terr?.startingOwner || 'neutral';
      const colors = ownerColors[owner] || ownerColors.neutral;
      const pts = terr?.points || 0;
      const fort = terr?.hasFort ? ' &#9971;' : '';

      const html = `
        <div class="troop-marker" style="border-color:${colors.stroke}; background:rgba(0,0,0,0.75);">
          <div class="troop-name">${terr?.name || id}${fort}</div>
          ${troopCount > 0 ? `<div class="troop-count" style="background:${colors.fill}">${troopCount}</div>` : ''}
          ${pts > 0 ? `<div class="troop-pts">${pts}pt${pts > 1 ? 's' : ''}</div>` : ''}
        </div>
      `;

      const icon = L.divIcon({
        className: 'troop-icon-wrapper',
        html,
        iconSize: [90, 50],
        iconAnchor: [45, 25],
      });

      markers.push(
        L.marker(geo.labelPos, { icon, interactive: false, zIndexOffset: 1000 }).addTo(map)
      );
    });
    return () => markers.forEach((m) => m.remove());
  }, [map, territoryOwners, troops]);

  return null;
}

export default function Map({ territoryOwners, selectedTerritory, onTerritoryClick, troops }) {
  const geoJsonRef = useRef(null);
  const geoData = useMemo(() => buildGeoJSON(territoryOwners, troops), [territoryOwners, troops]);

  // Force re-render of GeoJSON when data changes
  const geoKey = useMemo(() => JSON.stringify(territoryOwners) + JSON.stringify(troops), [territoryOwners, troops]);

  const onEachFeature = (feature, layer) => {
    const { id } = feature.properties;

    layer.on({
      click: () => onTerritoryClick?.(id),
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({ weight: 3, fillOpacity: 0.9 });
        l.bringToFront();
      },
      mouseout: (e) => {
        const l = e.target;
        const style = getStyle(feature);
        l.setStyle(style);
      },
    });
  };

  // Center on eastern North America
  const center = [39.0, -78.0];
  const bounds = [[26.0, -94.0], [50.0, -56.0]];

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
      {/* Vintage / muted tile layer */}
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
        opacity={0.4}
      />
      {/* Second layer for land features */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        opacity={0.5}
      />

      {/* Territory polygons */}
      <GeoJSON
        key={geoKey}
        ref={geoJsonRef}
        data={geoData}
        style={getStyle}
        onEachFeature={onEachFeature}
      />

      {/* Selection highlight */}
      <SelectionOverlay selectedTerritory={selectedTerritory} />

      {/* Theater region labels */}
      <TheaterLabels />

      {/* Troop counts and territory names */}
      <TroopMarkers territoryOwners={territoryOwners} troops={troops} />
    </MapContainer>
  );
}
