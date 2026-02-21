#!/usr/bin/env python3
"""
Update territories.js with generated geographic polygon data
"""

import json
import re

# Load generated polygons
with open('scripts/generated-polygons.json', 'r') as f:
    polygons = json.load(f)

# Read territories.js
with open('src/data/territories.js', 'r') as f:
    content = f.read()

print('Updating territories.js with geographic polygon data...\n')

# For each territory, update its data
for territory_id, data in polygons.items():
    print(f'Updating {territory_id}...')

    # Create regex pattern to match the entire territory object
    # Pattern: "  territoryId: {" ... "  },"
    pattern = rf'(  {territory_id}:\s*{{.*?)(  }},)'

    match = re.search(pattern, content, re.DOTALL)
    if not match:
        print(f'  ⚠ Could not find {territory_id}')
        continue

    territory_block = match.group(1)

    # Replace polygon.d
    territory_block = re.sub(
        r"(polygon:\s*{\s*d:\s*)'[^']*'",
        rf"\1'{data['d']}'",
        territory_block
    )

    # Replace centroid
    territory_block = re.sub(
        r'centroid:\s*{[^}]*}',
        f"centroid: {{ x: {data['centroid']['x']:.2f}, y: {data['centroid']['y']:.2f} }}",
        territory_block
    )

    # Replace labelPosition
    territory_block = re.sub(
        r'labelPosition:\s*{[^}]*}',
        f"labelPosition: {{ x: {data['labelPosition']['x']:.2f}, y: {data['labelPosition']['y']:.2f} }}",
        territory_block
    )

    # Replace troopPosition
    territory_block = re.sub(
        r'troopPosition:\s*{[^}]*}',
        f"troopPosition: {{ x: {data['troopPosition']['x']:.2f}, y: {data['troopPosition']['y']:.2f} }}",
        territory_block
    )

    # Replace pointsPosition
    territory_block = re.sub(
        r'pointsPosition:\s*{[^}]*}',
        f"pointsPosition: {{ x: {data['pointsPosition']['x']:.2f}, y: {data['pointsPosition']['y']:.2f} }}",
        territory_block
    )

    # Replace in content
    content = re.sub(pattern, territory_block + '  },', content, count=1, flags=re.DOTALL)

    print(f'  ✓ Updated')

# Write back
with open('src/data/territories.js', 'w') as f:
    f.write(content)

print('\n✓ Updated territories.js with geographic polygon data')
