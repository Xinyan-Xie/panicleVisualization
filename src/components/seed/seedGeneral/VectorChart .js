import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export function VectorChart( container, data, colors, width, height ) {

    const vectors = [];
    const minLength = Math.min(data["4D"].length, 
                               data["7D"].length, 
                               data["10D"].length);

    for (let i = 0; i < minLength; i++) {
      const a = data["4D"][i];
      const b = data["7D"][i];
      const c = data["10D"][i];

      // Add vector from A to B if both are valid
      if (a[0] !== -1 && b[0] !== -1) {
        vectors.push([a, b]);
      }

      // Add vector from B to C if both are valid
      if (b[0] !== -1 && c[0] !== -1) {
        vectors.push([b, c]);
      }

    //   // Add vector from A to C via B if all are valid
    //   if (a[0] !== -1 && b[0] !== -1 && c[0] !== -1) {
    //     vectors.push([a, b, c]);
    //   }
    }

    
    d3.select(container).selectAll('*').remove();
    const svg = d3.select(container).append("svg")
    .attr('width', width)
    .attr('height', height)
    .append('g');

    const colorScale = d3.scaleOrdinal().range(colors);

    // Define arrowhead marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 5)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 Z')
      .attr('fill', 'black');

    // Draw vectors with arrows
    vectors.forEach(vector => {
      svg.append('path')
        .attr('d', d3.line()(vector))
        .attr('class', 'vector')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('marker-end', 'url(#arrowhead)');
    });

    // Draw circles at data points for visualization
    const allPoints = data.A.concat(data.B, data.C).filter(point => point[0] !== -1);

    svg.selectAll('circle')
      .data(allPoints)
      .enter()
      .append('circle')
      .attr('cx', d => d[0])  // Scale x position
      .attr('cy', d => d[1])  // Scale y position
      .attr('r', 5)
      .attr('fill', (d, i) => {
        if (i < data.A.length) return colorScale('A');
        if (i < data.A.length + data.B.length) return colorScale('B');
        return colorScale('C');
      });
};


