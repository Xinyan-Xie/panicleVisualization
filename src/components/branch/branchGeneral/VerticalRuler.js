import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function VerticalRuler(container, width, height) {

    const margin = { top: 20, right: 5, bottom: 20, left: 10 },
          innerWidth = width - margin.left - margin.right,
          innerHeight = height - margin.top - margin.bottom;

    d3.select(container).selectAll('*').remove();
    const svg = d3.select(container)
                .append("svg")
                .attr('width', width)
                .attr('height', height);

    // Define the scale
    var yScale = d3.scaleLinear()
                   .domain([60, 280]) // Example domain
                   .range([innerHeight, 0]);

    // Define the axis
    var yAxis = d3.axisLeft(yScale)
                  .tickValues(d3.range(60, 280, 20)); // Show only integer ticks

    // Customize the tick marks
    yAxis.tickFormat(function(d) {
        if (d % 1 !== 0) {
            // To show decimal ticks
            return ''; // Shorten decimal ticks or hide them
        } else {
            return d; // Keep integer ticks as they are
        }
    });

    // Append the axis to the SVG
    svg.append("g")
       .attr("transform", "translate(" + margin.left + ",0)")
       .call(yAxis)
       .selectAll("line")
       .attr("x2", function(d) { return d % 1 !== 0 ? 5 : 10; }) // Customize tick lengths
       .attr("stroke-width", function(d) { return d % 1 !== 0 ? 1 : 1.5; }); // Customize tick thickness

    svg.selectAll(".tick text")
       .attr("x", 15)
       .attr("font-size", 15)
       .attr("font-weight", "bold");


}

export default VerticalRuler;
