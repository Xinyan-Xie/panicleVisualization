import * as d3 from 'd3';
import React, { useEffect, useState, useRef, createRef } from 'react';
import styles from '../../styles/segment/SegementTrtDiff.module.css';
import SegementTrtDiffLabel from './SegementTrtDiffLabel';
import { RadarChart } from '../RadarChart';

function transformTrtData(data) {
  let result = {"trtMap": data["trtMap"]};
  Object.keys(data).forEach(sampleKey => {
    if ((sampleKey !== 'numIndex') && (sampleKey !== 'genoMap') && (sampleKey !== 'trtMap')) {

      Object.entries(data[sampleKey]).forEach(([dayKey, dayData]) => {
        // if (dayData.genoIndex !== undefined) {
        const trtKey = dayData.treatIndex;
        if (!result[trtKey]) {
          result[trtKey] = {0: {}, 1: {}, 2:{}};
        }

        result[trtKey][dayData.dayIndex] = {
          ...(result[trtKey][dayData.dayIndex]),
          [dayData.genoIndex]: dayData
        };
      });
    }
  });

  return result;
}


const SegementTrtDiff = ({ chartsData }) => {

  const gridTrtDiffRefs = useRef([]);
  gridTrtDiffRefs.current = Array(chartsData["trtMap"]["count"] * 3).fill().map(() => React.createRef());
  const [trtChartsData, setTrtChartsData] = useState({});
  useEffect(() => {
    const newData = transformTrtData(chartsData);
    setTrtChartsData(newData);
    Object.keys(trtChartsData).forEach(trtKey  => {
      if (trtKey !== 'trtMap') {
        Object.keys(trtChartsData[trtKey]).forEach(dayKey  => {
          let result = [];
          let colors = [];
          var cellIndex;
          Object.keys(trtChartsData[trtKey][dayKey]).forEach(genoKey  => {
            let cellIndexRow = trtChartsData[trtKey][dayKey][genoKey].treatIndex;
            let cellIndexCol = trtChartsData[trtKey][dayKey][genoKey].dayIndex;
            cellIndex = cellIndexRow * 3 + cellIndexCol;
            if ((trtChartsData[trtKey][dayKey][genoKey].data) && 
                Array.isArray(trtChartsData[trtKey][dayKey][genoKey].data)) {
              result = result.concat(trtChartsData[trtKey][dayKey][genoKey].data);  // Concatenate the array
              colors = colors.concat(trtChartsData[trtKey][dayKey][genoKey].color);
            }
          });
          const divTrtDiff = gridTrtDiffRefs.current[cellIndex];
          if (divTrtDiff) {
            const widthIndRadar = divTrtDiff.current.clientWidth * 0.97;
            const heightIndRadar = widthIndRadar;
            RadarChart(divTrtDiff.current, result, colors, widthIndRadar, heightIndRadar);
          }
        });
      }
    });
  }, [chartsData]); 
  // }, []);
  // });

  return (
    <div className={styles.segmentTrtDiffChartsTitleGroup}>
      
      <div className={styles.segmentTrtDiffTitle}>
        
        <SegementTrtDiffLabel chartsData={chartsData} /> 
        {/* <div className={styles.segmentTrtDiffTitleEach}> 
          <div className={styles.segmentTrtDiffTitleFont}>CONTROL </div>
        </div>

        <div className={styles.segmentTrtDiffTitleEach}> 
          <div className={styles.segmentTrtDiffTitleFont}>HDNT </div>
        </div> */}
      </div>

      <div className={styles.segmentTrtDiffChartsGroup}>
        {gridTrtDiffRefs.current.map((ref, index) => (
          <div key={index} 
            ref={ref} 
            className={styles.segmentTrtDiffChartsGroupEach}>
          </div>
        ))}
      </div>

    </div>   
  );
};

export default SegementTrtDiff;
