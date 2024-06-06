import React, { useEffect, useRef } from 'react';
import { RadarChart } from '../RadarChart'; // Import the RadarChart function
import styles from '../../styles/parts/PartsViewRadarCharts.module.css';

// Function to transform JSON data into a suitable format for the RadarChartComponent
function transformPartsRadarData(jsonData, buttonIndex) {
  const partData = "segmentInd_" + buttonIndex;
  const dataForChart = [
    { axis: 'Height', value: jsonData["segment"][partData]["endHeight"] / 300 },
    { axis: 'Volume', value: jsonData["segment"][partData]["volumeSeg"] / 10000 },
    { axis: 'Spread', value: jsonData["segment"][partData]["maxSpreadSegVal"] / 50 },
    { axis: 'Branches', value: jsonData["segment"][partData]["noTopSeedSeg"] / 10 },
    { axis: 'Vegetation Index 1', value: jsonData["segment"][partData]["colAvgR"] },
    { axis: 'Vegetation Index 2', value: jsonData["segment"][partData]["colAvgG"] },
    { axis: 'Vegetation Index 3', value: jsonData["segment"][partData]["colAvgB"] },
    { axis: 'Vegetation Index 4', value: jsonData["segment"][partData]["colAvgB"] },
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

const PartsViewRadarCharts = ({ dataMaps, buttonIndex }) => {
  const gridRefs = useRef([]);
  gridRefs.current = Array(dataMaps["numIndex"] * 3).fill().map(() => React.createRef());

  useEffect(() => {
    for (const [sampleKey, sampleObject] of Object.entries(dataMaps)) {
      if (sampleKey !== 'numIndex' && sampleKey !== 'genoMap' && sampleKey !== 'trtMap') {
        Object.entries(sampleObject).forEach(([dayKey, sampleDayObject]) => {
          let partsRadarData;
          if (sampleDayObject.link) {
            fetch(`/data/summaryFeature/${sampleDayObject.link}`)
              .then(response => response.json())
              .then(data => {
                partsRadarData = transformPartsRadarData(data, buttonIndex);
                const cellIndex = dataMaps[sampleKey][dayKey].sampleIndex * 3 + dataMaps[sampleKey][dayKey].dayIndex;
                const div = gridRefs.current[cellIndex].current;
                if (div) {
                  const widthIndRadar = div.clientWidth;
                  RadarChart(div, partsRadarData, [dataMaps[sampleKey][dayKey]["color"]], widthIndRadar, widthIndRadar);
                }
              })
              .catch(error => console.error('Error fetching data:', error));
          } else {
            partsRadarData = transformPartsRadarDataForNone();
            const cellIndex = dataMaps[sampleKey][dayKey].sampleIndex * 3 + dataMaps[sampleKey][dayKey].dayIndex;
            const div = gridRefs.current[cellIndex].current;
            if (div) {
              const widthIndRadar = div.clientWidth;
              RadarChart(div, partsRadarData, [dataMaps[sampleKey][dayKey]["color"]], widthIndRadar, widthIndRadar);
            }
          }
        });
      }
    }
  }, [dataMaps, buttonIndex]);

  return (
    <div className={styles.partsViewRadarChartsGroup}>
      {gridRefs.current.map((ref, index) => (
        <div key={index} 
          ref={ref} 
          className={styles.partsViewRadarChartsGroupEach}>
        </div>
      ))}
    </div>
  );
};

export default PartsViewRadarCharts;
