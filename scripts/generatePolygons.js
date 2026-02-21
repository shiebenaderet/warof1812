/**
 * Script to generate SVG polygon data from real lat/lng coordinates
 * Run with: node scripts/generatePolygons.js
 */

import { generateTerritoryPolygons } from '../src/utils/mapProjection.js';
import territoryGeo from '../src/data/territoryGeo.js';

// Generate all polygon data
const polygons = generateTerritoryPolygons(territoryGeo);

// Output as JSON for easy inspection
console.log('Generated polygon data for', Object.keys(polygons).length, 'territories\n');

// Output sample for verification
const sampleTerritories = ['upper_canada', 'new_york', 'new_orleans', 'chesapeake_bay'];

sampleTerritories.forEach(id => {
  if (polygons[id]) {
    console.log(`\n${id}:`);
    console.log('  Path length:', polygons[id].d?.length || 0, 'chars');
    console.log('  Label position:', polygons[id].labelPosition);
    console.log('  Centroid:', polygons[id].centroid);
  }
});

// Write full output to file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, 'generated-polygons.json');
fs.writeFileSync(outputPath, JSON.stringify(polygons, null, 2));

console.log('\n✓ Full polygon data written to:', outputPath);
