#!/usr/bin/env python3
"""
Completely update all territory polygon data at once
"""

import json
import re

# Load generated polygons
with open('scripts/generated-polygons.json', 'r') as f:
    polygons = json.load(f)

# Read territories.js
with open('src/data/territories.js', 'r') as f:
    lines = f.readlines()

print('Updating all territory polygon data...\n')

# For each territory, find and replace ALL its polygon-related fields
for territory_id, data in polygons.items():
    print(f'Updating {territory_id}...')

    in_territory = False
    territory_indent = None
    i = 0

    while i < len(lines):
        line = lines[i]

        # Detect start of territory block
        if re.match(rf'^\s+{territory_id}:\s*{{', line):
            in_territory = True
            territory_indent = len(line) - len(line.lstrip())
            i += 1
            continue

        # Inside the territory block
        if in_territory:
            # Check if we've exited the territory (closing brace at same indent level)
            if re.match(rf'^\s{{{territory_indent}}}\}},', line):
                in_territory = False
                i += 1
                continue

            # Replace polygon.d
            if 'polygon:' in line and i + 1 < len(lines) and "d: '" in lines[i + 1]:
                lines[i + 1] = re.sub(
                    r"d: '[^']*'",
                    f"d: '{data['d']}'",
                    lines[i + 1]
                )

            # Replace centroid
            if 'centroid:' in line:
                lines[i] = re.sub(
                    r'centroid: \{[^}]*\}',
                    f"centroid: {{ x: {data['centroid']['x']:.2f}, y: {data['centroid']['y']:.2f} }}",
                    lines[i]
                )

            # Replace labelPosition
            if 'labelPosition:' in line:
                lines[i] = re.sub(
                    r'labelPosition: \{[^}]*\}',
                    f"labelPosition: {{ x: {data['labelPosition']['x']:.2f}, y: {data['labelPosition']['y']:.2f} }}",
                    lines[i]
                )

            # Replace troopPosition
            if 'troopPosition:' in line:
                lines[i] = re.sub(
                    r'troopPosition: \{[^}]*\}',
                    f"troopPosition: {{ x: {data['troopPosition']['x']:.2f}, y: {data['troopPosition']['y']:.2f} }}",
                    lines[i]
                )

            # Replace pointsPosition
            if 'pointsPosition:' in line:
                lines[i] = re.sub(
                    r'pointsPosition: \{[^}]*\}',
                    f"pointsPosition: {{ x: {data['pointsPosition']['x']:.2f}, y: {data['pointsPosition']['y']:.2f} }}",
                    lines[i]
                )

        i += 1

    print(f'  ✓ Updated')

# Write back
with open('src/data/territories.js', 'w') as f:
    f.writelines(lines)

print('\n✓ All territories updated with geographic polygon data')
print('The map should now display the actual geography of eastern North America!')
