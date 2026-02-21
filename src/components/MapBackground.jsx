import React from 'react';

/**
 * Simplified geographic background for War of 1812 game board
 * Shows basic outlines of coastlines, Great Lakes, and major water features
 * Styled like a RISK board game - simple and clean
 */
export default function MapBackground() {
  return (
    <g id="map-background">
      {/* Water base layer - Atlantic Ocean, Gulf of Mexico */}
      <rect x="0" y="0" width="1400" height="920" fill="#c9d7e8" />

      {/* Simplified Great Lakes */}
      {/* Lake Superior */}
      <ellipse cx="200" cy="180" rx="160" ry="70" fill="#5a8db8" opacity="0.4" />

      {/* Lake Michigan */}
      <ellipse cx="280" cy="350" rx="70" ry="140" fill="#5a8db8" opacity="0.4" />

      {/* Lake Huron */}
      <ellipse cx="450" cy="240" rx="90" ry="100" fill="#5a8db8" opacity="0.4" />

      {/* Lake Erie */}
      <ellipse cx="550" cy="380" rx="120" ry="40" fill="#5a8db8" opacity="0.4" />

      {/* Lake Ontario */}
      <ellipse cx="700" cy="320" rx="80" ry="35" fill="#5a8db8" opacity="0.4" />

      {/* Chesapeake Bay */}
      <path
        d="M 1050,550 Q 1070,580 1060,620 Q 1050,640 1040,650 Q 1030,660 1020,650 Q 1010,640 1015,620 Q 1020,600 1030,570 Q 1040,550 1050,550 Z"
        fill="#5a8db8"
        opacity="0.4"
      />

      {/* Gulf of Mexico */}
      <ellipse cx="300" cy="850" rx="200" ry="60" fill="#5a8db8" opacity="0.3" />

      {/* Land mass outline - simplified eastern North America */}
      <path
        d="
          M 50,50
          L 1300,50
          L 1300,550
          Q 1250,580 1200,600
          L 1100,700
          L 1000,800
          L 800,870
          L 600,900
          L 400,920
          L 200,900
          L 100,850
          L 50,800
          Z
        "
        fill="#e8dcc4"
        stroke="#8b7355"
        strokeWidth="2"
        opacity="0.3"
      />

      {/* Simplified coastline details */}
      {/* Atlantic coast */}
      <path
        d="M 1200,100 Q 1250,200 1250,300 Q 1240,400 1220,500 Q 1200,550 1180,600"
        fill="none"
        stroke="#8b7355"
        strokeWidth="2"
        opacity="0.4"
      />

      {/* Florida peninsula */}
      <path
        d="M 900,800 Q 920,820 930,850 Q 935,880 920,900 Q 900,910 880,900"
        fill="none"
        stroke="#8b7355"
        strokeWidth="2"
        opacity="0.4"
      />
    </g>
  );
}
