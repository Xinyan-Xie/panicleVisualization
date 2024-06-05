import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import styles from '../../../styles/branch/branchGeneral/SpreadHistPlot.module.css';



function getNodeIndexes(data) {

  const maxLength = 12;
  const spreadData = data['branchSpread'];
  const positions = data['branchesConnection'];

  const categories = Object.keys(spreadData);

  const newObj  = {};
  categories.forEach((category, index) => {
    let originalArray = [...spreadData[category]];
    let newArray = [];
    let posIndex = 0;

    for (let i = 0; i < maxLength; i++) {
      if (positions[index][posIndex] === i) {
        newArray.push(0); // Insert zero at the specified position
        posIndex++;
      } else {
        if (originalArray.length > 0) {
          newArray.push(originalArray.shift()); // Take the next value from the original array
        } else {
          newArray.push(0); // Use 0 if the original array is exhausted
        }
      }
    }

    newObj[category] = newArray;
  });

  const transformedData = Array.from({ length: maxLength }, (_, i) => {
    const obj = { index: i };
    categories.forEach(category => {
      obj[category] = newObj[category][i] !== undefined ? newObj[category][i] : 0; // Use 0 if there's no data for the category
    });
    return obj;
  });
  return transformedData;
}

function HistPlotFunc(container, branchGeneralDataSample, colors, width, height){

  // const data = branchGeneralDataSample['branchHeight'];
  const data = getNodeIndexes(branchGeneralDataSample);
  d3.select(container).selectAll('*').remove();

  const svg = d3.select(container).append("svg")
    .attr('width', width)
    .attr('height', height)
    .append('g');

  const margin = { top: 10, right: 15, bottom: 20, left: 20 };
  const categories = ['4D', '7D', '10D'];
  const subgroups = categories;
    
  const x0 = d3.scaleBand()
    .domain(data.map(d => d.index))
    .range([margin.left, width - margin.right])
    .padding(0.2);
    
  const x1 = d3.scaleBand()
    .domain(subgroups)
    .range([0, x0.bandwidth()])
    .padding(0.05);
    
  const y = d3.scaleLinear()
    // .domain([0, d3.max(data, d => d3.max(subgroups, key => d[key]))])
    .domain([0, 50])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Add the x-axis and remove ticks
  const xAxis = svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x0).tickFormat(d => `${d}`));
    
  // Remove x-axis tick lines
  xAxis.selectAll('.tick line').remove();
    
  // Add horizontal grid lines with 10 ticks
  const yAxisGrid = d3.axisLeft(y)
    .tickSize(-width + margin.left + margin.right)
    .tickFormat('')
    .ticks(5);

  const yAxisGridGroup = svg.append('g')
    .attr('class', 'y axis-grid')
    .attr('transform', `translate(${margin.left},0)`)
    .call(yAxisGrid);
    
  // Remove the leftmost vertical line (the y-axis line)
  yAxisGridGroup.select('.domain').remove();

  // Change the color of the horizontal grid lines to orange
  yAxisGridGroup.selectAll('.tick line').attr('stroke', 'darkgray');
    
  // Add y-axis with 4 value labels
  const yAxis = d3.axisLeft(y).ticks(5); // Add y-axis with 4 ticks
  const yAxisGroup = svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${margin.left},0)`)
    .call(yAxis);

  // Remove the y-axis tick lines but keep the tick labels
  yAxisGroup.selectAll('.tick line').remove();
  yAxisGroup.select('.domain').remove();
    
  // Add y-axis label
  // svg.append('text')
  //   .attr('class', 'y axis-label')
  //   .attr('text-anchor', 'middle')
  //   .attr('transform', `translate(${margin.left / 4},${height / 2})rotate(-90)`)
  //   .text('Value'); // Change 'Value' to your desired label

  // const color = d3.scaleOrdinal()
  //   .domain(subgroups)
  //   .range(['#4daf4a', '#377eb8', '#ff7f00']);

  const color = d3.scaleOrdinal().range(colors);

  const groups = svg.selectAll('.bar-group')
    .data(data)
    .enter()
    .append('g')
    .attr('transform', d => `translate(${x0(d.index)},0)`);
    
  // Append transparent background rect for each group
  groups.append('rect')
    .attr('x', 0)
    .attr('y', margin.top)
    .attr('width', x0.bandwidth())
    .attr('height', height - margin.bottom - margin.top)
    .attr('fill', 'rgba(199, 199, 199, 0.3)'); // Dark gray background color with transparency
    
  
  
  // Tooltip
  const tooltip = d3
    // .select("body")
    .select(container)
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("width", "50px")
    .style("height", "18px")
    .style("background", "lightgray")
    .style("background", `${colors[0]}80`)
    .style("border", "1px solid red")
    .style("border", `1px solid ${colors[2]}`)
    .style("border-radius", "8px")
    .style("padding", "5px")
    .style("text-align", "center")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("display", "flex")
    .style("justify-content", "center")
    .style("align-items", "center");

  // Append bars for each category in the group
  groups.selectAll('rect.bar')
    .data(d => subgroups.map(key => ({ key, value: d[key] })))
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => x1(d.key))
    .attr('y', d => y(d.value))
    .attr('width', x1.bandwidth())
    .attr('height', d => y(0) - y(d.value))
    .attr('fill', d => color(d.key))
    .style('opacity', 0.8)

    .on('mouseover', function (event, d) {
      d3.select(this).style('opacity', 0.8);
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(d.value.toFixed(2))
        // .style("left", `${event.pageX + 10}px`)
        // .style("top", `${event.pageY - 28}px`);
        .style("left", "20px")
        .style("top", "10px");
    })

    .on('mousemove', function (event) {
      tooltip
        // .style("left", `${event.pageX + 10}px`)
        // .style("top", `${event.pageY - 28}px`);
        .style("left", "20px")
        .style("top", "10px");
    })

    .on('mouseout', function () {
      d3.select(this).style('opacity', 0.8);
      tooltip.transition().duration(500).style("opacity", 0);
    });
}


const SpreadHistPlot = ({ branchGeneralData }) => {

  const gridRefs = useRef([]);
  gridRefs.current = Array(Object.keys(branchGeneralData).length).fill().map(() => React.createRef());
  useEffect(() => {
    Object.keys(branchGeneralData).forEach(sampleKey  => {
      const cellIndex = branchGeneralData[sampleKey]["sampleIndex"];
      const div = gridRefs.current[cellIndex];
      if (div) {
        const branchGeneralDataSample = branchGeneralData[sampleKey];
        const widthDiv = div.current.clientWidth;
        HistPlotFunc(div.current, branchGeneralDataSample, branchGeneralDataSample["colors"], widthDiv, 130);
      }
    });
  // });   
  }, [branchGeneralData]);

  return (
    <div className={styles.branchSpreadPlot}>
      {gridRefs.current.map((ref, index) => (
        <div key={index} 
             ref={ref}
             className={styles.branchSpreadPlotEach} >
        </div>
      ))}
    </div>  
  );
};

export default SpreadHistPlot;
