// RadarChartComponent.js
import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import styles from '../../styles/unused/RadarChart.module.css';

let colorRadar;

// Radar chart function from the code you provided
// Put the RadarChart function code here

function RadarChart(container, data, color, options){

    const cfg = {
        w: 20,
        h: 20,
        margin: {top: 0, right: 0, bottom: 0, left: 0},
        levels: 8,
        maxValue: 0,
        labelFactor: 1.1,
        wrapWidth: 60,
        opacityArea: 0.35,
        dotRadius: 3,
        strokeWidth: 1,
        roundStrokes: true,
        color: d3.scaleOrdinal().range([`${color}`])
    };

    if (typeof options !== 'undefined') {
        for (let i in options) {
            if (typeof options[i] !== 'undefined') { cfg[i] = options[i]; }
        }
    }

    // Remove the existing svg element by selecting it and calling remove()
    d3.select(container).select('svg').remove();

    // Initialize the SVG
    const svg = d3.select(container).append('svg')
        .attr('width', cfg.w + cfg.margin.left + cfg.margin.right)
        .attr('height', cfg.h + cfg.margin.top + cfg.margin.bottom)
        .append('g')
        .attr('transform', `translate(${(cfg.w/2 + cfg.margin.left)}, ${(cfg.h/2 + cfg.margin.top)})`);


    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    let maxValue = Math.max(cfg.maxValue, 
        d3.max(data, function(i)
        { return d3.max(i.map(function(o){ return o.value; })); }));

    const allAxis = data[0].map((i, j) => i.axis),  //Names of each axis
        total = allAxis.length,                    //The number of different axes
        radius = Math.min(cfg.w/2, cfg.h/2),       //Radius of the outermost circle
        Format = d3.format('.0%'),                 //Percentage formatting
        angleSlice = Math.PI * 2 / total;          //The width in radians of each "slice"

    //Scale for the radius
    const rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);

        //d3.select(container).select('svg').remove();
    //Create the container SVG and g elements
    // const svg = d3.select(id).append("svg")
    //     .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
    //     .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
    //     .append("g")
    //     .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
    
    //Circular segments
    const axisGrid = svg.append("g").attr("class", "axisWrapper");

    //Draw the background circles
    axisGrid.selectAll(".levels")
       .data(d3.range(1, cfg.levels+1).reverse())
       .enter()
       .append("circle")
       .attr("class", "gridCircle")
       .attr("r", function(d, i){return radius/cfg.levels*d;})
       .style("fill", "#CDCDCD")
       .style("stroke", "#CDCDCD")
       .style("fill-opacity", cfg.opacityArea);

    //Create the straight lines radiating outward from the center
    const axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
    //Append the lines
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2))
        .attr("y2", (d, i) => rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2))
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "15px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", (d, i) => rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
        .text(d => d);

    // The Radar chart function assumes this shape data is in 'myData'
    const radarLine = d3.lineRadial()
        .curve(d3.curveCardinalClosed)  // Apply smoothing to the line
        .radius(function(d) { return rScale(d.value); })
        .angle(function(d, i) { return i * angleSlice; });

    const radarWrapper = svg.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");

    radarWrapper.append("path")
        .attr("class", "radarArea")
        .attr("d", function(d, i) { return radarLine(d); })
        .style("fill", function(d, i) { return cfg.color(i); })
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function(event, d) {
            // Increase opacity of region
            d3.select(this).style("fill-opacity", 0.7);
        })
        .on('mouseout', function() {
            // Set back to initial opacity
            d3.select(this).style("fill-opacity", cfg.opacityArea);
        });

    //Create the outlines   
    radarWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function(d, i) { return radarLine(d); })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function(d, i) { return cfg.color(i); })
        .style("fill", "none")
        .style("filter", "url(#glow)");

    //Append the circles
    radarWrapper.selectAll(".radarCircle")
        .data(function(d, i) { return d; })
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", function(d, i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d, i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", function(d, i, j) { return cfg.color(j); })
        .style("fill-opacity", 0.8);

    //Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    radarWrapper.selectAll(".radarCircle")
        .on('mouseover', function(event, d) {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(Format(d.value))
                .style("left", (event.pageX - 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on('mouseout', function() {
            tooltip.transition().duration(500).style("opacity", 0);
        });

    //Wrap every label in a span tag
    // axis.selectAll(".legend")
    //     .call(wrap, cfg.wrapWidth);
}


// data, genotype, treatment, time, color
// Component to display the radar chart
const RadarChartComponent = (props) => {
// const RadarChartComponent = ({ data, color }) => {
  // Create a ref for the D3 container
  const d3Container = useRef(null);
//   console.log("****************************")
//   console.log(props.data)
  useEffect(() => {
    if (props.data && d3Container.current) {
      // Call the RadarChart function to create the chart
      RadarChart(d3Container.current, props.data, props.color);
      }
    }, [props.data, props.color, d3Container]);

  return (
    <div ref={d3Container} className={styles.radarChart}></div>
  );
//   (<div id="radar-chart" ref={d3Container} />);
};



export default RadarChartComponent;
