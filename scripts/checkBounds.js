/**
 * Check bounds of generated polygons to ensure they fit in viewBox
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const polygonsPath = path.join(__dirname, 'generated-polygons.json');
const polygons = JSON.parse(fs.readFileSync(polygonsPath, 'utf8'));

let minX = Infinity, maxX = -Infinity;
let minY = Infinity, maxY = -Infinity;

Object.entries(polygons).forEach(([id, data]) => {
  // Check label position
  if (data.labelPosition) {
    minX = Math.min(minX, data.labelPosition.x);
    maxX = Math.max(maxX, data.labelPosition.x);
    minY = Math.min(minY, data.labelPosition.y);
    maxY = Math.max(maxY, data.labelPosition.y);
  }

  // Parse path to find all coordinates
  const pathData = data.d;
  const coords = pathData.match(/-?\d+\.?\d*/g);
  if (coords) {
    for (let i = 0; i < coords.length; i += 2) {
      const x = parseFloat(coords[i]);
      const y = parseFloat(coords[i + 1]);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
});

console.log('Current bounds:');
console.log('  X:', minX.toFixed(2), 'to', maxX.toFixed(2), '(range:', (maxX - minX).toFixed(2), ')');
console.log('  Y:', minY.toFixed(2), 'to', maxY.toFixed(2), '(range:', (maxY - minY).toFixed(2), ')');
console.log('\nTarget viewBox: 1400 × 920');
console.log('\nAdjustments needed:');
console.log('  X offset:', (-minX).toFixed(2));
console.log('  Y offset:', (-minY).toFixed(2));
console.log('  Scale factor:', Math.min(1400 / (maxX - minX), 920 / (maxY - minY)).toFixed(3));

// Calculate territories outside bounds
const outsideBounds = [];
Object.entries(polygons).forEach(([id, data]) => {
  const { x, y } = data.labelPosition;
  if (x < 0 || x > 1400 || y < 0 || y > 920) {
    outsideBounds.push({
      id,
      x: x.toFixed(2),
      y: y.toFixed(2),
      outside: [
        x < 0 ? 'left' : x > 1400 ? 'right' : '',
        y < 0 ? 'top' : y > 920 ? 'bottom' : ''
      ].filter(Boolean).join(', ')
    });
  }
});

if (outsideBounds.length > 0) {
  console.log('\n⚠ Territories outside viewBox:', outsideBounds.length);
  outsideBounds.forEach(t => {
    console.log(`  ${t.id}: (${t.x}, ${t.y}) - ${t.outside}`);
  });
} else {
  console.log('\n✓ All territories fit within viewBox');
}
