import * as d3 from 'd3';
import React, { useEffect, useState, useRef, createRef } from 'react';
import styles from '../../styles/segment/SegementIndividualRadar.module.css';
// import RadarChartComponent from '../unused/RadarChartComponent';


function RadarChart(container, data, color, widthIndRadar, heightIndRadar){

  const cfg = {
      w: widthIndRadar,
      h: heightIndRadar,
      levels: 8,
      maxValue: 1,
      labelFactor: 1,
      wrapWidth: 6,
      opacityArea: 0.35,
      dotRadius: 3,
      strokeWidth: 1,
      roundStrokes: true,
      color: d3.scaleOrdinal().range([`${color}`])
  };


  d3.select(container)
    .select('svg')
    .remove();

  // Initialize the SVG
  const svg = d3.select(container).append('svg')
      // .attr('width', '100%')
      // .attr('height', '100%')
      .attr('width', cfg.w)
      .attr('height', cfg.h)
      .append('g')
      .attr('transform', `translate(${(cfg.w/2)}, ${(cfg.h/2)})`);

  let maxValue = cfg.maxValue;
  //If the supplied maxValue is smaller than the actual one, replace by the max in the data
  // let maxValue = Math.max(cfg.maxValue, 
  //     d3.max(data, function(i) { 
  //         return d3.max(i.map(function(o){ 
  //           return o.value; 
  //         })); 
  //     })
  //   );
  // console.log("data in D3, ", data)

  const allAxis = data[0].map((i, j) => i.axis),  //Names of each axis
      total = allAxis.length,                    //The number of different axes
      radius = Math.min(cfg.w/2, cfg.h/2),       //Radius of the outermost circle
      Format = d3.format('.0%'),                 //Percentage formatting
      angleSlice = Math.PI * 2 / total;          //The width in radians of each "slice"
  // console.log("allAxis in D3, ", allAxis)

  const rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);
  // console.log("rScale in D3, ", rScale)

  //Circular segments
  const axisGrid = svg.append("g").
                  attr("class", "axisWrapper");
  // console.log("axisGrid in D3, ", axisGrid)

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
      .attr("x2", (d, i) => rScale(maxValue*1) * Math.cos(angleSlice*i - Math.PI/2))
      .attr("y2", (d, i) => rScale(maxValue*1) * Math.sin(angleSlice*i - Math.PI/2))
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-width", "2px");

  // //Append the labels at each axis
  // axis.append("text")
  //     .attr("class", "legend")
  //     .style("font-size", "15px")
  //     .attr("text-anchor", "middle")
  //     .attr("dy", "0.35em")
  //     .attr("x", (d, i) => rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
  //     .attr("y", (d, i) => rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
  //     .text(d => d);

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



const SegementIndividualRadar = ({ chartsData }) => {

  console.log("chartsData Individual, ", chartsData)
  const gridRefs = useRef([]);
  gridRefs.current = Array(chartsData["numIndex"]  * 3).fill().map(() => React.createRef());
  useEffect(() => {
    Object.keys(chartsData).forEach(sampleKey  => {
      if ((sampleKey !== 'numIndex') && (sampleKey !== 'genoMap') && (sampleKey !== 'trtMap')) {
        Object.keys(chartsData[sampleKey]).forEach(dayKey  => {
          const cellIndex = chartsData[sampleKey][dayKey].sampleIndex * 3 + chartsData[sampleKey][dayKey].dayIndex;
          const div = gridRefs.current[cellIndex].current;
          
          if (div) {
            const radarData = chartsData[sampleKey][dayKey]['data']
            const widthIndRadar = div.clientWidth;
            // const widthIndRadar = div.getBoundingClientRect().width;
            const heightIndRadar = widthIndRadar;
            RadarChart(div, chartsData[sampleKey][dayKey].data, chartsData[sampleKey][dayKey].color, widthIndRadar, heightIndRadar);
          }
        });
      }
    });
  });   
  
  return (
    <div className={styles.segmentIndividualChartsGroup}>
      {gridRefs.current.map((ref, index) => (
        <div key={index} 
          ref={ref} 
          className={styles.segmentIndividualChartsGroupEach}>
        </div>
      ))}
    </div>   
  );
};

export default SegementIndividualRadar;
