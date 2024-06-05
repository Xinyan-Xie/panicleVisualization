import * as d3 from 'd3';
import React, { useEffect, useState, useRef, createRef } from 'react';
import styles from '../../styles/segment/SegementGenoDiff.module.css';
import SegementGenoDiffLabel from './SegementGenoDiffLabel';
import { RadarChart } from '../RadarChart';

function transformData(data) {
  let result = {"genoMap": data["genoMap"]};
  Object.keys(data).forEach(sampleKey => {
    if ((sampleKey !== 'numIndex') && (sampleKey !== 'genoMap') && (sampleKey !== 'trtMap')) {

      Object.entries(data[sampleKey]).forEach(([dayKey, dayData]) => {
        // if (dayData.genoIndex !== undefined) {
        const genoKey = dayData.genoIndex;
        if (!result[genoKey]) {
          result[genoKey] = {0: {}, 1: {}, 2:{}};
        }

        result[genoKey][dayData.dayIndex] = {
          ...(result[genoKey][dayData.dayIndex]),
          [dayData.treatIndex]: dayData
        };
        // }
      });
    }
  });

  return result;
}


const SegementGenoDiff = ({ chartsData }) => {
  const gridGenoDiffRefs = useRef([]);
  gridGenoDiffRefs.current = Array(chartsData["genoMap"]["count"] * 3).fill().map(() => React.createRef());

  const [genoChartsData, setGenoChartsData] = useState({});
  useEffect(() => {
    const newData = transformData(chartsData);
    setGenoChartsData(newData);
    Object.keys(genoChartsData).forEach(genoKey  => {
      if (genoKey !== 'genoMap') {
        Object.keys(genoChartsData[genoKey]).forEach(dayKey  => {
          let result = [];
          let colors = [];
          var cellIndex;
          
          Object.keys(genoChartsData[genoKey][dayKey]).forEach(trtKey  => {
            let cellIndexRow = genoChartsData[genoKey][dayKey][trtKey].genoIndex;
            let cellIndexCol = genoChartsData[genoKey][dayKey][trtKey].dayIndex;
            cellIndex = cellIndexRow * 3 + cellIndexCol;
            if ((genoChartsData[genoKey][dayKey][trtKey].data) && 
                Array.isArray(genoChartsData[genoKey][dayKey][trtKey].data)) {
              result = result.concat(genoChartsData[genoKey][dayKey][trtKey].data);  // Concatenate the array
              colors = colors.concat(genoChartsData[genoKey][dayKey][trtKey].color);
            }
          });
          const divGenoDiff = gridGenoDiffRefs.current[cellIndex];
          if (divGenoDiff) {
            const widthIndRadar = divGenoDiff.current.clientWidth * 0.97;
            const heightIndRadar = widthIndRadar;
            RadarChart(divGenoDiff.current, result, colors, widthIndRadar, heightIndRadar);
          }
          // });
        });
      }
    });
  }, [chartsData]);
  // }, []);
  // });

  return (
    <div className={styles.segmentGenoDiffChartsTitleGroup}>
      
      <div className={styles.segmentGenoDiffTitle}>

        <SegementGenoDiffLabel chartsData={chartsData} /> 

      </div>

      <div className={styles.segmentGenoDiffChartsGroup}>
        {gridGenoDiffRefs.current.map((ref, index) => (
          <div key={index} 
            ref={ref} 
            className={styles.segmentGenoDiffChartsGroupEach}>
          </div>
        ))}
      </div>

    </div>   
  );
};

export default SegementGenoDiff;
