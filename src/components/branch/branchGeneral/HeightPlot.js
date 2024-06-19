import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import styles from '../../../styles/branch/branchGeneral/HeightPlot.module.css';

function getNodeIndexes(data) {
  const numberOfBranches = data['numOfBranchesDay10'];
  const outerListLength = 3;
  const nestedList = [];

  for (let i = 0; i < outerListLength; i++) {
    const innerList = [];
    for (let j = 0; j < numberOfBranches; j++) {
      innerList.push(j);
    }
    nestedList.push(innerList);
  }

  data['branchesConnection'].forEach((indices, outerIndex) => {
    indices.forEach(index => {
      if (index < numberOfBranches) {
        nestedList[outerIndex][index] = -1;
        for (let j = index + 1; j < numberOfBranches; j++) {
          nestedList[outerIndex][j] -= 1;
        }
      }
    });
  });

  const transposedList = nestedList[0].map((_, colIndex) => nestedList.map(row => row[colIndex]));

  return transposedList;
}

function VerticalRuler(container, width, height) {
  const margin = { top: 0, right: 45, bottom: 20, left: 30 },
        innerWidth = width - margin.left - margin.right,
        innerHeight = height - margin.top - margin.bottom;

  d3.select(container).selectAll('*').remove();
  const svg = d3.select(container)
                .append("svg")
                .attr('width', width)
                .attr('height', height);

  // Define the scale
  const yScale = d3.scaleLinear()
                   .domain([60, 280])
                   .range([innerHeight, 20]);

  // Define the axis
  const yAxis = d3.axisRight(yScale)
                  .tickValues(d3.range(60, 290, 10));

  // Customize the tick marks
  yAxis.tickFormat(d => (d % 20 !== 0 ? '' : d));

  // Append the axis to the SVG
  svg.append("g")
    //  .attr("transform", "translate(" + margin.left + ",0)")
     .attr("transform", "translate(" + (width - margin.right) + ",0)") // Move the axis to the right
     .call(yAxis)
     .selectAll("line")
     .attr("x2", d => (d % 20 !== 0 ? 5 : 10))
     .attr("stroke-width", d => (d % 20 !== 0 ? 1 : 1.5));

  svg.selectAll(".tick text")
     .attr("x", -8)
     .attr("font-size", 15)
     .attr("font-weight", "bold")
     .attr("text-anchor", "end"); // Align text to the right
}

function HeightPlotFunc(container, branchGeneralDataSample, colors, width, height) {
  const data = branchGeneralDataSample['branchHeight'];
  const nodeIndexes = getNodeIndexes(branchGeneralDataSample);

  d3.select(container).selectAll('*').remove();

  const margin = { top: 20, right: 5, bottom: 20, left: 5 },
        innerWidth = width - margin.left - margin.right,
        innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select(container)
                .append("svg")
                .attr("width", innerWidth + margin.left + margin.right)
                .attr("height", innerHeight + margin.top + margin.bottom);

  svg.append("rect")
     .attr("x", 0)
     .attr("y", 0)
     .attr("width", innerWidth + margin.left + margin.right)
     .attr("height", innerHeight + margin.top + margin.bottom)
     .attr("fill", 'rgba(199, 199, 199, 0.3)');

  const color = d3.scaleOrdinal().range(colors);
  
  const categories = ['4D', '7D', '10D'];
  const x = d3.scaleBand()
              .domain(categories)
              .range([0, innerWidth])
              .padding(0.1);

  const y = d3.scaleLinear()
              .domain([60, 280])
              .range([innerHeight, 0]);

  const flatData = Object.keys(data).flatMap(
    key => data[key].map(
      value => ({
        category: key, value: value
      })
    )
  );

  svg.selectAll(".referenceLine")
     .data(categories)
     .join("line")
     .attr("class", "line")
     .attr("x1", d => x(d) + x.bandwidth() / 2 + margin.left)
     .attr("y1", margin.top)
     .attr("x2", d => x(d) + x.bandwidth() / 2 + margin.left)
     .attr("y2", innerHeight + margin.top)
     .attr("stroke-width", 2)
     .attr("stroke", "darkgray")
     .style("stroke-dasharray", ("3, 3"));

  // Tooltip
  const tooltip = d3
    // .select("body")
    .select(container)
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("width", "71px")
    .style("height", "30px")
    .style("background", "lightgray")
    .style("background", `${colors[0]}80`)
    .style("border", "1px solid red")
    .style("border", `1px solid ${colors[2]}`)
    .style("border-radius", "8px")
    // .style("padding", "5px")
    .style("text-align", "center")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("display", "flex")
    .style("justify-content", "center")
    .style("align-items", "center");

  svg.selectAll(".dot")
    .data(flatData)
    .join("circle")
    .attr("class", "dot")
    .attr("cx", d => x(d.category) + x.bandwidth() / 2 + margin.left)
    .attr("cy", d => y(d.value))
    .attr("r", 5)
    .style("fill", d => color(d.category))
    .on('mouseover', function (event, d) {
      d3.select(this).style('opacity', 0.7);
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(d.value.toFixed(2))
        .style("left", "4px")
        .style("top", "10px");
        // .style("left", `${event.pageX + 10}px`)
        // .style("top", `${event.pageY - 28}px`);
      })
      .on('mousemove', function (event) {
      tooltip
        .style("left", "4px")
        .style("top", "10px");
        // .style("left", `${event.pageX + 10}px`)
        // .style("top", `${event.pageY - 28}px`);
      })
    .on('mouseout', function () {
      d3.select(this).style('opacity', 1);
      tooltip.transition().duration(500).style("opacity", 0);
    });

  const lineGenerator = d3.line()
                          .x(d => x(d.category) + x.bandwidth() / 2 + margin.left)
                          .y(d => y(d.value))
                          .curve(d3.curveCardinal);

  nodeIndexes.forEach((indexes, i) => {
    const specifiedNodes = indexes.map((nodeIndex, categoryIdx) => {
      if (nodeIndex === -1) return null;
      const category = categories[categoryIdx];
      if (nodeIndex < data[category]?.length) {
        return { category: category, value: data[category][nodeIndex] };
      }
      return null;
    }).filter(node => node !== null);

    svg.append("path")
       .datum(specifiedNodes)
       .attr("d", lineGenerator)
       .attr("fill", "none")
       .attr("stroke", colors[2])
       .attr("stroke-width", 2)
       .attr("stroke-dasharray", "5,5");
  });
}

const HeightPlot = ({ branchGeneralData }) => {
  const gridRefs = useRef([]);
  gridRefs.current = Array(Object.keys(branchGeneralData).length + 1).fill().map(() => React.createRef());

  useEffect(() => {

    const div = gridRefs.current[0];
    if (div) {
      VerticalRuler(div.current, 80, 465);
    }

    Object.keys(branchGeneralData).forEach(sampleKey => {
      const cellIndex = branchGeneralData[sampleKey]["sampleIndex"] + 1;
      const div = gridRefs.current[cellIndex];
      if (div) {
        const branchGeneralDataSample = branchGeneralData[sampleKey];
        HeightPlotFunc(div.current, branchGeneralDataSample, branchGeneralData[sampleKey]["colors"], 80, 465);
      }
    });
  }, [branchGeneralData]);

  return (
    <div className={styles.branchHeightPlot}>
      <div ref={gridRefs.current[0]} className={`${styles.branchHeightPlotEach} ${styles.verticalRuler}`}></div>
      {gridRefs.current.slice(1).map((ref, index) => (
      // {gridRefs.current.map((ref, index) => (
        <div key={index} 
             ref={ref}
             className={styles.branchHeightPlotEach} >
        </div>
      ))}
    </div>  
  );
};

export default HeightPlot;
