import { geoPath, geoAlbers } from 'd3-geo';

/**
 * Map Projection Utility for War of 1812 Game
 *
 * Converts real lat/lng coordinates to SVG paths using Albers conic projection,
 * optimized for the eastern United States and Canada theater.
 */

// SVG viewport dimensions
const MAP_WIDTH = 1400;
const MAP_HEIGHT = 920;

/**
 * Create an Albers conic projection centered on the War of 1812 theater
 * Auto-fits to the provided territory bounds with padding
 * @param {Object} territoryGeo - Territory geographic data for bounds calculation
 */
function createProjection(territoryGeo = null) {
  const projection = geoAlbers()
    .center([-77, 40])           // Center on mid-Atlantic (roughly DC/NY area)
    .rotate([0, 0])              // No rotation
    .parallels([33, 45]);        // Standard parallels for eastern US

  if (!territoryGeo) {
    // Return default projection if no bounds provided
    return projection
      .scale(3500)
      .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);
  }

  // Calculate geographic bounds
  const [[minLng, minLat], [maxLng, maxLat]] = calculateBounds(territoryGeo);

  // Create initial projection for bounds calculation
  projection.scale(1).translate([0, 0]);

  const pathGenerator = geoPath().projection(projection);

  // Create a GeoJSON feature collection of all territories
  const features = Object.values(territoryGeo)
    .filter(t => t.coords)
    .map(t => ({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [t.coords.map(([lat, lng]) => [lng, lat])]
      }
    }));

  const featureCollection = {
    type: 'FeatureCollection',
    features
  };

  // Get bounds in pixel space
  const bounds = pathGenerator.bounds(featureCollection);
  const [[x0, y0], [x1, y1]] = bounds;

  const width = x1 - x0;
  const height = y1 - y0;

  // Add 5% padding on all sides
  const padding = 0.05;
  const targetWidth = MAP_WIDTH * (1 - 2 * padding);
  const targetHeight = MAP_HEIGHT * (1 - 2 * padding);

  // Calculate scale to fit with padding
  const scale = Math.min(targetWidth / width, targetHeight / height);

  // Calculate translation to center the map
  const translateX = MAP_WIDTH / 2 - (x0 + width / 2) * scale;
  const translateY = MAP_HEIGHT / 2 - (y0 + height / 2) * scale;

  return projection
    .scale(scale)
    .translate([translateX, translateY]);
}

/**
 * Calculate the bounds of all territories to auto-fit the map
 * @param {Object} territoryGeo - Territory geographic data with coords arrays
 * @returns {Array} [[minLng, minLat], [maxLng, maxLat]]
 */
function calculateBounds(territoryGeo) {
  let minLat = Infinity, maxLat = -Infinity;
  let minLng = Infinity, maxLng = -Infinity;

  Object.values(territoryGeo).forEach((territory) => {
    if (!territory.coords) return;

    territory.coords.forEach(([lat, lng]) => {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    });
  });

  return [[minLng, minLat], [maxLng, maxLat]];
}

/**
 * Convert lat/lng coordinate array to SVG path string
 * @param {Array} coords - Array of [lat, lng] pairs
 * @param {Function} projection - d3-geo projection function
 * @returns {String} SVG path d attribute
 */
function coordsToPath(coords, projection) {
  const pathGenerator = geoPath().projection(projection);

  // Convert to GeoJSON format
  const geojson = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [coords.map(([lat, lng]) => [lng, lat])] // GeoJSON uses [lng, lat]
    }
  };

  return pathGenerator(geojson);
}

/**
 * Calculate the centroid of a polygon in SVG coordinates
 * @param {Array} coords - Array of [lat, lng] pairs
 * @param {Function} projection - d3-geo projection function
 * @returns {Object} {x, y} centroid position
 */
function calculateCentroid(coords, projection) {
  const geojson = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [coords.map(([lat, lng]) => [lng, lat])]
    }
  };

  const pathGenerator = geoPath().projection(projection);
  const centroid = pathGenerator.centroid(geojson);

  return { x: centroid[0], y: centroid[1] };
}

/**
 * Project a single lat/lng point to SVG coordinates
 * @param {Array} latLng - [lat, lng] coordinate pair
 * @param {Function} projection - d3-geo projection function
 * @returns {Object} {x, y} position
 */
function projectPoint(latLng, projection) {
  const [lat, lng] = latLng;
  const [x, y] = projection([lng, lat]);
  return { x, y };
}

/**
 * Generate SVG polygon data for all territories
 * @param {Object} territoryGeo - Territory geographic data from territoryGeo.js
 * @returns {Object} Map of territoryId -> {d, centroid, labelPosition}
 */
export function generateTerritoryPolygons(territoryGeo) {
  // Create projection that auto-fits to territory bounds
  const projection = createProjection(territoryGeo);
  const polygons = {};

  Object.entries(territoryGeo).forEach(([territoryId, data]) => {
    if (!data.coords) return;

    const pathD = coordsToPath(data.coords, projection);
    const centroid = calculateCentroid(data.coords, projection);

    // Use provided labelPos if available, otherwise use centroid
    const labelPosition = data.labelPos
      ? projectPoint(data.labelPos, projection)
      : centroid;

    polygons[territoryId] = {
      d: pathD,
      centroid,
      labelPosition,
      // Calculate troop badge position (offset from label)
      troopPosition: {
        x: labelPosition.x - 25,
        y: labelPosition.y + 35
      },
      // Calculate points badge position (offset from label)
      pointsPosition: {
        x: labelPosition.x + 35,
        y: labelPosition.y - 25
      }
    };
  });

  return polygons;
}

/**
 * Project theater labels to SVG coordinates
 * @param {Array} theaterLabels - Array of {name, pos: [lat, lng]}
 * @param {Object} territoryGeo - Territory geographic data for bounds calculation
 * @returns {Array} Array of {name, x, y}
 */
export function projectTheaterLabels(theaterLabels, territoryGeo) {
  const projection = createProjection(territoryGeo);

  return theaterLabels.map(({ name, pos }) => ({
    name,
    ...projectPoint(pos, projection)
  }));
}

export { createProjection, calculateBounds, coordsToPath, calculateCentroid, projectPoint };
