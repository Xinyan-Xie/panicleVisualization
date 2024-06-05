import React, { useEffect, useState, useRef, createRef } from 'react';
import styles from '../../styles/segment/SegementIndividualRadarLabel.module.css';


const SegementGenoDiffLabel = ({ chartsData }) => {
  const gridRefs = useRef([]);
  gridRefs.current = Array(chartsData["genoMap"]["count"]).fill().map(() => React.createRef());
  useEffect(() => {
    Object.keys(chartsData["genoMap"]).forEach(genoKey  => {
      if ((genoKey !== 'count')) {
        const cellIndex = chartsData["genoMap"][genoKey];
        const div = gridRefs.current[cellIndex].current;
        if (div) {
          div.innerHTML = `
            <div style="width: 90%;
                        position: relative;
                        // top: 20%;
                        left: 5%;
                        text-align: center;
                        font-size: 18px;
                        font-weight: bold;
                        // background-color: lightgrey;
                        border-radius: 10px;
                        border: 1px solid black;    
              >
              <div style="text-align: center;">${genoKey}</div>
            <div>`;
        
          // Center the text within the parent div
          div.style.display = 'flex';
          div.style.flexDirection = 'column';
          div.style.alignItems = 'center';
          div.style.justifyContent = 'center';
          div.style.height = '100%'; // Ensure the parent div has a defined height
        }
      }
    });
  }
);   
  
  return (
    <div className={styles.segmentIndividualLabelsGroup}>
      {gridRefs.current.map((ref, index) => (
        <div key={index} 
          ref={ref} 
          className={styles.segmentIndividualLabelsGroupEach}>
        </div>
      ))}
    </div>   
  );
};

export default SegementGenoDiffLabel;
