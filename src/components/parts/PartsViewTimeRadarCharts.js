import React, { useEffect, useRef } from 'react';
import { RadarChart } from '../RadarChart'; // Import the RadarChart function
import styles from '../../styles/parts/PartsViewTimeRadarCharts.module.css';


const PartsViewTimeRadarCharts = ({ partsRadarData }) => {

  const gridRefs = useRef([]);
  gridRefs.current = Array(partsRadarData["genoMap"]["count"] * 2)
                    .fill().map(() => React.createRef());
  useEffect(() => {
    console.log("****partsRadarData, ", partsRadarData)
    // Object.keys(partsRadarData).forEach(sampleKey  => {
    for (const [sampleKey, sampleObject] of Object.entries(partsRadarData)) {
      if ((sampleKey !== 'numIndex') && (sampleKey !== 'genoMap') && (sampleKey !== 'trtMap')) {
        let result = [];
        let colors = [];
        for (const [dayKey, sampleDayObject] of Object.entries(sampleObject)) {
          result = result.concat(partsRadarData[sampleKey][dayKey]["partsRadarData"]);
          colors = colors.concat(partsRadarData[sampleKey][dayKey]["color"]);
        }
        const cellIndex = partsRadarData[sampleKey]["4D"]["genoIndex"] * 2 
                        + partsRadarData[sampleKey]["4D"]["treatIndex"];
        const div = gridRefs.current[cellIndex];
        if (div) {
          // const partsRadarDataSample = partsRadarData[sampleKey];
          const widthDiv = div.current.clientWidth;
          console.log("partsRadarData, ", result)
          console.log("partsRadarColor, ", colors)
          RadarChart(div.current, result, colors, widthDiv, widthDiv);
        }
      }
    }
  // });   
  }, [partsRadarData]);

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

export default PartsViewTimeRadarCharts;
