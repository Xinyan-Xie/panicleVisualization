import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import styles from '../../../styles/seed/seedGeneral/VectorChartPlot.module.css';

const calculateAngle = (point1, point2) => {
  return Math.atan2(point2[1] - point1[1], point2[0] - point1[0]);
};

const rotatePoint = (origin, point, angle) => {
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);
  const x = point[0] - origin[0];
  const y = point[1] - origin[1];
  const newX = x * cosAngle - y * sinAngle + origin[0];
  const newY = x * sinAngle + y * cosAngle + origin[1];
  return [newX, newY];
};

const findFirstValidIndex = (data) => {
  for (let i = 0; i < data["4D"].length; i++) {
    if (data["4D"][i].length && data["7D"][i].length && data["10D"][i].length) {
      return i;
    }
  }
  return -1; // Return -1 if no valid index is found
};

const transformData = (inputData) => {
  const i = findFirstValidIndex(inputData);

  if (i === -1) {
    console.error("No valid index found with non-empty arrays in all sets.");
    return inputData; // Return the original data if no valid index is found
  }

  const baseAngle = calculateAngle([0, 0], inputData["4D"][i]);
  const angleB = baseAngle - calculateAngle([0, 0], inputData["7D"][i]);
  const angleC = baseAngle - calculateAngle([0, 0], inputData["10D"][i]);

  const alignAngles = (set, rotationAngle) => {
    const origin = set[i];
    return set.map((point, index) => {
      if (index === i || point.length === 0) return point; // Skip the ith index and empty arrays
      return rotatePoint(origin, point, rotationAngle);
    });
  };

  const transformedData = {
    "4D": inputData["4D"],
    "7D": alignAngles(inputData["7D"], angleB),
    "10D": alignAngles(inputData["10D"], angleC)
  };

  return transformedData;
};


function getNodeIndexes(data) {

  const numberBranch = data['numOfBranchesDay10'];
  const posData = data['seedPos'];
  const positions = data['branchesConnection'];

  const categories = Object.keys(posData);

  const newObj  = {};
  categories.forEach((category, index) => {
    let originalArray = [...posData[category]];
    let newArray = [];
    let posIndex = 0;

    for (let i = 0; i < numberBranch; i++) {
      if (positions[index][posIndex] === i) {
        newArray.push([]); // Insert zero at the specified position
        posIndex++;
      } else {
        if (originalArray.length > 0) {
          newArray.push(originalArray.shift()); // Take the next value from the original array
        } else {
          newArray.push([]); // Use 0 if the original array is exhausted
        }
      }
    }
    newObj[category] = newArray;
  });

  return newObj;
}


function VectorChart(container, seedGeneralDataSample, colors, width, height) {
  // Prepare the data
  const oriData = getNodeIndexes(seedGeneralDataSample);
  const data = transformData(oriData);
  const vectors = [];
  const minLength = Math.min(data["4D"].length, data["7D"].length, data["10D"].length);

  for (let i = 0; i < minLength; i++) {
    const a = data["4D"][i];
    const b = data["7D"][i];
    const c = data["10D"][i];

    // Add vector from A to B if both are valid
    if (a.length && b.length) {
      vectors.push([a, b]);
    }

    // Add vector from B to C if both are valid
    if (b.length && c.length) {
      vectors.push([b, c]);
    }
  }

  // Clear previous chart if it exists
  d3.select(container).selectAll('*').remove();
  
  // Create SVG canvas
  const svg = d3.select(container).append("svg")
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const colorScale = d3.scaleOrdinal().range(colors);

  //Circular segments
  const levels = 5;
  const radius = Math.min(width/2, height/2);
  const axisGrid = svg.append("g")
    .attr("class", "axisWrapper");
    // .attr("transform", `translate(${width / 2}, ${height / 2})`);  // Centering the group

    //Draw the background circles
    axisGrid.selectAll(".levels")
    .data(d3.range(1, levels+1).reverse())
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", function(d, i){return radius/levels*d;})
    .style("fill", "#CDCDCD")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", 0.35);


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
  vectors.forEach((vector, i) => {
    const color = i % 2 === 0 ? colors[1] : colors[2];
    svg.append('path')
      .attr('d', d3.line()(vector))
      .attr('class', 'vector')
      .attr('stroke', color)
      .attr('stroke-width', 0.5)
      .attr('fill', 'none')
      .attr('marker-end', 'url(#arrowhead)');
  });

  // Draw circles at data points for visualization
  const allPoints = data["4D"]
    .concat(data["7D"], data["10D"])
    .filter(point => point.length);

  svg.selectAll('circle')
    .data(allPoints)
    .enter()
    .append('circle')
    .attr('cx', d => d[0])  // Scale x position
    .attr('cy', d => d[1])  // Scale y position
    .attr('r', 2)
    .attr('fill', (d, i) => {
      if (i < data["4D"].length) return colors[0]; // Set 4D
      if (i < data["4D"].length + data["7D"].length) return colors[1]; // Set 7D
      return colors[2]; // Set 10D
    });
}


const VectorChartPlot = ({ seedGeneralData }) => {

  const gridRefs = useRef([]);
  gridRefs.current = Array(seedGeneralData["genoMap"]["count"] * 2)
                    .fill().map(() => React.createRef());
  useEffect(() => {
    Object.keys(seedGeneralData).forEach(sampleKey  => {
      if ((sampleKey !== 'numIndex') && (sampleKey !== 'genoMap') && (sampleKey !== 'trtMap')) {
        const cellIndex = seedGeneralData[sampleKey]["genoIndex"] * 2 
                        + seedGeneralData[sampleKey]["treatIndex"];
        const div = gridRefs.current[cellIndex];
        if (div) {
          const seedGeneralDataSample = seedGeneralData[sampleKey];
          const widthDiv = div.current.clientWidth;
          VectorChart(div.current, seedGeneralDataSample, seedGeneralDataSample["colors"], 
          widthDiv, widthDiv);
        }
      }
    });
  // });   
  }, [seedGeneralData]);

  return (
    <div className={styles.seedVectorChartPlot}>
      {gridRefs.current.map((ref, index) => (
        <div key={index} 
             ref={ref}
             className={styles.seedVectorChartPlotEach} >
        </div>
      ))}
    </div>  
  );
};

export default VectorChartPlot;
