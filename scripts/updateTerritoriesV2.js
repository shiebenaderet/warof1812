/**
 * Update territories.js with generated geographic polygon data
 * Properly replaces old values instead of duplicating
 * Run with: node scripts/updateTerritoriesV2.js
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

// For each territory, update its polygon data
Object.entries(polygons).forEach(([territoryId, polygonData]) => {
  // Find the territory object by looking for "  territoryId: {" followed by its properties
  const territoryPattern = new RegExp(
    `(\\s+${territoryId}:\\s*\\{[\\s\\S]*?)(\\},\\s*(?=\\w+:|\\};))`,
    ''
  );

  if (!territoryPattern.test(territoriesContent)) {
    console.log(`⚠ Territory not found: ${territoryId}`);
    return;
  }

  // Extract the territory object content
  const match = territoriesContent.match(territoryPattern);
  if (!match) return;

  let territoryContent = match[1];

  // Replace polygon.d
  territoryContent = territoryContent.replace(
    /polygon:\s*\{[^}]*\},?/,
    `polygon: {\n      d: '${polygonData.d}',\n    },`
  );

  // Replace centroid
  territoryContent = territoryContent.replace(
    /centroid:\s*\{[^}]*\},?/,
    `centroid: { x: ${polygonData.centroid.x.toFixed(2)}, y: ${polygonData.centroid.y.toFixed(2)} },`
  );

  // Replace labelPosition
  territoryContent = territoryContent.replace(
    /labelPosition:\s*\{[^}]*\},?/,
    `labelPosition: { x: ${polygonData.labelPosition.x.toFixed(2)}, y: ${polygonData.labelPosition.y.toFixed(2)} },`
  );

  // Replace troopPosition
  territoryContent = territoryContent.replace(
    /troopPosition:\s*\{[^}]*\},?/,
    `troopPosition: { x: ${polygonData.troopPosition.x.toFixed(2)}, y: ${polygonData.troopPosition.y.toFixed(2)} },`
  );

  // Replace pointsPosition
  territoryContent = territoryContent.replace(
    /pointsPosition:\s*\{[^}]*\},?/,
    `pointsPosition: { x: ${polygonData.pointsPosition.x.toFixed(2)}, y: ${polygonData.pointsPosition.y.toFixed(2)} },`
  );

  // Reconstruct the full territory pattern and replace in content
  territoriesContent = territoriesContent.replace(territoryPattern, territoryContent + '},');

  updateCount++;
  console.log(`✓ Updated ${territoryId}`);
});

// Write back to territories.js
fs.writeFileSync(territoriesPath, territoriesContent);

console.log(`\n✓ Successfully updated ${updateCount}/23 territories`);
console.log('territories.js has been updated with geographic polygon data');
