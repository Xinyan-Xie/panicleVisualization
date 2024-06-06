import * as d3 from 'd3';
import React, { useEffect, useState, useRef, createRef } from 'react';
import styles from '../../styles/segment/SegementIndividualRadar.module.css';
import { RadarChart } from '../RadarChart';

const SegementIndividualRadar = ({ chartsData }) => {

  const gridRefs = useRef([]);
  gridRefs.current = Array(chartsData["numIndex"]  * 3).fill().map(() => React.createRef());
  useEffect(() => {
    Object.keys(chartsData).forEach(sampleKey  => {
      if ((sampleKey !== 'numIndex') && (sampleKey !== 'genoMap') && (sampleKey !== 'trtMap')) {
        Object.keys(chartsData[sampleKey]).forEach(dayKey  => {
          const cellIndex = chartsData[sampleKey][dayKey].sampleIndex * 3 + chartsData[sampleKey][dayKey].dayIndex;
          const div = gridRefs.current[cellIndex].current;
          
          if (div) {
            const widthIndRadar = div.clientWidth * 0.97;
            // const widthIndRadar = div.getBoundingClientRect().width;
            const heightIndRadar = widthIndRadar;
            RadarChart(div, chartsData[sampleKey][dayKey].data, [chartsData[sampleKey][dayKey].color], widthIndRadar, heightIndRadar);
          }
        });
      }
    });
  // });  
  // }, []); 
  }, [chartsData]); 
  
  return (
    <div className={styles.segmentIndividualChartsGroup}>
      {gridRefs.current.map((ref, index) => (
        <div key={index} 
          ref={ref} 
          className={styles.segmentIndividualChartsGroupEach}>
        </div>
      ))}
    </div>   
  );
};

export default SegementIndividualRadar;
