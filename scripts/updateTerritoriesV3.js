/**
 * Update territories.js with generated geographic polygon data
 * Uses simple line-by-line replacement
 * Run with: node scripts/updateTerritoriesV3.js
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
let content = fs.readFileSync(territoriesPath, 'utf8');

console.log('Updating territories.js with geographic polygon data...\n');

// For each territory, do a multi-line replacement
Object.entries(polygons).forEach(([territoryId, data]) => {
  console.log(`Updating ${territoryId}...`);

  // Create a regex to find the entire territory block
  // Match from "  territoryId: {" to the next closing "},"
  const territoryBlockRegex = new RegExp(
    `(  ${territoryId}:\\s*\\{[\\s\\S]*?)(  \\},)`,
    'm'
  );

  const match = content.match(territoryBlockRegex);
  if (!match) {
    console.log(`  ⚠ Could not find territory block for ${territoryId}`);
    return;
  }

  let block = match[1];

  // Replace polygon.d value
  block = block.replace(
    /(polygon:\s*\{\s*d:\s*)'[^']*'/,
    `$1'${data.d}'`
  );

  // Replace centroid
  block = block.replace(
    /centroid:\s*\{[^}]*\}/,
    `centroid: { x: ${data.centroid.x.toFixed(2)}, y: ${data.centroid.y.toFixed(2)} }`
  );

  // Replace labelPosition
  block = block.replace(
    /labelPosition:\s*\{[^}]*\}/,
    `labelPosition: { x: ${data.labelPosition.x.toFixed(2)}, y: ${data.labelPosition.y.toFixed(2)} }`
  );

  // Replace troopPosition
  block = block.replace(
    /troopPosition:\s*\{[^}]*\}/,
    `troopPosition: { x: ${data.troopPosition.x.toFixed(2)}, y: ${data.troopPosition.y.toFixed(2)} }`
  );

  // Replace pointsPosition
  block = block.replace(
    /pointsPosition:\s*\{[^}]*\}/,
    `pointsPosition: { x: ${data.pointsPosition.x.toFixed(2)}, y: ${data.pointsPosition.y.toFixed(2)} }`
  );

  // Replace the entire territory block in content
  content = content.replace(territoryBlockRegex, block + '  },');

  console.log(`  ✓ Updated`);
});

// Write back
fs.writeFileSync(territoriesPath, content);

console.log('\n✓ Updated territories.js with geographic polygon data');
