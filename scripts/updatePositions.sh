#!/bin/bash
# Update position values for all territories

# Read generated polygons and create sed commands
cat scripts/generated-polygons.json | python3 -c "
import json
import sys

polygons = json.load(sys.stdin)

for tid, data in polygons.items():
    # Skip detroit since it's already updated
    if tid == 'detroit':
        continue

    cent_x = f\"{data['centroid']['x']:.2f}\"
    cent_y = f\"{data['centroid']['y']:.2f}\"

    label_x = f\"{data['labelPosition']['x']:.2f}\"
    label_y = f\"{data['labelPosition']['y']:.2f}\"

    troop_x = f\"{data['troopPosition']['x']:.2f}\"
    troop_y = f\"{data['troopPosition']['y']:.2f}\"

    points_x = f\"{data['pointsPosition']['x']:.2f}\"
    points_y = f\"{data['pointsPosition']['y']:.2f}\"

    # Find the line numbers for this territory's positions using grep
    print(f'# Updating {tid}')
    print(f'sed -i.bak \\'/  {tid}: {{/,/  }},/{{ s/centroid: {{ x: [^,]*, y: [^}}]* }}/centroid: {{ x: {cent_x}, y: {cent_y} }}/; s/labelPosition: {{ x: [^,]*, y: [^}}]* }}/labelPosition: {{ x: {label_x}, y: {label_y} }}/; s/troopPosition: {{ x: [^,]*, y: [^}}]* }}/troopPosition: {{ x: {troop_x}, y: {troop_y} }}/; s/pointsPosition: {{ x: [^,]*, y: [^}}]* }}/pointsPosition: {{ x: {points_x}, y: {points_y} }}/; }}\\' src/data/territories.js')
"
