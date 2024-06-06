import { evaluate } from 'mathjs';
import React, { useEffect, useRef, useState } from 'react';
import { RadarChart } from '../../RadarChart'; // Import the RadarChart function
import styles from '../../../styles/seed/seedDay10/SeedDay10RadarCharts.module.css';


// Function to calculate the user-defined vegetation index
function calculateVegetationIndex(equation, data) {
  const { seedAverageR: R, seedAverageG: G, seedAverageB: B } = data;
  try {
    return evaluate(equation, { R, G, B });
  } catch (error) {
    console.error('Error evaluating equation:', error);
    return 0;
  }
}

// Function to transform JSON data into a suitable format for the RadarChartComponent
function transformSeedRadarDataForDay10(jsonData, branchIndex, seedIndex, equations) {
  let seedData  = jsonData["branch10Day"]["branchInd_" + branchIndex]["branchSeed"]["branchSeedInd" + seedIndex];
  let seedRadarData = [[
    {axis: "volumeSeed", value: seedData["seedVolume"] / 5000,},
    {axis: "lengthSeed", value: seedData["seedLength"] / 300, },
    {axis: "widthSeed", value: seedData["seedWidth"] / 90, },
    {axis: "indSeed", value: seedIndex / 20, },
    {axis: "branchAverageR", value: calculateVegetationIndex(equations.equation1, seedData) / 255, },
    {axis: "branchAverageG", value: calculateVegetationIndex(equations.equation2, seedData) / 255, },
    {axis: "branchAverageB", value: calculateVegetationIndex(equations.equation3, seedData) / 255, },
    {axis: "branchAverageBB", value: calculateVegetationIndex(equations.equation4, seedData) / 255, },
    // {axis: "branchAverageR", value: seedData["seedAverageR"] / 255, },
    // {axis: "branchAverageG", value: seedData["seedAverageG"] / 255, },
    // {axis: "branchAverageB", value: seedData["seedAverageB"] / 255, },
    // {axis: "branchAverageBB", value: seedData["seedAverageB"] / 255, },
    ]]
  return seedRadarData;
}


const SeedDay10RadarCharts = ({ chartsBranchDataSample, branchIndex, seedIndex, equations }) => {
  const radarRef = useRef();
  useEffect(() => {    
    fetch(`/data/summaryFeature/${chartsBranchDataSample.link}`)
      .then(response => response.json())
      .then(data => {
        let seedRadarDataNotZero = transformSeedRadarDataForDay10(data, branchIndex, seedIndex, equations);
        RadarChart(radarRef.current, seedRadarDataNotZero, [chartsBranchDataSample["color"]], 200, 200);
      })
      .catch(error => console.error('Error fetching data:', error));
  // });
  }, [chartsBranchDataSample, equations]);


  return (
    <div ref={radarRef} className={styles.seedDay10RadarChart}></div>
  );
};

export default SeedDay10RadarCharts;
