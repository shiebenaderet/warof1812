/**
 * Update territories.js with generated geographic polygon data
 * Run with: node scripts/updateTerritories.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load generated polygons
const polygonsPath = path.join(__dirname, 'generated-polygons.json');
const polygons = JSON.parse(fs.readFileSync(polygonsPath, 'utf8'));

// Read territories.js
const territoriesPath = path.join(__dirname, '../src/data/territories.js');
let territoriesContent = fs.readFileSync(territoriesPath, 'utf8');

console.log('Updating territories.js with geographic polygon data...\n');

let updateCount = 0;
let notFoundCount = 0;

// For each generated polygon, update the corresponding territory
Object.entries(polygons).forEach(([territoryId, polygonData]) => {
  // Check if this territory exists in territories.js
  const territoryPattern = new RegExp(`${territoryId}:\\s*{[^}]*id:\\s*['"]${territoryId}['"]`, 'i');

  if (!territoryPattern.test(territoriesContent)) {
    console.log(`⚠ Territory not found in territories.js: ${territoryId}`);
    notFoundCount++;
    return;
  }

  // Find and replace the polygon, centroid, labelPosition, troopPosition, and pointsPosition
  // This regex finds the entire territory object
  const fullTerritoryRegex = new RegExp(
    `(${territoryId}:\\s*{[\\s\\S]*?)` + // Start of territory object
    `(polygon:\\s*{[^}]*},?\\s*)` +       // polygon object
    `([\\s\\S]*?` +                       // content between polygon and centroid
    `centroid:\\s*{[^}]*},?\\s*)` +       // centroid object
    `([\\s\\S]*?` +                       // content between centroid and labelPosition
    `labelPosition:\\s*{[^}]*},?\\s*)` +  // labelPosition object
    `([\\s\\S]*?` +                       // content between labelPosition and troopPosition
    `troopPosition:\\s*{[^}]*},?\\s*)` +  // troopPosition object
    `([\\s\\S]*?` +                       // content between troopPosition and pointsPosition
    `pointsPosition:\\s*{[^}]*},?\\s*)`,  // pointsPosition object
    'i'
  );

  const newPolygon = `polygon: {\n      d: '${polygonData.d}',\n    },`;
  const newCentroid = `centroid: { x: ${polygonData.centroid.x.toFixed(2)}, y: ${polygonData.centroid.y.toFixed(2)} },`;
  const newLabelPos = `labelPosition: { x: ${polygonData.labelPosition.x.toFixed(2)}, y: ${polygonData.labelPosition.y.toFixed(2)} },`;
  const newTroopPos = `troopPosition: { x: ${polygonData.troopPosition.x.toFixed(2)}, y: ${polygonData.troopPosition.y.toFixed(2)} },`;
  const newPointsPos = `pointsPosition: { x: ${polygonData.pointsPosition.x.toFixed(2)}, y: ${polygonData.pointsPosition.y.toFixed(2)} },`;

  territoriesContent = territoriesContent.replace(
    fullTerritoryRegex,
    `$1${newPolygon}\n    $3${newCentroid}\n    $5${newLabelPos}\n    $7${newTroopPos}\n    $9${newPointsPos}\n    `
  );

  updateCount++;
  console.log(`✓ Updated ${territoryId}`);
});

// Write back to territories.js
fs.writeFileSync(territoriesPath, territoriesContent);

console.log(`\n✓ Updated ${updateCount} territories`);
if (notFoundCount > 0) {
  console.log(`⚠ ${notFoundCount} territories not found in territories.js`);
}
console.log('\nterritories.js has been updated with geographic polygon data');
