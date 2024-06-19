import { evaluate } from 'mathjs';
import React, { useEffect, useState } from 'react';
import PartsViewTimeRadarCharts from './PartsViewTimeRadarCharts'; // Import the RadarChart function
import styles from '../../styles/parts/PartsViewTimeRadar.module.css';

// Function to calculate the user-defined vegetation index
function calculateVegetationIndex(equation, data) {
  const { colAvgR: R, colAvgG: G, colAvgB: B } = data;
  try {
    return evaluate(equation, { R, G, B });
  } catch (error) {
    console.error('Error evaluating equation:', error);
    return 0;
  }
}

// Function to transform JSON data into a suitable format for the RadarChartComponent
function transformPartsRadarData(jsonData, buttonIndex, equations) {
  const partData = "segmentInd_" + buttonIndex;
  const dataForChart = [
    { axis: 'Height', value: jsonData["segment"][partData]["endHeight"] / 300 },
    { axis: 'Volume', value: jsonData["segment"][partData]["volumeSeg"] / 5000 },
    { axis: 'Spread', value: jsonData["segment"][partData]["maxSpreadSegVal"] / 50 },
    { axis: 'Branches', value: jsonData["segment"][partData]["noTopSeedSeg"] / 10 },
    { axis: 'Vegetation Index 1', value: calculateVegetationIndex(equations.equation1, jsonData["segment"][partData]) },
    { axis: 'Vegetation Index 2', value: calculateVegetationIndex(equations.equation2, jsonData["segment"][partData]) },
    { axis: 'Vegetation Index 3', value: calculateVegetationIndex(equations.equation3, jsonData["segment"][partData]) },
    { axis: 'Vegetation Index 4', value: calculateVegetationIndex(equations.equation4, jsonData["segment"][partData]) },
    // { axis: 'Vegetation Index 1', value: jsonData["segment"][partData]["colAvgR"] },
    // { axis: 'Vegetation Index 2', value: jsonData["segment"][partData]["colAvgG"] },
    // { axis: 'Vegetation Index 3', value: jsonData["segment"][partData]["colAvgB"] },
    // { axis: 'Vegetation Index 4', value: jsonData["segment"][partData]["colAvgB"] },
  ];
  return [dataForChart]; // RadarChart expects an array of these data arrays
}

// Function to transform JSON data into a suitable format for the RadarChartComponent
function transformPartsRadarDataForNone() {
  const dataForChart = [
    { axis: 'Height', value: 0 },
    { axis: 'Volume', value: 0 },
    { axis: 'Spread', value: 0 },
    { axis: 'Branches', value: 0 },
    { axis: 'Vegetation Index 1', value: 0 },
    { axis: 'Vegetation Index 2', value: 0 },
    { axis: 'Vegetation Index 3', value: 0 },
    { axis: 'Vegetation Index 4', value: 0 },
  ];
  return [dataForChart]; // RadarChart expects an array of these data arrays
}

const PartsViewTimeRadar = ({ dataMaps, buttonIndex, equations }) => {
  const [partsRadarData, setPartsRadarData] = useState({
    trtMap: dataMaps["trtMap"],
    genoMap: dataMaps["genoMap"],
    numIndex: dataMaps["numIndex"],
  });

  useEffect(() => {
    const fetchData = async () => {
      const updatedData = { 
        trtMap: dataMaps["trtMap"],
        genoMap: dataMaps["genoMap"],
        numIndex: dataMaps["numIndex"]
      };

      const fetchPromises = [];

      for (const [sampleKey, sampleObject] of Object.entries(dataMaps)) {
        if (sampleKey !== 'numIndex' && sampleKey !== 'genoMap' && sampleKey !== 'trtMap') {
          updatedData[sampleKey] = { "4D": {}, "7D": {}, "10D": {} };

          for (const [dayKey, sampleDayObject] of Object.entries(sampleObject)) {
            const fetchPromise = new Promise((resolve, reject) => {
              if (sampleDayObject.link) {
                fetch(`/data/summaryFeature/${sampleDayObject.link}`)
                  .then(response => response.json())
                  .then(data => {
                    const partsRadarData = transformPartsRadarData(data, buttonIndex, equations);
                    updatedData[sampleKey][dayKey] = {
                      "color": dataMaps[sampleKey][dayKey]["color"],
                      "genoIndex": dataMaps[sampleKey][dayKey]["genoIndex"],
                      "treatIndex": dataMaps[sampleKey][dayKey]["treatIndex"],
                      "partsRadarData": partsRadarData,
                    };
                    resolve();
                  })
                  .catch(error => {
                    console.error('Error fetching data:', error);
                    reject(error);
                  });
              } else {
                const partsRadarData = transformPartsRadarDataForNone();
                updatedData[sampleKey][dayKey] = {
                  "color": dataMaps[sampleKey][dayKey]["color"],
                  "genoIndex": dataMaps[sampleKey][dayKey]["genoIndex"],
                  "treatIndex": dataMaps[sampleKey][dayKey]["treatIndex"],
                  "partsRadarData": partsRadarData,
                };
                resolve();
              }
            });
            fetchPromises.push(fetchPromise);
          }
        }
      }
      await Promise.all(fetchPromises);
      setPartsRadarData(updatedData);
    };
    fetchData();
  }, [dataMaps, buttonIndex, equations]);

  return (
    <div className={styles.partsViewRadarChartsGroup}>
      <PartsViewTimeRadarCharts partsRadarData={partsRadarData} />
    </div>
  );
};

export default PartsViewTimeRadar;
