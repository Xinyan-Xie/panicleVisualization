import * as d3 from 'd3';
import React, { useEffect, useState, useRef, createRef } from 'react';
import styles from '../../styles/segment/SegementTimeDiff.module.css';
import { RadarChart } from '../RadarChart';

const SegementTimeDiff = ({ chartsData }) => {

  const gridTimeDiffRefs = useRef([]);
  gridTimeDiffRefs.current = Array(chartsData["numIndex"]).fill().map(() => React.createRef());

  useEffect(() => {
    // console.log("useEffect chartsData, ", chartsData);
    Object.keys(chartsData).forEach(sampleKey  => {
      let result = [];
      let colors = [];
      var cellIndex;
      Object.keys(chartsData[sampleKey]).forEach(dayKey  => {
        cellIndex = chartsData[sampleKey][dayKey].sampleIndex;
        if ((chartsData[sampleKey][dayKey].data) && 
            Array.isArray(chartsData[sampleKey][dayKey].data)) {
          result = result.concat(chartsData[sampleKey][dayKey].data);  // Concatenate the array
          colors = colors.concat(chartsData[sampleKey][dayKey].color);
        }
      });
      const divTimeDiff = gridTimeDiffRefs.current[cellIndex];
      if (divTimeDiff) {
        const widthIndRadar = divTimeDiff.current.clientWidth * 0.97;
        const heightIndRadar = widthIndRadar;
        RadarChart(divTimeDiff.current, result, colors, widthIndRadar, heightIndRadar);
      }
      // });
    });
  // });
  // }, []);
  }, [chartsData]);   

  return (
    <div className={styles.segmentTimeDiffChartsGroup}>
      {gridTimeDiffRefs.current.map((ref, index) => (
        <div key={index} 
          ref={ref} 
          className={styles.segmentTimeDiffChartsGroupEach}>
        </div>
      ))}
    </div>   
  );
};

export default SegementTimeDiff;
